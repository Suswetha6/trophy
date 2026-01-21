from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import func, desc
from typing import List
from ..database import get_db
from ..models.project import Project, Star
from ..models.project import Project, Star
from ..models.user import User, Badge
from ..schemas.project import ProjectCreate, ProjectUpdate, Project as ProjectSchema
from ..utils.dependencies import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=ProjectSchema)
def create_project(
    project: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_project = Project(**project.dict(), owner_id=current_user.id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    # Check for "First Project" badge
    project_count = db.query(Project).filter(Project.owner_id == current_user.id).count()
    if project_count == 1:
        new_badge = Badge(
            name="First Project",
            description="Awarded for publishing your first project!",
            user_id=current_user.id
        )
        db.add(new_badge)
        db.commit()
        
    return db_project

@router.get("/", response_model=List[ProjectSchema])
def get_projects(
    skip: int = 0,
    limit: int = 20,
    sort_by: str = "newest",  # newest, most_starred
    tech_filter: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(
        Project,
        func.count(Star.id).label("star_count")
    ).outerjoin(Star).options(selectinload(Project.owner)).group_by(Project.id)
    
    # Apply filters
    if tech_filter:
        query = query.filter(Project.tech_stack.contains(tech_filter))
    
    # Apply sorting
    if sort_by == "most_starred":
        query = query.order_by(desc("star_count"))
    else:  # newest
        query = query.order_by(desc(Project.created_at))
    
    projects = query.offset(skip).limit(limit).all()
    
    # Format response
    result = []
    for project, star_count in projects:
        project_dict = ProjectSchema.from_orm(project).dict()
        project_dict["star_count"] = star_count
        result.append(project_dict)
    
    return result

@router.get("/{project_id}", response_model=ProjectSchema)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    star_count = db.query(func.count(Star.id)).filter(Star.project_id == project_id).scalar()
    project_dict = ProjectSchema.from_orm(project).dict()
    project_dict["star_count"] = star_count
    
    return project_dict

@router.put("/{project_id}", response_model=ProjectSchema)
def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if db_project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    for key, value in project_update.dict(exclude_unset=True).items():
        setattr(db_project, key, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if db_project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted successfully"}

@router.post("/{project_id}/star")
def star_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if already starred
    existing_star = db.query(Star).filter(
        Star.user_id == current_user.id,
        Star.project_id == project_id
    ).first()
    
    if existing_star:
        # Unstar
        db.delete(existing_star)
        db.commit()
        return {"message": "Project unstarred", "starred": False}
    else:
        # Star
        new_star = Star(user_id=current_user.id, project_id=project_id)
        db.add(new_star)
        db.commit()
        return {"message": "Project starred", "starred": True}
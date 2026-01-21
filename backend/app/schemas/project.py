from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from typing import Optional, List
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    description: str
    tech_stack: Optional[str] = None
    github_link: Optional[str] = None
    demo_link: Optional[str] = None
    image_urls: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    title: Optional[str] = None
    description: Optional[str] = None

class ProjectOwner(BaseModel):
    id: int
    name: str
    branch: Optional[str] = None
    year: Optional[int] = None
    
    class Config:
        from_attributes = True

class Project(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
    star_count: int = 0
    owner: Optional[ProjectOwner] = None
    
    class Config:
        from_attributes = True
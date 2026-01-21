from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.notification import Notification

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/")
def get_dashboard_data(db: Session = Depends(get_db)):
    # Fetch recent notifications (limit 5)
    notifications = db.query(Notification).order_by(Notification.created_at.desc()).limit(5).all()
    
    return {
        "notifications": [
            {"id": n.id, "message": n.message, "type": n.type} for n in notifications
        ]
    }

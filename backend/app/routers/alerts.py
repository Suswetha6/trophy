from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.notification import Notification
from ..utils.dependencies import get_current_user

router = APIRouter(prefix="/alerts", tags=["Alerts"])

class AlertBroadcast(BaseModel):
    message: str
    channels: List[str] = ["in-app"]  # email, sms, in-app
    target_group: Optional[str] = "all"  # all, branch_cs, year_1, etc.

def send_email_mock(message: str):
    print(f"[Mock Email] Sending: {message}")

def send_sms_mock(message: str):
    print(f"[Mock SMS] Sending: {message}")

@router.post("/broadcast")
def broadcast_alert(
    alert: AlertBroadcast,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can broadcast alerts")
    
    # Process channels
    if "email" in alert.channels:
        background_tasks.add_task(send_email_mock, alert.message)
    
    if "sms" in alert.channels:
        background_tasks.add_task(send_sms_mock, alert.message)
        
    # Save to database
    new_notification = Notification(
        message=alert.message,
        type="alert",  # Or map from alert.channels/target_group
        target_group=alert.target_group
    )
    db.add(new_notification)
    db.commit()
    
    return {"message": f"Alert broadcasted to {len(alert.channels)} channels"}

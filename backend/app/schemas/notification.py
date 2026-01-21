from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationBase(BaseModel):
    message: str
    type: Optional[str] = "info"
    target_group: Optional[str] = "all"

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

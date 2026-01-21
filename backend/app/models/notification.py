from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from ..database import Base

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    type = Column(String, default="info")  # info, alert, warning, success
    target_group = Column(String, default="all")  # all, branch_cs, year_1, etc.
    created_at = Column(DateTime, default=datetime.utcnow)

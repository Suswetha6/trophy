from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .project import Project

class UserBase(BaseModel):
    email: EmailStr
    name: str
    branch: Optional[str] = None
    year: Optional[int] = None
    skills: Optional[str] = None

class Badge(BaseModel):
    name: str
    description: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    is_admin: bool = False
    badges: List[Badge] = []
    projects: List[Project] = []
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
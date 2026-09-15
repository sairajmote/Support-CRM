from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class TicketCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: str
    @field_validator("subject")
    @classmethod
    def validate_subject(cls, value):
        if not value.strip():
            raise ValueError("Subject cannot be empty")
        return value
    
    @field_validator("customer_email")
    @classmethod
    def validate_email(cls, value):
        if not value.strip():
            raise ValueError("Subject cannot be empty")
        return value
    


class TicketResponse(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TicketUpdate(BaseModel):
    customer_name: str | None = None
    customer_email: EmailStr | None = None
    subject: str | None = None
    description: str | None = None
    status: Literal["Open","In Progress","Resolved", "Closed"] | None = None

class NoteCreate(BaseModel):
    content: str

    @field_validator("content")
    @classmethod
    def validate_content(cls, value):
        if not value.strip():
            raise ValueError("Note content cannot be empty")
        return value


class NoteResponse(BaseModel):
    id: int
    ticket_id: int
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.database import Base

from sqlalchemy.orm import relationship


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)

    ticket_id = Column(String, unique=True, nullable=False, index=True)

    customer_name = Column(String, nullable=False)

    customer_email = Column(String, nullable=False)

    subject = Column(String, nullable=False)

    description = Column(Text, nullable=False)

    status = Column(String, nullable=False, default="Open")

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )   
    notes = relationship(
    "Note",
    back_populates="ticket",
    cascade="all, delete-orphan",
)
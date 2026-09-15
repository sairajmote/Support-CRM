from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from app.database import get_db
from app.models.ticket import Ticket
from app.schemas.ticket import (
    TicketCreate,
    TicketResponse,
    TicketUpdate,
    NoteCreate,
    NoteResponse,
)
from app.models.notes import Note



router = APIRouter(
    prefix="/api/tickets",
    tags=["Tickets"],
)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db),
):
    last_ticket = (
        db.query(Ticket)
        .order_by(desc(Ticket.id))
        .first()
    )

    if last_ticket:
        next_number = last_ticket.id + 1
    else:
        next_number = 1

    ticket_id = f"TKT-{next_number:03d}"

    new_ticket = Ticket(
        ticket_id=ticket_id,
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description,
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return {
        "ticket_id": new_ticket.ticket_id,
        "created_at": new_ticket.created_at,
    }
@router.get("/", response_model=list[TicketResponse])
def get_tickets(
    status: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Ticket)

    if status:
        query = query.filter(Ticket.status == status)
        
    if search:
        query = query.filter(
            or_(
            Ticket.ticket_id.ilike(f"%{search}%"),
            Ticket.customer_name.ilike(f"%{search}%"),
            Ticket.customer_email.ilike(f"%{search}%"),
            Ticket.subject.ilike(f"%{search}%"),
            Ticket.description.ilike(f"%{search}%"),
            Ticket.ticket_id.like(f"%{search}%")
            )
        )

    tickets = query.all()
    
   

    return tickets

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
    ):
    ticket = (
        db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    )
    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket Not Found"
        )
    return ticket

@router.put("/{ticket_id}", response_model=TicketResponse)
def Update_ticket(
    ticket_id: str,
    ticket: TicketUpdate,
    db: Session = Depends(get_db),
):
    existing_ticket = (
        db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    )
    if not existing_ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket Not found",
        )
    update_data = ticket.model_dump(exclude_unset=True)
    for field, value in update_data.items() :
        setattr(existing_ticket, field, value)
    db.commit()
    db.refresh(existing_ticket)
    return existing_ticket

@router.post(
    "/{ticket_id}/notes",
    response_model=NoteResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_notes(
    ticket_id: str,
    note: NoteCreate,
    db: Session = Depends(get_db),
):
    ticket = (
        db.query(Ticket)
        .filter(Ticket.ticket_id == ticket_id)
        .first()
    )
    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket Not Found",
        )
    new_note = Note(
        ticket_id=ticket.id,
        content=note.content,
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return new_note


@router.get("/{ticket_id}/notes", response_model=list[NoteResponse])
def get_notes(
    ticket_id: str,
    db: Session = Depends(get_db),
):
    ticket = (
        db.query(Ticket)
        .filter(Ticket.ticket_id == ticket_id)
        .first()
    )
    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket Not Found",
        )
    notes = (
        db.query(Note)
        .filter(Note.ticket_id == ticket.id)
        .order_by(Note.created_at.asc())
        .all()
    )
    return notes
    
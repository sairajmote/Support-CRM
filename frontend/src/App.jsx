import { useEffect, useState } from "react"
import { API_BASE_URL } from "./config"
import "./App.css"

function App() {

  const [tickets, setTickets] = useState([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [ticketDetails, setTicketDetails] = useState(null)
  const [notes, setNotes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const ticketsPerPage = 5
  const [newNote, setNewNote] = useState("")
  const [newTicket, setNewTicket] = useState(
    {
      customer_name: "",
      customer_email: "",
      subject: "",
      description: "",
    }
  )

  const totalPages = Math.ceil(tickets.length / ticketsPerPage)

  const startIndex = (currentPage - 1) * ticketsPerPage
  const endIndex = startIndex + ticketsPerPage

  const currentTickets = tickets.slice(startIndex, endIndex)




  const updateTicket = () => {
    fetch(
      `${API_BASE_URL}/api/tickets/${ticketDetails.ticket_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: ticketDetails.status,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setTicketDetails(data)
        setTickets((currentTickets) =>
          currentTickets.map((ticket) =>
            ticket.ticket_id === data.ticket_id
              ? data
              : ticket

          ))
        setTicketDetails(null)
        setSelectedTicket(null)

      })

  }

  const createTicket = () => {

    fetch(`${API_BASE_URL}/api/tickets/`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(newTicket),

    })

      .then(async (response) => {

        const data = await response.json()

        console.log("STATUS:", response.status)
        console.log("RESPONSE:", data)

        if (!response.ok) {

          if (response.status === 422) {
            alert("Please fill the * Required Information")
            return
          }

          throw new Error(JSON.stringify(data))
        }

        return data
      })

      .then((data) => {

        // Don't continue if validation failed
        if (!data) return

        setShowForm(false)

        setNewTicket({
          customer_name: "",
          customer_email: "",
          subject: "",
          description: "",
        })

        // refreshing
        fetch(`${API_BASE_URL}/api/tickets`)
          .then((response) => response.json())
          .then((data) => {
            setTickets(data)
          })
      })

      .catch((error) => {
        console.error("CREATE TICKET ERROR:", error)
      })
  }


  const addNote = () => {
    fetch(
      `${API_BASE_URL}/api/tickets/${ticketDetails.ticket_id}/notes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newNote,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setNotes((currentNotes) => [
          ...currentNotes,
          data,
        ])

        setNewNote("")
      })
  }


  useEffect(() => {
    const params = new URLSearchParams()

    if (search) {
      params.append("search", search)
    }
    if (status) {
      params.append("status", status)
    }
    setCurrentPage(1)
    fetch(`${API_BASE_URL}/api/tickets?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => setTickets(data))

  }, [search, status])

  useEffect(() => {
    if (!selectedTicket) {
      return
    }
    fetch(`${API_BASE_URL}/api/tickets/${selectedTicket}`)
      .then((resposne) => resposne.json())
      .then((data) => { setTicketDetails(data) })

    fetch(`${API_BASE_URL}/api/tickets/${selectedTicket}/notes`)
      .then((resposne) => resposne.json())
      .then((data) => setNotes(data || []))

  }, [selectedTicket])

  return (
    <div className="app">

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">S</div>

          <div>
            <h1>Support CRM</h1>
            <span>Customer support</span>
          </div>
        </div>

        <button className="new-ticket-btn"
          onClick={() => setShowForm(true)}>
          <span>+</span>
          New ticket
        </button>
      </header>


      <main className="dashboard">
        {ticketDetails && (
          <section className="ticket-details">


            <button
              className="back-btn"
              onClick={() => {
                setTicketDetails(null)
                setSelectedTicket(null)
              }}
            >
              ← Back to tickets
            </button>

            <div className="details-header">

              <div>
                <span className="details-ticket-id">
                  {ticketDetails.ticket_id}
                </span>

                <h2>{ticketDetails.subject}</h2>
              </div>

              <span
                className={`status status-${ticketDetails.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {ticketDetails.status}
              </span>

            </div>


            <div className="details-grid">

              <div className="details-main">

                <div className="details-block">
                  <h3>Description</h3>

                  <p>
                    {ticketDetails.description}
                  </p>
                </div>

              </div>
              <div className="details-status">
                <label>Status</label>

                <select
                  value={ticketDetails.status}
                  onChange={(e) => {
                    setTicketDetails({
                      ...ticketDetails,
                      status: e.target.value,
                    })
                  }}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
                <button
                  className="save-status-btn"
                  onClick={updateTicket}
                >
                  Save changes
                </button>

              </div>

              <aside className="customer-card">

                <h3>Customer</h3>

                <p className="customer-name">
                  {ticketDetails.customer_name}
                </p>

                <p className="customer-email">
                  {ticketDetails.customer_email}
                </p>

              </aside>

            </div>


            <div className="details-meta">

              <div>
                <span>Created</span>
                <strong>
                  {new Date(
                    ticketDetails.created_at
                  ).toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Last updated</span>
                <strong>
                  {new Date(
                    ticketDetails.updated_at
                  ).toLocaleString()}
                </strong>
              </div>

            </div>
            <div className="details-notes">

              <h3>Notes</h3>

              {notes.length === 0 ? (
                <p>No notes yet.</p>
              ) : (
                notes.map((note) => (
                  <div className="note" key={note.id}>
                    <p>{note.content}</p>

                    <span>
                      {new Date(note.created_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}

              <div className="add-note">

                <textarea
                  placeholder="Write a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />

                <button
                  onClick={addNote}
                  disabled={!newNote.trim()}
                >
                  Add note
                </button>

              </div>

            </div>

          </section>
        )}

        {showForm && (
          <div className="new-ticket-form">

            <h2>Create New Ticket</h2>

            <input
              type="text"
              placeholder="Customer name"
              value={newTicket.customer_name}
              onChange={(e) =>
                setNewTicket({
                  ...newTicket,
                  customer_name: e.target.value,
                })
              }
            />
            <label className="required">* Required</label>
            <input
              type="email"
              placeholder="Customer email"
              value={newTicket.customer_email}
              onChange={(e) =>
                setNewTicket({
                  ...newTicket,
                  customer_email: e.target.value,
                })
              }
            />
            <label className="required">* Required</label>
            <input
              type="text"
              placeholder="Subject"
              value={newTicket.subject}
              onChange={(e) =>
                setNewTicket({
                  ...newTicket,
                  subject: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Describe the issue..."
              value={newTicket.description}
              onChange={(e) =>
                setNewTicket({
                  ...newTicket,
                  description: e.target.value,
                })
              }
            />

            <button onClick={createTicket}>
              Create ticket
            </button>

            <button onClick={() => setShowForm(false)}>
              Cancel
            </button>

          </div>
        )}

        <section className="intro">
          <div>
            <p className="eyebrow">WORKSPACE / TICKETS</p>

            <h2>Tickets</h2>

            <p className="intro-text">
              Manage customer requests and keep conversations moving.
            </p>
          </div>

          <div className="total-count">
            <strong>{tickets.length}</strong>
            <span>Total tickets</span>
          </div>
        </section>


        <section className="stats">

          <div className="stat">
            <div className="stat-top">
              <span className="stat-dot open"></span>
              <span>Open</span>
            </div>

            <strong>
              {tickets.filter((ticket) => ticket.status === "Open").length}
            </strong>
          </div>


          <div className="stat">
            <div className="stat-top">
              <span className="stat-dot progress"></span>
              <span>In progress</span>
            </div>

            <strong>
              {tickets.filter(
                (ticket) => ticket.status === "In Progress"
              ).length}
            </strong>
          </div>


          <div className="stat">
            <div className="stat-top">
              <span className="stat-dot resolved"></span>
              <span>Resolved</span>
            </div>

            <strong>
              {tickets.filter(
                (ticket) => ticket.status === "Resolved"
              ).length}
            </strong>
          </div>


          <div className="stat">
            <div className="stat-top">
              <span className="stat-dot closed"></span>
              <span>Closed</span>
            </div>

            <strong>
              {tickets.filter(
                (ticket) => ticket.status === "Closed"
              ).length}
            </strong>

          </div>

        </section>


        {!ticketDetails &&
          <section className="ticket-section">

            <div className="toolbar">

              <div className="search-box">
                <span className="search-icon">⌕</span>

                <input
                  type="text"
                  placeholder="Search by customer, email or subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>


              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>

            </div>


            <div className="ticket-list">

              {currentTickets.map((ticket) => (

                <article
                  className="ticket"
                  key={ticket.ticket_id}
                  onClick={() => setSelectedTicket(ticket.ticket_id)}
                >

                  <div className="ticket-left">

                    <span className="ticket-id">
                      {ticket.ticket_id}
                    </span>

                    <div className="ticket-info">

                      <h3>{ticket.subject}</h3>

                      <p>
                        {ticket.customer_name}
                        <span className="separator">·</span>
                        {ticket.customer_email}
                      </p>

                      <span className="ticket-description">
                        {ticket.description}
                      </span>

                    </div>

                  </div>


                  <div className="ticket-right">

                    <span
                      className={`status status-${ticket.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {ticket.status}
                    </span>

                    <span className="ticket-date">
                      {new Date(
                        ticket.updated_at
                      ).toLocaleDateString()}
                    </span>

                    <span className="arrow">→</span>

                  </div>

                </article>

              ))}


              {tickets.length === 0 && (
                <div className="empty-state">
                  <h3>No tickets found</h3>
                  <p>
                    Try changing your search or status filter.
                  </p>
                </div>
              )}

            </div>
            <div className="pagination">

              <button
                onClick={() => {
                  setCurrentPage(currentPage - 1)
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => {
                  setCurrentPage(currentPage + 1)
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>

            </div>

          </section>
        }
      </main>

    </div>
  )
}

export default App
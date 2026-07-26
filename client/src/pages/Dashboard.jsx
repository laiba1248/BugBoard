import './Dashboard.css'
import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'


function Dashboard() {
  const [bugs, setBugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('medium')
  const navigate = useNavigate()
  const [users, setUsers] = useState([])

 
    useEffect(() => {
  const fetchBugs = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/api/bugs', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBugs(response.data.bugs)
    } catch (err) {
      setError('Failed to load bugs')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(response.data.users)
    } catch (err) {
      console.error('Failed to load users')
    }
  }

  fetchBugs()
  fetchUsers()
}, [])

  

{/* function to create a bug*/}
  const handleCreateBug = async (e) => {
  e.preventDefault()
  setError('')

  try {
    const token = localStorage.getItem('token')
    const response = await api.post(
      '/api/bugs',
      { title, description, severity },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setBugs([response.data.bug, ...bugs])
    setTitle('')
    setDescription('')
    setSeverity('medium')
  } catch (err) {
    setError('Failed to create bug')
  }
}

{/*Update the bugs*/ }
const handleStatusChange = async (bugId, newStatus) => {
  try {
    const token = localStorage.getItem('token')
    const response = await api.put(
      `/api/bugs/${bugId}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setBugs(bugs.map((bug) => (bug.id === bugId ? response.data.bug : bug)))
  } catch (err) {
    setError('Failed to update bug status')
  }
}

{/*to change the assignee */}
const handleAssigneeChange = async (bugId, newAssigneeId) => {
  try {
    const token = localStorage.getItem('token')
    const response = await api.put(
      `/api/bugs/${bugId}`,
      { assigneeId: newAssigneeId || null },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setBugs(bugs.map((bug) => (bug.id === bugId ? response.data.bug : bug)))
  } catch (err) {
    setError('Failed to update assignee')
  }
}

{/*Delete the bugs*/ }
const handleDelete = async (bugId) => {
  try {
    const token = localStorage.getItem('token')
    await api.delete(`/api/bugs/${bugId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    setBugs(bugs.filter((bug) => bug.id !== bugId))
  } catch (err) {
    setError('Failed to delete bug')
  }
}

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  if (loading) return <p>Loading bugs...</p>

  return (
    <div className='dashboard-conatiner'>
      <div className="dashboard-header">
  <h1>BugBoard</h1>
  <p className="subtitle">Track, triage, and resolve issues</p>
  <button className="logout-btn" onClick={handleLogout}>Logout</button>
</div>

      {error && <p className="error-text">{error}</p>}

    
{/*form for bug creation*/}
  <form className="create-bug-form" onSubmit={handleCreateBug}>
  <h3>Report a Bug</h3>
  <input
    type="text"
    placeholder="Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
  />
  <br />
  <textarea
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    required
  />
  <br />
  <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
    <option value="critical">Critical</option>
  </select>
  <br />
  <button type="submit">Create Bug</button>
</form>


{/*  bug card layout*/}
<h2 className="section-heading">Active Bugs</h2>
      <div className='bug-list'>
        {bugs.map((bug) => (
      <div key={bug.id} className={`bug-card severity-${bug.severity}`}>
    <h3>{bug.title}</h3>
    <p>{bug.description}</p>

    <div className="bug-meta">
  <span className={`badge badge-${bug.severity}`}>{bug.severity}</span>
  <span className="meta-date">{new Date(bug.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
</div>

<div className="people-row">
  <div className="person-block">
    <span className="person-label">Reporter : </span>
    <span className="person-name">{bug.reporter?.name}</span>
  </div>
  <div className="person-block">
    <span className="person-label">Assignee: </span>
    <span className={`person-name ${!bug.assignee ? 'unassigned' : ''}`}>
      {bug.assignee?.name || 'Unassigned'}
    </span>
  </div>
</div>
    
    <div className='status-row'>
    <label>Change status</label>
    <select
      value={bug.status}
      onChange={(e) => handleStatusChange(bug.id, e.target.value)}
    >
      <option value="open">Open</option>
      <option value="in_progress">In Progress</option>
      <option value="in_review">In Review</option>
      <option value="resolved">Resolved</option>
      <option value="closed">Closed</option>
    </select>
    </div>

    <div className="status-row">
  <label>Assign to:</label>
  <select
    value={bug.assigneeId || ''}
    onChange={(e) => handleAssigneeChange(bug.id, e.target.value)}
  >
    <option value="">Unassigned</option>
    {users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    ))}
  </select>
</div>
    
    <button className='delete-btn' onClick={() => handleDelete(bug.id)} style={{ marginTop: '8px' }}>
      Delete
    </button>
  </div>
))}
      </div>
    </div>
  )
}

export default Dashboard
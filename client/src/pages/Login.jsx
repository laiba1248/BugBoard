import './Auth.css'
import {useState} from 'react'
import api from '../api/axios'
import { useNavigate} from 'react-router-dom'

function Login(){
    const [email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const[error,setError]=useState('')
    const navigate =useNavigate()

    const handleSubmit=async (e)=>{
        e.preventDefault()
        setError('')
        try{
            const response=await api.post('/api/auth/login',
                {
                    email,
                    password,
                }
            )
            localStorage.setItem('token',response.data.token)
            navigate('/dashboard')
        }
        catch(err){
            setError(err.response?.data?.message ||'Login failed')
        }
    }
    return(
        <div className='auth-container'>
          <h1>BugBoard</h1>
  <p className="subtitle">Welcome back, sign in to continue</p>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
           />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className='error' >{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </div>
  )
    
}
export default Login
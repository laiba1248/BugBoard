import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoutes'

function App(){
  return (
    <Routes>
      <Route path="/"element ={<Login/>}/>
      <Route path="/signup"element ={<Signup/>}/>
      <Route path="/dashboard"element ={
        <ProtectedRoute>
          <Dashboard/> {/*wrapped dashboard in protected which means unless we have a token we cant reach dashboard,check code of ProtectedRoutes.jsx*/}
        </ProtectedRoute>}/>

    </Routes>
  )
}
export default App
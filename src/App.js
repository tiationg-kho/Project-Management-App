import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import './App.css'
import Dashboard from './pages/dashboard/Dashboard';
import Create from './pages/create/Create';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Project from './pages/project/Project';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { useAuthContext } from './hooks/useAuthContext';
import OnlineUsers from './components/OnlineUsers';

function App() {
  const dotenv = require("dotenv")
  dotenv.config()
  const {authIsReady, user} = useAuthContext()
  
  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          {user && (
            <Sidebar />
          )}
          <div className='container'>
            <Navbar />
            <Routes>
              <Route exact path='/' element={<>{user && <Dashboard />}{!user && <Navigate to='/login'/>}</>} />
              <Route path='/create' element={<>{user && <Create />}{!user && <Navigate to='/login'/>}</>} />
              <Route path='/projects/:id' element={<>{user && <Project />}{!user && <Navigate to='/login'/>}</>} />
              <Route path='/login' element={<>{!user && <Login />}{user && <Navigate to='/'/>}</>} />
              <Route path='/signup' element={<>{!user && <Signup />}{user && <Navigate to='/'/>}</>} />
              <Route path='*' element={<Navigate to='/'/>} />
            </Routes>
          </div>
          {user && <OnlineUsers></OnlineUsers>}
        </BrowserRouter>
      )}
    </div>
  );
}

export default App

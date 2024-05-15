import { useState } from 'react'
import Navbar from './Components/Navbar.jsx'
import { Route, Routes, redirect } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import DonateBlood from './Pages/DonateBlood.jsx'
import RequestBlood from './Pages/RequestBlood.jsx'
import Footer from './Components/Footer.jsx'
import DonorDashboard from './Pages/DonorDashboard.jsx'
import RequestDashboard from './Pages/RequestDashboard.jsx'
import AdminLogin from './Pages/AdminLogin.jsx'
import DonorList from './Pages/DonorList.jsx'
import RequestList from './Pages/RequestList.jsx'
import Register from './Pages/Register.jsx'
import DeveloperContact from './Pages/DeveloperContact.jsx'




function App() {
  
  return (
    
        (window.location.pathname == '/admindashboard' || window.location.pathname == '/admindashboard/requestlist' || window.location.pathname == '/admindashboard/donorlist'  || window.location.pathname == '/admindashboard/register') ? (
          <>
              <Routes>
                  <Route exact path='/admindashboard' element={<AdminLogin />} />
                  <Route exact path='/admindashboard/requestlist' element={<RequestList />} />
                  <Route exact path='/admindashboard/donorlist' element={<DonorList />} />
                  <Route exact path='/admindashboard/register' element={<Register />} />
              </Routes>
          </>
        ) : (
          <>
            {
                window.location.pathname !== '/developer' ? (
                  <>
                    <Navbar /> 
                      <Routes> 
                          <Route exact path='/' element={<Home />} />       
                          <Route exact path='/request' element={<RequestBlood />} />
                          <Route exact path='/request/requestdashboard' element={<RequestDashboard />} /> 
                          <Route exact path='/donate' element={<DonateBlood />} />           
                          <Route exact path='/donate/donordashboard' element={<DonorDashboard />} />       
                      </Routes> 
                    <Footer />
                  </>
                ) : (
                  <>
                    <Routes>
                        <Route exact path='/developer' element={<DeveloperContact />} />
                    </Routes>
                  </>
                )
            }
          </>
        )
  )
}

export default App

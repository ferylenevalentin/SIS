import React from 'react'
import {BrowserRouter, Routes , Route} from "react-router-dom";
import Dashboard from './assets/Pages/Dashboard';
import AddStudent from './assets/Pages/AddStudent';
import AddUser from './assets/Pages/AddUser';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element={<Dashboard/>}/>
      <Route path = "/addstudent" element={<AddStudent />}/>
      <Route path = "/adduser" element={<AddUser />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
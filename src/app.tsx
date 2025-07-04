// src/App.tsx
import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import Login  from './SignIn';
import Home from './home';
import AuthSuccessPage from "./AuthSuccessPage";
import {ResetPassword} from './components/ResetPassword';
const App = () => {
  return (
    <Router>
        <Routes>
       <Route path="/" element={<SignUp />} />
       <Route path="/login" element={<Login />}/>
       <Route path="/home" element={<Home />}/>
       <Route path='/reset-password/:token' element={<ResetPassword />}/>
       <Route path="/auth/success" element={<AuthSuccessPage />} />
       </Routes>
      </Router>
  );
};

export default App;

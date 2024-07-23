import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import LoginPage from './pages/Login.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import AgendaPage from './pages/Agenda.tsx';
import NotFoundPage from './pages/404.tsx';
import TestPage from './tests/testPage.tsx';
import { HandleMessages } from './styling/components.tsx';

function App() {
  return (
    <HandleMessages>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/Agenda" element={<AgendaPage/>}/>
            <Route path="/Login" element={<LoginPage/>}/>
            <Route path="/Register" element={<RegisterPage/>}/>
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/test" element={<TestPage/>}/>
          </Routes>
        </BrowserRouter>
      </HandleMessages>
  )
}

export default App;
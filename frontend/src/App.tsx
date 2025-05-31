import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Browse from "./pages/browse";
import CreateTrade from './pages/createTrade';
import MyProfile from './pages/myProfile';
import ChangePassword from './pages/changePassword';
import CreateOffer from './pages/createOffer';
import SpecificTrade from './pages/specificTrade';
import io from 'socket.io-client';

const clientsocket = io('http://localhost:8000');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/create-trade" element={<CreateTrade />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/create-offer/:tradeId" element={<CreateOffer clientsocket={clientsocket} />} />
        <Route path="/trade/:tradeId" element={<SpecificTrade clientsocket={clientsocket} />} />

      </Routes>
    </BrowserRouter>
        
  );
}

export default App;

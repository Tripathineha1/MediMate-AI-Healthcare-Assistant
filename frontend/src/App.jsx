import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import Home from "./components/Home/Home.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Footer from "./components/Footer/Footer.jsx";
import RootPage from "./components/RootPage.jsx";
import MainChat from "./components/MainChat.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import About from "./components/about/About.jsx";
import Use from "./components/use/Use.jsx";
import Contact from "./components/contact/Contact.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path={"/"} element={<RootPage><Hero/><Home/><Use/><About/><Contact/><Footer/></RootPage>}/>
          <Route path={"/chat"} element={<RootPage><MainChat /></RootPage>}/>
          <Route path={"/dashboard"} element={<RootPage><Dashboard /></RootPage>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

'use client'
// import { NavbarProvider } from '../context/NavBarContext';

// import Navbar from "@/components/Navbar";
// import NavBarSettings from "@/components/NavBarSettings";
// import WelcomeCard from "@/components/WelcomeCard";

// Landing page

import LandingPage from "./home/LandingPage";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function Home() {
  return (
    <>
      <Provider store={store}>
        <LandingPage/>
      </Provider>
    </>
  );
}

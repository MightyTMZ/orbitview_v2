"use client";
// import { NavbarProvider } from '../context/NavBarContext';

// import Navbar from "@/components/Navbar";
// import NavBarSettings from "@/components/NavBarSettings";
// import WelcomeCard from "@/components/WelcomeCard";

// Landing page

import LandingPage from "./home/LandingPage";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";

export default function Home() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <LandingPage />
        </PersistGate>
      </Provider>
    </>
  );
}

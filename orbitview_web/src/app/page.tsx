"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Spinner from "@/components/Spinner/Spinner";
import { store, persistor } from "@/redux/store";
// import HomeFeed from "@/screens/HomeFeed";
import { LandingPage } from "../screens/LandingPage/LandingPage";

export default function Home() {
  return (
    <Provider store={store}>
      {/* PersistGate helps with the rehydration of persisted Redux state */}
      <PersistGate loading={<Spinner />} persistor={persistor}>
        <LandingPage />
      </PersistGate>
    </Provider>
  );
}

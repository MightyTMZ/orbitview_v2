"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Spinner from "@/components/Spinner/Spinner";
import { store, persistor } from "@/redux/store";
// import HomeFeed from "@/screens/HomeFeed";
import { LandingPage } from "../screens/LandingPage/LandingPage";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
// import HomeFeed from "@/screens/HomeFeed";
import SearchPage from "./search/Search";

export default function Home() {
  const { isAuthenticated, current_user } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <Provider store={store}>
      {/* PersistGate helps with the rehydration of persisted Redux state */}
      <PersistGate loading={<Spinner />} persistor={persistor}>
        {!isAuthenticated ? <LandingPage /> : <SearchPage />}
      </PersistGate>
    </Provider>
  );
}

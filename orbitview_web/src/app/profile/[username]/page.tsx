"use client";

import React from "react";
import ProfilePage from "./ProfilePage";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";

const page = () => {
  return (
    <div>
      <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <ProfilePage />
        </PersistGate>
      </Provider>
    </div>
  );
};

export default page;

"use client";

import React from "react";
import ProfilePage from "./ProfilePage";
import { PersistGate } from "redux-persist/integration/react";
import Spinner from "@/components/Spinner/Spinner";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";

const page = () => {
  return (
    <div>
      <Provider store={store}>
        <PersistGate loading={<Spinner />} persistor={persistor}>
          <ProfilePage content_type="articles"/>
        </PersistGate>
      </Provider>
    </div>
  );
};

export default page;

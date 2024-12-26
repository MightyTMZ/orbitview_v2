'use client'

import React from "react";
import ProfilePage from "./ProfilePage";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

const page = () => {
  return (
    <div>
      <Provider store={store}>
        
        <ProfilePage />
      </Provider>
    </div>
  );
};

export default page;

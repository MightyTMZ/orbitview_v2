'use client'

import React from "react";
import Login from "./Login";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

const page = () => {
  return (
    <div>
      <Provider store={store}>
        <Login />
      </Provider>
    </div>
  );
};

export default page;

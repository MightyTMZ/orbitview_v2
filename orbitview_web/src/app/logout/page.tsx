'use client'

import React from "react";
import Logout from "./Logout";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

const page = () => {
  return (
    <div>
      <Provider store={store}>
        
          <Logout />
      </Provider>
    </div>
  );
};

export default page;

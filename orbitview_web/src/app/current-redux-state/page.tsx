'use client'

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import ExampleComponent from "./TestComponent";

import React from 'react'

const page = () => {
  return (
    <div>
      <Provider store={store}>
        <ExampleComponent></ExampleComponent>
      </Provider>
    </div>
  )
}

export default page

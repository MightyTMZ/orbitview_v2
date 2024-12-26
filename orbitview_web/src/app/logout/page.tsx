import React from "react";
import Logout from "./Logout";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";
import Spinner from "@/components/Spinner/Spinner";
import { PersistGate } from "redux-persist/integration/react";

const page = () => {
  return (
    <div>
      <Provider store={store}>
        <PersistGate loading={<Spinner />} persistor={persistor}>
          <Logout />
        </PersistGate>
      </Provider>
    </div>
  );
};

export default page;

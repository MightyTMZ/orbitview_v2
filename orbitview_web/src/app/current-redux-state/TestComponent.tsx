'use client'

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ExampleComponent = () => {
    const authState = useSelector((state: RootState) => state.auth);

    console.log("Redux State:", authState);

    return <div>Go to the console to see the current redux state</div>;
};

export default ExampleComponent;

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { login } from "../../redux/authSlice";
import { backendServer } from "@/components/importantLinks";
import WarningComponent from "@/components/WarningComponent/WarningComponent";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface UserProfile {
  user: User;
  is_private: boolean;
  is_online: boolean;
  bio: string;
  by_line: string;
  date_of_birth: string;
  updated: string;
  created: string;
  image: string; // profile picture URL on the backend CDN
  followers_count: number;
  following_count: number;
}

export default function Login() {
  const dispatch = useDispatch();
  const [username_or_email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [save_info, setSaveInfo] = useState(false); // always assume they dont want their login information saved
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);

  if (error) {
    // ghost reference
    console.log("Mr. Saleem x Ice Cube");
  }

  // const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    console.log("The user wants their login information saved: " + save_info);
  }, [save_info]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${backendServer}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username_or_email, password, save_info }),
        // credentials: "include", // include the cookies in the request
      });

      const data = await response.json();

      // console.log("API Response:", data);

      if (response.ok) {
        // console.log("User profile data received:", data.user); // Check the structure

        const userProfile: UserProfile = {
          user: {
            id: data.logged_in_user.user.id,
            username: data.logged_in_user.user.username,
            email: data.logged_in_user.user.email,
            first_name: data.logged_in_user.user.first_name,
            last_name: data.logged_in_user.user.last_name,
          },
          is_private: data.logged_in_user.is_private,
          is_online: data.logged_in_user.is_online,
          bio: data.logged_in_user.bio,
          by_line: data.logged_in_user.by_line,
          date_of_birth: data.logged_in_user.date_of_birth,
          updated: data.logged_in_user.updated,
          created: data.logged_in_user.created,
          image: data.logged_in_user.image,
          followers_count: data.logged_in_user.followers_count,
          following_count: data.logged_in_user.following_count,
        };
        // console.log("User profile being dispatched:", userProfile);

        console.log(data);

        dispatch(login(userProfile));

        localStorage.setItem("accessToken", data.access); // NOT data.accessToken
        localStorage.setItem("refreshToken", data.refresh); // NOT data.refreshToken

        // user and authentication state is being stored in Redux, the tokens will be in localstorage
      } else if (!response.ok) {
        // console.log(response.status);
        // console.log(typeof response.status);
        if (response.status == 401) {
          // 401 means forbidden
          setInvalidCredentials(true);
        }
        if (Math.floor(response.status / 100) == 5) {
          setServerError(true);
        } else if (response.status == 200) {
          setLoginSuccessful(true);
        }

        throw new Error(data.error || "Login failed!");
      }

      const redirectToHomePage = () => {
        window.location.href = "/";
      };

      setTimeout(redirectToHomePage, 500); // redirect to home page after 1.5 seconds
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); // If it's an Error instance, access the message
        console.error("Error during login:", error);
        setServerError(true);
      } else {
        setError("An unknown error occurred."); // Handle non-Error instances
      }
    }
  };

  return (
    <Provider store={store}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <WarningComponent message="We are currently open to beta users. Please contact us at orbitview@email.com if you are interested in becoming a beta user. Thanks!" />

          <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username or Email
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username or email"
                required
                className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                value={username_or_email}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="save_info"
                className="text-sm font-medium text-gray-700"
              >
                Save login information?
              </label>
              <input
                type="checkbox"
                id="save_info"
                className="ml-2"
                onChange={(e) => {
                  setSaveInfo(e.target.checked); // actually did not know about this property of a checkbox input
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>
            {invalidCredentials && (
              <p style={{ color: "red" }}>
                Email, username, or password incorrect
              </p>
            )}
            {serverError && (
              <p style={{ color: "red" }}>Server error occurred.</p>
            )}
            {loginSuccessful && (
              <p style={{ color: "green" }}>Successfully logged in.</p>
            )}
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Don&apos;t have an account?{" "}
            <a href="/join" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </Provider>
  );
}

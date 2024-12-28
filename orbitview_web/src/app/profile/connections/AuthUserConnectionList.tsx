import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendServer } from "@/importantLinks";
import { fetchCsrfToken } from "@/components/API";

interface Connection {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

const ConnectionList: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API = axios.create({
    baseURL: backendServer, // Replace with your backend's base URL
    withCredentials: true,
  });

  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken"); // Assume the JWT token is stored in localStorage
    const csrfToken = fetchCsrfToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
  });

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await API.get(`/social/connections/`);
        setConnections(response.data.connections);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your Connections</h2>
      {connections.length ? (
        <ul>
          {connections.map((connection) => (
            <li key={connection.id}>
              {connection.first_name} {connection.last_name} (
              {connection.username})
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no connections yet.</p>
      )}
    </div>
  );
};

export default ConnectionList;

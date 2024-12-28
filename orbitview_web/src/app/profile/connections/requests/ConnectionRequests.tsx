import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendServer } from "@/importantLinks";

interface ConnectionRequest {
  id: number;
  sender: { username: string };
  receiver: { username: string };
  is_active: boolean;
}

const ConnectionRequests: React.FC = () => {
  const [receivedRequests, setReceivedRequests] = useState<ConnectionRequest[]>(
    []
  );
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `${backendServer}/connections/request/`,
          {
            withCredentials: true,
          }
        );
        setReceivedRequests(response.data.received_requests);
        setSentRequests(response.data.sent_requests);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (requestId: number, action: string) => {
    try {
      await axios.post(
        `${backendServer}/connections/request/${requestId}/${action}/`,
        {},
        { withCredentials: true }
      );
      // Refresh requests
      setReceivedRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err: any) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Connection Requests</h2>
      <div>
        <h3>Received</h3>
        <ul>
          {receivedRequests.map((request) => (
            <li key={request.id}>
              {request.sender.username}
              <button onClick={() => handleAction(request.id, "accept")}>
                Accept
              </button>
              <button onClick={() => handleAction(request.id, "decline")}>
                Decline
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Sent</h3>
        <ul>
          {sentRequests.map((request) => (
            <li key={request.id}>{request.receiver.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConnectionRequests;

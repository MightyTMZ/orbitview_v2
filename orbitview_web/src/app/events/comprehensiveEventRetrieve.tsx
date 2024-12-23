"use client";

import React from "react";
import { useEffect, useState } from "react";
import { comprehensiveEventsEndpoint } from "./endpoints";

interface Organizer {
  name: string;
  logo: string; // comes in a URL form
  contact_email: string;
  contact_phone: string;
  address: string;
  description: string;
  social_media_links: { [platform: string]: string };
  created_at: string; // ___ has been a member of OrbitView since ___ date
  updated_at: string;
  is_active: boolean;
}

interface Location {
  title: string;
  url: string;
}

interface Event {
  id: number;
  title: string; // image coming in as a URL
  banner_pic: string;
  organizer: Organizer[]; // many to many field
  date: string;
  location: string;
  locations: Location[];
  description: string;
}

const ComprehensiveEventRetrieve = () => {
  const [comprehensiveEvents, setComprehensiveEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultsCount, setResultCount] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [previousPageUrl, setPreviousPageUrl] = useState<string | null>(null);

  // Function to fetch events from the API
  const fetchComprehensiveEvents = async (url: string) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setResultCount(data.count);
      setComprehensiveEvents(data.results);
      setNextPageUrl(data.next);
      setPreviousPageUrl(data.previous);
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to load initial events from the API
  useEffect(() => {
    fetchComprehensiveEvents(comprehensiveEventsEndpoint);
  }, []);

  if (loading) {
    return <p>Loading comprehensive events...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <div className="p-4">
        <p>{resultsCount} results match</p>

        {comprehensiveEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow-md rounded-lg overflow-hidden mb-8 hover:shadow-lg transition-shadow duration-300"
          >
            {/* Banner Image */}
            <img
              src={event.banner_pic}
              alt={`${event.title} banner`}
              className="w-full h-64 object-cover"
            />

            {/* Event Content */}
            <div className="p-6">
              {/* Title and Date */}
              <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                <strong>Main Location:</strong> {event.location}
              </p>

              {/* Locations */}
              {event.locations.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-1">
                    Additional Locations:
                  </h3>
                  <ul className="list-disc ml-5 text-gray-700">
                    {event.locations.map((loc, index) => (
                      <li key={index}>
                        <a
                          href={loc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {loc.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <p
                className="text-gray-700 mt-3 mb-6"
                dangerouslySetInnerHTML={{ __html: event.description }}
              ></p>

              {/* Organizers */}
              <h3 className="font-semibold text-lg mb-3">Organizers:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.organizer.map((org, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-gray-100 p-4 rounded-md shadow-sm"
                  >
                    <img
                      src={org.logo}
                      alt={`${org.name} logo`}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <div>
                      <h4 className="font-bold">{org.name}</h4>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong>{" "}
                        <a
                          href={`mailto:${org.contact_email}`}
                          className="text-blue-500 hover:underline"
                        >
                          {org.contact_email}
                        </a>
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Phone:</strong> {org.contact_phone}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {org.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() =>
            previousPageUrl && fetchComprehensiveEvents(previousPageUrl)
          }
          disabled={!previousPageUrl}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
        >
          Previous
        </button>
        <button
          onClick={() => nextPageUrl && fetchComprehensiveEvents(nextPageUrl)}
          disabled={!nextPageUrl}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ComprehensiveEventRetrieve;

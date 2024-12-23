"use client";

import React, { useState, useEffect } from "react";
import { comprehensiveEventsEndpoint } from "./endpoints";

interface Organizer {
  id: number;
  name: string;
  logo: string; // comes in a URL form
}

interface Event {
  id: number;
  title: string; // image coming in as a URL
  banner_pic: string;
  date: string;
  location: string;
  organizer: Organizer[]; // many to many field
  description: string;
}

const UltraSimpleEventsRetrieve = () => {
  const [ultraSimpleEvents, setUltraSimpleEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [previousPageUrl, setPreviousPageUrl] = useState<string | null>(null);

  // Filters
  const [keywordSearch, setKeywordSearch] = useState("");
  const [organizerSearch, setOrganizerSearch] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false); // Tracks if filters are applied

  // Function to fetch events from the API
  const fetchUltraSimpleEvents = async (url: string) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setUltraSimpleEvents(data.results);
      setTotalCount(data.count);
      setNextPageUrl(data.next);
      setPreviousPageUrl(data.previous);
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Builds API URL based on filters
  const buildApiUrl = () => {
    let apiUrl = comprehensiveEventsEndpoint;
    const params = new URLSearchParams();

    if (keywordSearch) {
      params.append("search", keywordSearch);
    }
    if (organizerSearch) {
      params.append("search_organizer", organizerSearch);
    }

    if (params.toString()) {
      apiUrl += `?${params.toString()}`;
    }

    return apiUrl;
  };

  // Handles applying filters
  const handleApplyFilters = () => {
    setFiltersApplied(true);
    const apiUrl = buildApiUrl();
    fetchUltraSimpleEvents(apiUrl);
  };

  // Fetch events on component mount
  useEffect(() => {
    if (!filtersApplied) {
      fetchUltraSimpleEvents(comprehensiveEventsEndpoint);
    }
  }, [filtersApplied]);

  if (loading) {
    return <p>Loading ultra simple events...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      {/* Filters Section */}
      <div className="p-4 bg-gray-100 border-b">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search by keyword"
            value={keywordSearch}
            onChange={(e) => setKeywordSearch(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Search by organizer"
            value={organizerSearch}
            onChange={(e) => setOrganizerSearch(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded"
          />
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Events Display Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        <p>{totalCount} results match</p>
        {ultraSimpleEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-1">
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <strong>Location:</strong> {event.location}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {event.organizer.map((org) => (
                  <div key={org.id} className="flex items-center gap-2">
                    <img
                      src={org.logo}
                      alt={`${org.name} logo`}
                      className="w-8 h-8 object-cover rounded-full"
                    />
                    <span className="text-sm font-medium">{org.name}</span>
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
            previousPageUrl && fetchUltraSimpleEvents(previousPageUrl)
          }
          disabled={!previousPageUrl}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
        >
          Previous
        </button>
        <button
          onClick={() => nextPageUrl && fetchUltraSimpleEvents(nextPageUrl)}
          disabled={!nextPageUrl}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UltraSimpleEventsRetrieve;

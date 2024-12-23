"use client";

import React, { useState, useEffect } from "react";
import { comprehensiveEventsEndpoint } from "./endpoints";

interface Organizer {
  name: string;
  logo: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  description: string;
  social_media_links: { [platform: string]: string };
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface Location {
  title: string;
  url: string;
}

interface Event {
  id: number;
  title: string;
  banner_pic: string;
  organizer: Organizer[];
  date: string;
  location: string;
  locations: Location[];
  description: string;
  category: string[];
}

const SimpleEventsRetrieve = () => {
  const [simpleEvents, setSimpleEvents] = useState<Event[]>([]);
  const [eventRenderingFormat, setRenderingFormat] = useState("simple");
  // choices: simple, ultra-simple, comprehensive
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultsCount, setResultsCount] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [previousPageUrl, setPreviousPageUrl] = useState<string | null>(null);

  // Search and filter states
  const [organizerSearch, setOrganizerSearch] = useState(""); // Controlled input
  const [keywordSearch, setKeywordSearch] = useState(""); // Controlled input
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Controlled checkboxes

  // Applied filters
  const [appliedOrganizerSearch, setAppliedOrganizerSearch] = useState("");
  const [appliedKeywordSearch, setAppliedKeywordSearch] = useState("");
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);

  // Function to fetch events from the API
  const fetchEvents = async (url: string) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setResultsCount(data.count);
      setSimpleEvents(data.results);
      setNextPageUrl(data.next);
      setPreviousPageUrl(data.previous);
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to fetch events when filters are applied
  useEffect(() => {
    let apiUrl = comprehensiveEventsEndpoint;

    const params = new URLSearchParams();
    if (appliedOrganizerSearch) {
      params.append("search_organizer", appliedOrganizerSearch);
    }
    if (appliedKeywordSearch) {
      params.append("search", appliedKeywordSearch);
    }
    if (appliedCategories.length > 0) {
      params.append("category", appliedCategories.join(","));
    }

    if (params.toString()) {
      apiUrl = `${comprehensiveEventsEndpoint}?${params.toString()}`;
    }

    fetchEvents(apiUrl);
  }, [appliedOrganizerSearch, appliedKeywordSearch, appliedCategories]);

  // Handle applying filters
  const applyFilters = () => {
    setAppliedOrganizerSearch(organizerSearch);
    setAppliedKeywordSearch(keywordSearch);
    setAppliedCategories(selectedCategories);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="flex">
      {/* Left Panel: Search Inputs */}
      <div className="w-1/4 p-4">
        <div>
          <h2 className="text-xl font-bold">Search Events</h2>
          <input
            type="text"
            placeholder="Search by organizer name"
            value={organizerSearch}
            onChange={(e) => setOrganizerSearch(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="text"
            placeholder="Search by keyword"
            value={keywordSearch}
            onChange={(e) => setKeywordSearch(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
        </div>

        {/* Filter Panel */}
        <div>
          <h2 className="text-xl font-bold">Filter by Category</h2>
          <div>
            <label>
              <input
                type="checkbox"
                value="Technology"
                checked={selectedCategories.includes("Technology")}
                onChange={() => handleCategoryChange("Technology")}
              />
              Technology
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                value="Business"
                checked={selectedCategories.includes("Business")}
                onChange={() => handleCategoryChange("Business")}
              />
              Business
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                value="Health"
                checked={selectedCategories.includes("Health")}
                onChange={() => handleCategoryChange("Health")}
              />
              Health
            </label>
            <br />
          </div>
        </div>

        {/* Apply Filters Button */}
        <button
          onClick={applyFilters}
          className="w-full bg-blue-500 text-white py-2 mt-4 rounded"
        >
          Apply Search and Filters
        </button>
      </div>

      {/* Right Panel: Display Events */}
      <div className="w-3/4 p-4">
        <p>{resultsCount} results match</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simpleEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={event.banner_pic}
                alt={`${event.title} banner`}
                className="w-full h-48 object-cover"
              />
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
                    <div key={org.name} className="flex items-center gap-2">
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
            onClick={() => previousPageUrl && fetchEvents(previousPageUrl)}
            disabled={!previousPageUrl}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
          >
            Previous
          </button>
          <button
            onClick={() => nextPageUrl && fetchEvents(nextPageUrl)}
            disabled={!nextPageUrl}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleEventsRetrieve;

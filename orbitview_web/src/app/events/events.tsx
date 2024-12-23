"use client";

import React, { useState, useEffect } from "react";
import { comprehensiveEventsEndpoint } from "./endpoints";
import { Fragment } from "react";

interface Organizer {
  id: number;
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

const EventsRetrieve = () => {
  const [events, setEvents] = useState<Event[]>([]);
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
      setEvents(data.results);
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
    let apiUrl = comprehensiveEventsEndpoint; // this endpoint offers the most enhanced search

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

        <select
          value={eventRenderingFormat}
          onChange={(e) => setRenderingFormat(e.target.value)}
          className="w-full md:w-1/3 p-2 border rounded"
        >
          <option value="simple">Simple View</option>
          <option value="ultra-simple">Ultra Simple View</option>
          <option value="comprehensive">Comprehensive View</option>
        </select>

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

        {eventRenderingFormat === "simple" ? (
          <Fragment>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
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
                          <span className="text-sm font-medium">
                            {org.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Fragment>
        ) : (
          <Fragment></Fragment>
        )}

        {eventRenderingFormat === "comprehensive" ? (
          <Fragment>
            {events.map((event) => (
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
          </Fragment>
        ) : (
          <Fragment></Fragment>
        )}

        {eventRenderingFormat === "ultra-simple" ? (
          <Fragment>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {events.map((event) => (
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
                          <span className="text-sm font-medium">
                            {org.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Fragment>
        ) : (
          <Fragment></Fragment>
        )}

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

export default EventsRetrieve;

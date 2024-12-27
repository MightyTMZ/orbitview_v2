'use client'

import React, { useState } from "react";
import {
  refreshLoginAndRedirectToLoginIfInvalidRefreshToken,
  TokenIsStillValid,
} from "../refreshLoginLogic";

interface SettingsProps {
  // Define any props here if needed in the future
}

const SettingsTab: React.FC<SettingsProps> = () => {
  /* if (!TokenIsStillValid) {
    refreshLoginAndRedirectToLoginIfInvalidRefreshToken();
  }*/

  const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] =
    useState<boolean>(false);
  const [isEmailNotificationsEnabled, setIsEmailNotificationsEnabled] =
    useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [profileVisibility, setProfileVisibility] = useState<string>("public");

  const handleTogglePushNotifications = () => {
    setIsPushNotificationsEnabled(!isPushNotificationsEnabled);
  };

  const handleToggleEmailNotifications = () => {
    setIsEmailNotificationsEnabled(!isEmailNotificationsEnabled);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleProfileVisibilityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProfileVisibility(event.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-lg font-sans">
      {/* Profile Settings Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b-2 pb-2 mb-4">
          Profile Settings
        </h2>
        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow mb-4">
          <label className="text-gray-700">Display Name</label>
          <input
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your name"
          />
        </div>
        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow mb-4">
          <label className="text-gray-700">Profile Visibility</label>
          <select
            value={profileVisibility}
            onChange={handleProfileVisibilityChange}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="public">Public</option>
            <option value="friends-only">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b-2 pb-2 mb-4">
          Notifications
        </h2>
        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow mb-4">
          <label className="text-gray-700">Push Notifications</label>
          <input
            type="checkbox"
            checked={isPushNotificationsEnabled}
            onChange={handleTogglePushNotifications}
            className="toggle-checkbox"
          />
        </div>
        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow mb-4">
          <label className="text-gray-700">Email Notifications</label>
          <input
            type="checkbox"
            checked={isEmailNotificationsEnabled}
            onChange={handleToggleEmailNotifications}
            className="toggle-checkbox"
          />
        </div>
      </section>

      {/* Appearance Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 border-b-2 pb-2 mb-4">
          Appearance
        </h2>
        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow mb-4">
          <label className="text-gray-700">Dark Mode</label>
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={handleToggleDarkMode}
            className="toggle-checkbox"
          />
        </div>
      </section>

      {/* Save Changes Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => alert("Changes Saved!")}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;

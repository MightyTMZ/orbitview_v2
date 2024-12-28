"use client";

import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import styles from "./ProfileEdit.module.css"; // Add your styles here
import { backendServer } from "@/importantLinks";

const ProfileEdit = () => {
  const API = axios.create({
    baseURL: backendServer, // Placeholder for your backend's base URL
    withCredentials: true,
  });

  // Interceptors to attach tokens
  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken"); // Get accessToken from localStorage
    const csrfToken = fetchCsrfToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
  });

  const fetchCsrfToken = async () => {
    try {
      const response = await API.get("/csrf-token/"); // Placeholder for CSRF token endpoint
      return response.data.csrfToken;
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
      return null;
    }
  };

  const [profile, setProfile] = useState({
    user: {
      id: 0,
      username: "",
      first_name: "",
      last_name: "",
    },
    is_private: false,
    is_online: false,
    bio: "",
    by_line: "",
    date_of_birth: "",
    image: "", // The URL of the image
  });

  const [formData, setFormData] = useState(profile);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/profile/1/"); // Placeholder for profile fetch endpoint
        setProfile(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("username", formData.user.username);
    data.append("first_name", formData.user.first_name);
    data.append("last_name", formData.user.last_name);
    data.append("bio", formData.bio);
    data.append("by_line", formData.by_line);
    data.append("date_of_birth", formData.date_of_birth);

    // Add image to FormData if available
    if (image) {
      data.append("image", image);
    }

    try {
      const response = await API.put("/profile/1/", data); // Placeholder for profile update endpoint
      console.log("Profile updated:", response.data);
      setProfile(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form className={styles.profileEditForm} onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.user.username}
          onChange={handleInputChange}
        />
      </label>

      <label>
        First Name:
        <input
          type="text"
          name="first_name"
          value={formData.user.first_name}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Last Name:
        <input
          type="text"
          name="last_name"
          value={formData.user.last_name}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Bio:
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
        />
      </label>

      <label>
        By Line:
        <input
          type="text"
          name="by_line"
          value={formData.by_line}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Date of Birth:
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Profile Image:
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>

      <button type="submit">Save Changes</button>
    </form>
  );
};

export default ProfileEdit;

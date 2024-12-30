import { backendServer } from "@/importantLinks";

export const redirectToLogin = () => {
  window.location.href = "/";
};

export const TokenIsStillValid = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return false;
  }

  const userEndpoint = `${backendServer}/auth/users/me/`;

  // we try to get a user
  const getUser = async () => {
    try {
      const response = await fetch(userEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        return true;
      } else {
        console.log("Failed to fetch user data");
        return false;
      }
    } catch (error) {
      console.log("Error:", error);
      return false;
    }
  };

  const userIsValid = await getUser();
  return userIsValid;
};

// only call this when the token is not valid

/*
if (!TokenIsStillValid) {
    refreshLogin();
}
*/

export const refreshLoginAndRedirectToLoginIfInvalidRefreshToken = () => {
  // the token is not valid, what do we do now?

  // refresh the token using refresh token

  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    redirectToLogin();
  }

  const refreshEndpoint = `${backendServer}/auth/jwt/refresh/`;

  // we try to get a user
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(refreshEndpoint, {
        method: "POST",
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.access);
      } else {
        redirectToLogin();
      }
    } catch (error) {
      console.log("Error:", error);
      redirectToLogin();
    }
  };

  refreshAccessToken();
};

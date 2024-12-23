import { backendServer } from "@/components/importantLinks";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const { username, password } = req.body;

  try {
    const response = await fetch(`${backendServer}/auth/jwt/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Send the access token to the client as a cookie
    res.setHeader(
      "Set-Cookie",
      `accessToken=${data.access}; HttpOnly; Secure; SameSite=Strict; Path=/`
    );

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

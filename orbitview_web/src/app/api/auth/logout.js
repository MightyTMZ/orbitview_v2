export default function handler(req, res) {
  // Clear the JWT token cookie by setting it to an empty value and expired date
  res.setHeader(
    "Set-Cookie",
    "accessToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"
  );

  // Optionally, clear the refresh token or any other cookies if applicable
  res.setHeader(
    "Set-Cookie",
    "refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"
  );

  return res.status(200).json({ message: "Logged out successfully" });
}

const production = false;

export const backendServer = production
  ? "https://orbitview.pythonanywhere.com"
  : "http://127.0.0.1:8000/";

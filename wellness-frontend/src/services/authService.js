// ============================================
// AUTH SERVICE - Real Backend API Integration
// ============================================

const API_BASE = "http://localhost:8081/api/auth";

// ---- Register New User ----
export const registerUser = async (data) => {
  const response = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // { name, email, password, role, bio }
  });

  const result = await response.json();

  if (!response.ok) {
    throw { response: { data: result } };
  }

  return { data: result };
  // Returns: { accessToken, refreshToken, user: { id, name, email, role, bio } }
};

// ---- Login Existing User ----
export const loginUser = async (data) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // { email, password }
  });

  const result = await response.json();

  if (!response.ok) {
    throw { response: { data: result } };
  }

  return { data: result };
  // Returns: { accessToken, refreshToken, user: { id, name, email, role, bio } }
};

// ---- Refresh Access Token ----
export const refreshToken = async (token) => {
  const response = await fetch(`${API_BASE}/refresh?refreshToken=${token}`, {
    method: "POST",
  });

  const result = await response.json();

  if (!response.ok) {
    throw { response: { data: result } };
  }

  return { data: result };
  // Returns: { accessToken, refreshToken, user: { id, name, email, role, bio } }
};

// ---- Helper: Store auth data in localStorage ----
export const storeAuthData = (data) => {
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("userRole", data.user.role);
};

// ---- Helper: Clear auth data from localStorage ----
export const clearAuthData = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("adminLoggedIn");
};

// ---- Helper: Get stored access token ----
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// ---- Helper: Get stored user ----
export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

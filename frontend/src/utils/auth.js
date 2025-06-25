import axios from "axios";

export const isMentor = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role === "mentor";
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const login = async (username, password) => {
  const response = await axios.post(
    "http://localhost:8000/api/accounts/login/",
    {
      username,
      password,
    }
  );

  // ✅ Log the response shape first
  console.log("Login response:", response.data);

  const user = response.data.user; // 👈 Make sure this path is correct

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } else {
    throw new Error("User data not found in response");
  }
};

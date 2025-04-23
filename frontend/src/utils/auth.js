export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isMentor = () => {
  const user = getUser();
  return user?.role === "mentor";
};

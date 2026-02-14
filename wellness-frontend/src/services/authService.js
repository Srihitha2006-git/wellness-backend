// TEMPORARY REALISTIC AUTH SYSTEM

const USERS_KEY = "mock_users";

const getUsers = () => {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUser = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();

      const existingUser = users.find(
        (user) => user.email === data.email
      );

      if (existingUser) {
        reject({
          response: { data: { message: "User already exists" } },
        });
        return;
      }

      users.push({
        name: data.name,
        email: data.email,
        password: data.password, // in real backend this would be hashed
        role: data.role,
      });

      saveUsers(users);

      resolve({
        data: { message: "User registered successfully" },
      });
    }, 800);
  });
};

export const loginUser = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();

      const user = users.find(
        (u) =>
          u.email === data.email &&
          u.password === data.password
      );

      if (!user) {
        reject({
          response: { data: { message: "Invalid credentials" } },
        });
        return;
      }

      const fakeToken = btoa(user.email + ":" + Date.now());

      resolve({
        data: {
          token: fakeToken,
          role: user.role,
        },
      });
    }, 800);
  });
};

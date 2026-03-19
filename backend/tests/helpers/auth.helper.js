import request from "supertest";
import app from "../../src/app.js";

export const createTestUserAndLogin = async () => {
  const userData = {
    name: "Test User",
    email: `test_${Date.now()}@mail.com`,
    password: "password123"
  };

  // 🔹 Register
  const registerRes = await request(app)
    .post("/api/auth/register")
    .send(userData);

  console.log("REGISTER RESPONSE:", registerRes.body);

  // 🔹 Login
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({
      email: userData.email,
      password: userData.password
    });

  console.log("LOGIN RESPONSE:", loginRes.body);

  // ❗ Fail early if login fails
  if (!loginRes.body?.data?.accessToken) {
    throw new Error(
      `Login failed: ${JSON.stringify(loginRes.body)}`
    );
  }

  return {
    token: loginRes.body.data.accessToken,
    user: loginRes.body.data.user
  };
};
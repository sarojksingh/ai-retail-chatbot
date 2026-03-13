import request from "supertest";
import app from "../src/app.js";

describe("Auth Logout", () => {

  let cookie;

  it("should login and store refresh cookie", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "saroj@test.com",
        password: "123456"
      });

    cookie = res.headers["set-cookie"];

    expect(cookie).toBeDefined();
  });

  it("should logout user and invalidate refresh token", async () => {

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookie.join(";"));

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");

  });

});
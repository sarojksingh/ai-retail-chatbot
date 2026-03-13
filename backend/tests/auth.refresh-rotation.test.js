import request from "supertest";
import app from "../src/app.js";

describe("Refresh Token Rotation", () => {

  let cookie;

  it("login should return refresh token", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "saroj@test.com",
        password: "123456"
      });

    cookie = res.headers["set-cookie"];

    expect(cookie).toBeDefined();
  });

  it("refresh should rotate refresh token", async () => {

    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", cookie.join(";"));

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();

    const newCookie = res.headers["set-cookie"];

    expect(newCookie).toBeDefined();
  });

});
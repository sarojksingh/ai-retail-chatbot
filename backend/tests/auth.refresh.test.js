import request from "supertest";
import app from "../src/app.js";

describe("Auth Refresh Token", () => {

  let refreshToken;

  it("should login user and return refresh token cookie", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "saroj@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();

    refreshToken = res.headers["set-cookie"];
  });

  it("should issue new access token using refresh token", async () => {

    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", refreshToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();

  });

});
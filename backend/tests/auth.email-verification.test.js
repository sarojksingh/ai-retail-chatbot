import request from "supertest";
import app from "../src/app.js";

describe("Email Verification", () => {

  let verificationToken;

  it("should generate email verification token", async () => {

    const res = await request(app)
      .post("/api/auth/send-verification-email")
      .send({ email: "saroj@test.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    verificationToken = res.body.token;

  });

  it("should verify user email", async () => {

    const res = await request(app)
      .post("/api/auth/verify-email")
      .send({ token: verificationToken });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Email verified successfully");

  });

});
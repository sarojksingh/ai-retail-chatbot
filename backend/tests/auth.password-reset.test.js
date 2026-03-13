import request from "supertest";
import app from "../src/app.js";

describe("Password Reset", () => {

  let resetToken;

  it("should generate password reset token", async () => {

    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "saroj@test.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.resetToken).toBeDefined();

    resetToken = res.body.resetToken;

  });
  
  it("should reset password using token", async () => {

    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({
        token: resetToken,
        newPassword: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Password reset successful");

  });

});
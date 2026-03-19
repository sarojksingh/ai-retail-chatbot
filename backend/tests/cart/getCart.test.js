import request from "supertest";
import app from "../../src/app.js";

describe("Cart - Get Items", () => {

  let token;

  it("should login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "saroj@test.com",
        password: "123456"
      });

    token = res.body.accessToken;
  });

  it("should get cart items", async () => {

    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.items).toBeDefined();

  });

});
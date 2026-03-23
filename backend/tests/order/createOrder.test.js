import request from "supertest";
import app from "../../src/app.js";

describe("Order - Create", () => {

  let token;
  let orderId;

  it("should login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "saroj@test.com",
        password: "123456"
      });

    token = res.body.accessToken;
  });

  it("should create order from cart", async () => {

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`);


    //console.log("order data:- ", res.body.error.message);
    expect(res.statusCode).toBe(200);
    expect(res.body.orderId).toBeDefined();

    orderId = res.body.orderId;

  });

  it("should get user orders", async () => {

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.orders).toBeDefined();

  });

  it("should update order status", async () => {

    const res = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "SHIPPED"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Order status updated");

  });

});
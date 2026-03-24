import request from "supertest";
import app from "../../src/app.js";
import prisma from "../../src/prisma.js";

describe("Order - Payment + Checkout", () => {

  let token;
  let userId;
  let productId;
  let orderId;

  beforeAll(async () => {
    const email = `checkout_${Date.now()}@test.com`;
    const password = "password123";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Checkout User",
        email,
        password
      });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email, password });

    token = loginRes.body.accessToken;
    userId = loginRes.body.user.id;

    const product = await prisma.product.create({
      data: {
        name: `Checkout Product ${Date.now()}`,
        slug: `checkout-product-${Date.now()}`,
        price: 1499,
        stockQuantity: 20
      }
    });

    productId = product.id;

    const cart = await prisma.cart.create({
      data: { userId }
    });

    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: 2
      }
    });
  });

  afterAll(async () => {
    if (orderId) {
      await prisma.orderItem.deleteMany({
        where: { orderId }
      });
      await prisma.order.deleteMany({
        where: { id: orderId }
      });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cart: { userId }
      }
    });
    await prisma.cart.deleteMany({
      where: { userId }
    });
    await prisma.product.deleteMany({
      where: { id: productId }
    });
    await prisma.user.deleteMany({
      where: { id: userId }
    });
  });

  it("should get checkout summary from cart", async () => {
    const res = await request(app)
      .get("/api/orders/checkout/summary")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.checkout.itemCount).toBe(2);
    expect(res.body.checkout.totalAmount).toBe(2998);
  });

  it("should create order and keep payment pending", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.status).toBe("PENDING");
    expect(res.body.order.paymentStatus).toBe("PENDING");

    orderId = res.body.order.id;
  });

  it("should process payment and confirm order", async () => {
    const res = await request(app)
      .patch(`/api/orders/${orderId}/payment`)
      .set("Authorization", `Bearer ${token}`)
      .send({ paymentStatus: "PAID" });

    expect(res.statusCode).toBe(200);
    expect(res.body.order.paymentStatus).toBe("PAID");
    expect(res.body.order.status).toBe("CONFIRMED");
  });

});

import request from "supertest";
import app from "../../src/app.js";
import prisma from "../../src/prisma.js";
import { ApiError } from "../../src/utils/ApiError.js";

describe("Cart - Add/Update Item", () => {

  let token;
  let productId;

  it("should login user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "saroj@test.com",
        password: "123456"
      });

    token = res.body.accessToken;
  });

  it("should create product", async () => {

    const category = await prisma.category.create({
      data: {
        name: "Test Category",
        slug: `TestCat_${Math.random()}`
      }
    });
    let cartCategoryId = category.id;

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Product",
        slug: `TestPro_${Math.random()}`,
        description: 'Test test prod',
        categoryId: cartCategoryId,
        price: 200,
        stockQuantity: 10
      });
    
    //console.log("product create:- ", res);
    productId = res.body.id;
  });

  it("should add item to cart", async () => {
    const res = await request(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId,
        quantity: 2
      });

    //console.log("add item:- ", res);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Item added to cart");
  });

  it("should update cart item quantity", async () => {

    const res = await request(app)
      .patch("/api/cart/item")
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId,
        quantity: 5
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Cart updated");

  });

  it("should remove item from cart", async () => {

    const res = await request(app)
      .delete("/api/cart/item")
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Item removed");

  });

});

//Clean test data
afterAll(async() => {
  /*await prisma.cart.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany({
    where: {
      name: "Test Product"
    }
  });
  await prisma.category.deleteMany({
    where: {
      name: "Test Category"
    }
  });*/
});
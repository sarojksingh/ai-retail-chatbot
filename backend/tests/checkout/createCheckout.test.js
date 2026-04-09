import request from "supertest";
import app from "../../src/app.js";
import prisma from "../../src/prisma.js";
import { ApiError } from "../../src/utils/ApiError.js";

describe("Checkout - Create", () => {

  let token;
  let productId;
  let checkoutId;

  //console.log("hello"); return;

  it("should login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "saroj@test.com",
        password: "123456"
      });

    token = res.body.accessToken;
    if (!token) throw new ApiError(400, "Login error!");
  });

  //console.log("Login done!");

  it("should create checkout product", async () => {

    const category = await prisma.category.create({
      data: {
        name: "Test chkout Category",
        slug: `Testcheckout_${Math.random()}`
      }
    });
    let cartCategoryId = category.id;

    if (!cartCategoryId) 
      throw new ApiError(400, "Unable to create checkout Category create!");

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Product checkout",
        slug: `TestProChk_${Math.random()}`,
        description: 'Test test prod to checkout',
        categoryId: cartCategoryId,
        price: 200,
        stockQuantity: 100
      });
    
    console.log("product create:- ", res);
    productId = res.body.id;

    if (!productId) 
      throw new ApiError(400, "Unable to create checkout Product!");
  });
  //console.log("Checkout product created!");

  it("should add item to cart", async () => {
    const res = await request(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId,
        quantity: 10
      });

    //console.log("add item:- ", res);

    if (res.statusCode != 200) 
      throw new ApiError(400, "Unable to add item to cart!");
    
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Item added to cart");
  });
  //console.log("Items added to cart!");

  it("should create checkout session", async () => {

    const res = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${token}`);

    console.log("checkout session data, %o", res);
    checkoutId = res.body.checkoutId;

    expect(res.statusCode).toBe(200);
    expect(res.body.checkoutId).toBeDefined();

  });


  /*it("should confirm checkout and create order", async () => {

    const res = await request(app)
      .post(`/api/checkout/${checkoutId}/confirm`)
      .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.orderId).toBeDefined();

  });*/

});
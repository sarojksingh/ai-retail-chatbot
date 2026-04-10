import request from "supertest";
import app from "../../src/app.js";

describe("Chat API", () => {

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

  it("should detect greeting intent", async () => {
    const res = await request(app)
      .post("/api/chat")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "hello" });

    expect(res.statusCode).toBe(200);
    expect(res.body.intent).toBe("GREETING");
  });

});
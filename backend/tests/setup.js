import prisma from "../src/prisma.js";

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

//Reset refresh tokens after each test
afterEach(async () => {
  await prisma.refreshToken.deleteMany({ 
    where: { revoked: true } 
  });
})
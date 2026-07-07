import prisma from "../prisma.js";

export const productProvider = {
  async search({ query, filters }) {
    return prisma.product.findMany({
      where: {
        AND: [
          query
            ? {
                name: {
                  contains: query,
                  mode: "insensitive"
                }
              }
            : {},
          filters?.maxPrice
            ? {
                price: {
                  lte: filters.maxPrice
                }
              }
            : {}
        ]
      },
      take: 5
    });
  },

  async findOneByName(name) {
    return prisma.product.findFirst({
      where: {
        name: {
          contains: name,
          mode: "insensitive"
        }
      }
    });
  }

};
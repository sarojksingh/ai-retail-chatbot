
import { extractQuery, extractFilters, detectIntent } from "../utils/nlp.js";

const formatProductResponse = (products) => {
  if (!products.length) {
    return {
      reply: "No products found 😕"
    };
  }

  return {
    reply: "Here are some products:",
    products: products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price
    }))
  };
};

export const handleChat = async (message, userId, providers) => {
  const { productProvider } = providers;

  const intent = detectIntent(message);

  if (intent === "search") {
    const query = extractQuery(message);
    const filters = extractFilters(message);

    const products = await productProvider.search({
      query,
      filters
    });

    return formatProductResponse(products);
  }

  return { reply: "Sorry, I didn't understand." };
};

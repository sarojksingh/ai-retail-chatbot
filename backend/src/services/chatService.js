
import { extractQuery, extractFilters, 
  detectIntent, 
  extractProductName 
} from "../utils/nlp.js";

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
  const { productProvider, cartProvider } = providers;

  const intent = detectIntent(message);

  //Add to cart

  if (intent === "add_to_cart") {

    const productName = extractProductName(message);

    const product = await productProvider.findOneByName(productName);

    if (!product) {
      return {
        reply: "Product not found! 😕"
      };
    }

    await cartProvider.addItem(
      userId,
      product.id,
      1
    );

    return {
      reply: `${product.name} added to cart 🛒`
    };
  }

  //Search product
  if (intent === "search") {
    //const query = extractQuery(message);
    //const filters = extractFilters(message);

    const products = await productProvider.search({
      query: message
    });

    return formatProductResponse(products);
  }

  return { reply: "Sorry, I didn't understand." };
};

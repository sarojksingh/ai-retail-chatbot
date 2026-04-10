

export const detectIntent = (message) => {

  const msg = message.toLowerCase();

  if (msg.includes("hi") || msg.includes("hello")) {
    return { intent: "GREETING" };
  }

  if (msg.includes("show") || msg.includes("find")) {
    return {
      intent: "PRODUCT_SEARCH",
      query: message
    };
  }

  if (msg.includes("add")) {
    return {
      intent: "ADD_TO_CART",
      query: message
    };
  }

  if (msg.includes("cart")) {
    return { intent: "VIEW_CART" };
  }

  return { intent: "UNKNOWN" };
};
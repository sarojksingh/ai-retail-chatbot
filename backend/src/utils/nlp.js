
export const extractQuery = (text) => {
  return text.replace(/under \d+/i, "").trim();
};

export const extractFilters = (text) => {
  const priceMatch = text.match(/under (\d+)/i);

  return {
    maxPrice: priceMatch ? Number(priceMatch[1]) : null
  };
};

export const extractProductName = (text) => {
  return text
    .replace(/add/i, "")
    .replace(/to cart/i, "")
    .trim();
}

export const detectIntent = (text) => {

  if (/add.*cart/i.test(text)) {
    return "add_to_cart";
  }

  if (/buy|search|show|find/i.test(text)) { 
    return "search"; 
  }

  return "unknown";
};
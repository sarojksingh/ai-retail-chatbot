
export const extractQuery = (text) => {
  return text.replace(/under \d+/i, "").trim();
};

export const extractFilters = (text) => {
  const priceMatch = text.match(/under (\d+)/i);

  return {
    maxPrice: priceMatch ? Number(priceMatch[1]) : null
  };
};

export const detectIntent = (text) => {
  if (/buy|show|find/i.test(text)) return "search";
  return "unknown";
};
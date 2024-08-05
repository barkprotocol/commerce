// Define types for API response and cached data
interface BarkPriceApiResponse {
  bark: {
    usd: number;
  };
}

interface CachedBarkPriceData {
  price: number;
  timestamp: number;
}

// Fetch the BARK price from CoinGecko
const fetchBarkPrice = async (): Promise<number> => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bark&vs_currencies=usd"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch BARK price from CoinGecko.");
    }

    const data: BarkPriceApiResponse = await response.json();
    if (!data.bark || typeof data.bark.usd !== "number") {
      throw new Error("Invalid BARK price data format.");
    }

    return data.bark.usd;
  } catch (error) {
    console.error("Error fetching BARK price:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Get the BARK price from localStorage
export const getBarkPriceFromLocalStorage = (): number | null => {
  try {
    const barkPriceData = localStorage.getItem("barkPriceData");

    if (barkPriceData) {
      const { price, timestamp }: CachedBarkPriceData = JSON.parse(barkPriceData);
      const now = Date.now();

      if (now - timestamp < 5 * 60 * 1000) { // Cache for 5 minutes
        return price;
      }
    }
  } catch (error) {
    console.error("Error parsing BARK price data from localStorage:", error);
  }

  return null;
};

// Set the BARK price to localStorage
export const setBarkPriceToLocalStorage = (price: number): void => {
  try {
    const barkPriceData: CachedBarkPriceData = {
      price,
      timestamp: Date.now(),
    };

    localStorage.setItem("barkPriceData", JSON.stringify(barkPriceData));
  } catch (error) {
    console.error("Error saving BARK price data to localStorage:", error);
  }
};

// Get the BARK price, either from localStorage or by fetching it
export const getBarkPrice = async (): Promise<number> => {
  let price = getBarkPriceFromLocalStorage();

  if (price === null) {
    try {
      price = await fetchBarkPrice();
      setBarkPriceToLocalStorage(price);
    } catch (error) {
      console.error("Error getting BARK price:", error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  }

  return price;
};

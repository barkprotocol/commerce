// Define the type for the CoinGecko API response
interface SolPriceApiResponse {
  solana: {
    usd: number;
  };
}

// Fetch the SOL price from the CoinGecko API
const fetchSolPrice = async (): Promise<number> => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    const data: SolPriceApiResponse = await response.json();
    return data.solana.usd;
  } catch (error) {
    console.error("Error fetching SOL price:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Get the SOL price from localStorage if it's still valid
export const getSolPriceFromLocalStorage = (): number | null => {
  const solPriceData = localStorage.getItem("solPriceData");
  
  if (solPriceData) {
    try {
      const { price, timestamp } = JSON.parse(solPriceData);
      const now = Date.now(); // Use Date.now() for consistency
      
      // Cache for 5 minutes
      if (now - timestamp < 5 * 60 * 1000) {
        return price;
      }
    } catch (error) {
      console.error("Error parsing SOL price data from localStorage:", error);
    }
  }
  
  return null;
};

// Set the SOL price to localStorage with a timestamp
export const setSolPriceToLocalStorage = (price: number): void => {
  const solPriceData = {
    price,
    timestamp: Date.now(), // Use Date.now() for consistency
  };
  
  localStorage.setItem("solPriceData", JSON.stringify(solPriceData));
};

// Get the SOL price, either from localStorage or by fetching it
export const getSolPrice = async (): Promise<number> => {
  let price = getSolPriceFromLocalStorage();
  
  if (price === null) {
    try {
      price = await fetchSolPrice();
      if (price > 0) { // Ensure that only valid prices are stored
        setSolPriceToLocalStorage(price);
      }
    } catch (error) {
      console.error("Error getting SOL price:", error);
      return 0; // Return a default value or handle this according to your needs
    }
  }
  
  return price;
};

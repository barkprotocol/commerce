/**
 * Supported currencies and their smallest unit conversion factors.
 */
type SupportedCurrency = "SOL" | "BARK" | "USDC" | "EUR" | "USD";

/**
 * Converts a given amount of currency into its smallest unit representation.
 * 
 * @param currency - The currency to convert ("SOL", "BARK", "USDC", "EUR", or "USD").
 * @param amount - The amount of the currency to convert.
 * @returns The converted amount in the smallest unit of the specified currency.
 * @throws {TypeError} If the amount is not a number.
 * @throws {Error} If the amount is invalid or the currency is unsupported.
 */
function convertToSmallestUnit(currency: SupportedCurrency, amount: number): number {
  if (typeof amount !== "number") {
    throw new TypeError("Amount must be a number.");
  }

  if (isNaN(amount) || amount < 0) {
    throw new Error("Invalid input: amount must be a non-negative number.");
  }

  // Define the conversion factors for each currency
  const conversionFactors: Record<SupportedCurrency, number> = {
    SOL: 1e9,  // Solana has 9 decimal places
    BARK: 1e9, // Assuming BARK also uses 9 decimal places
    USDC: 1e6, // USDC has 6 decimal places
    EUR: 100,  // EUR has 2 decimal places
    USD: 100   // USD has 2 decimal places
  };

  const factor = conversionFactors[currency];

  if (factor === undefined) {
    throw new Error(`Unsupported currency: ${currency}`);
  }

  // Convert and return the amount in smallest unit
  return Math.round(amount * factor);
}

export default convertToSmallestUnit;

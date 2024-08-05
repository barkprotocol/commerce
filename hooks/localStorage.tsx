import { useEffect, useState } from "react";

/**
 * Custom hook to synchronize state with localStorage.
 * 
 * @param key - The key to store the value under in localStorage.
 * @param initialValue - The initial value or a function that returns the initial value.
 * @returns A tuple containing the current state and a function to update it.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Function to get the initial value from localStorage or use the provided initialValue
  const getInitialValue = (): T => {
    if (typeof window === "undefined") {
      // Server-side rendering: return initialValue directly
      return typeof initialValue === "function" ? (initialValue as () => T)() : initialValue;
    }

    try {
      const jsonValue = localStorage.getItem(key);
      if (jsonValue !== null) {
        const parsedValue = JSON.parse(jsonValue);
        // Check if parsedValue matches the type T, simple validation
        if (typeof parsedValue === typeof initialValue) {
          return parsedValue as T;
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }

    // Return the provided initialValue if localStorage read fails
    return typeof initialValue === "function" ? (initialValue as () => T)() : initialValue;
  };

  const [value, setValue] = useState<T>(getInitialValue);

  // Update localStorage when `value` changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, value]);

  return [value, setValue];
}

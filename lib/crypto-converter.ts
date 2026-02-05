// lib/crypto-converter.ts

interface CryptoPrice {
  [key: string]: {
    quote: {
      USD: {
        price: number;
      };
    };
  };
}

export async function convertToCrypto(
  usdAmount: number,
  targetCrypto: string
): Promise<string> {
  try {
    // Fetch crypto data from CoinMarketCap API
    const response = await fetch('/api/coinmarketcap');
    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices');
    }
    
    const cryptoData: CryptoPrice = await response.json();
    
    // Get the price of the target crypto in USD
    const cryptoPrice = cryptoData[targetCrypto]?.quote?.USD?.price;
    
    if (!cryptoPrice) {
      console.warn(`Crypto price not found for ${targetCrypto}, falling back to USD`);
      return `$${usdAmount.toFixed(2)}`;
    }
    
    // Convert USD to target crypto
    const cryptoAmount = usdAmount / cryptoPrice;
    
    // Format based on crypto value
    let formattedAmount: string;
    if (cryptoAmount < 0.01) {
      formattedAmount = cryptoAmount.toFixed(6);
    } else if (cryptoAmount < 1) {
      formattedAmount = cryptoAmount.toFixed(4);
    } else {
      formattedAmount = cryptoAmount.toFixed(2);
    }
    
    return `${formattedAmount} ${targetCrypto}`;
  } catch (error) {
    console.error('Error converting to crypto:', error);
    return `$${usdAmount.toFixed(2)}`;
  }
}

// Client-side version for immediate display with fallback
export function formatPrice(usdAmount: number, crypto?: string): string {
  if (!crypto) {
    return `$${usdAmount.toFixed(2)}`;
  }
  
  // For immediate display, show USD while crypto conversion loads
  return `$${usdAmount.toFixed(2)}`;
}

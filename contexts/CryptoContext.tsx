"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CryptoCoin {
  label: string;
  symbol: string;
  value: string;
  icon: string;
}

const coins = [
  { label: "Vertcoin", symbol: "VTC", value: "VERTCOIN", icon: "https://i.postimg.cc/GpG8VMT5/Vertcoin.png" },
  { label: "Bitcoin", symbol: "BTC", value: "BITCOIN", icon: "https://i.postimg.cc/3wn94Jn0/bitcoin.jpg" },
  { label: "Litecoin", symbol: "LTC", value: "LITECOIN", icon: "https://i.postimg.cc/59YdVZ2N/litecoin.jpg" },
  { label: "USDT", symbol: "USDT", value: "USDT", icon: "https://i.postimg.cc/zGN9TvSg/tether.jpg" },
];

interface CryptoContextType {
  selectedCoin: CryptoCoin;
  setSelectedCoin: (coin: CryptoCoin) => void;
  coins: CryptoCoin[];
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export function CryptoProvider({ children }: { children: ReactNode }) {
  const [selectedCoin, setSelectedCoinState] = useState<CryptoCoin>(coins[0]);

  // Load selected coin from localStorage on mount
  useEffect(() => {
    try {
      const savedCoin = localStorage.getItem("selectedCryptoCoin");
      if (savedCoin) {
        const coin = JSON.parse(savedCoin);
        setSelectedCoinState(coin);
      }
    } catch (error) {
      console.error("Error loading selected coin from localStorage:", error);
    }
  }, []);

  const setSelectedCoin = (coin: CryptoCoin) => {
    setSelectedCoinState(coin);
    try {
      localStorage.setItem("selectedCryptoCoin", JSON.stringify(coin));
    } catch (error) {
      console.error("Error saving selected coin to localStorage:", error);
    }
  };

  return (
    <CryptoContext.Provider value={{ selectedCoin, setSelectedCoin, coins }}>
      {children}
    </CryptoContext.Provider>
  );
}

export function useCrypto() {
  const context = useContext(CryptoContext);
  if (context === undefined) {
    throw new Error("useCrypto must be used within a CryptoProvider");
  }
  return context;
}

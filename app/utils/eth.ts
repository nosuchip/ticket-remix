export const connectMetamask = async () => {
  if (!window || !window.ethereum) {
    throw new Error("No Ethereum provider found");
  }

  const accounts = await window.ethereum?.request<string[]>({
    method: "eth_requestAccounts",
  });

  return accounts?.[0];
};

export const signMessage = async (message: string, fromAddress: string) => {
  if (!window || !window.ethereum) {
    throw new Error("No Ethereum provider found");
  }

  const signature = await window.ethereum.request<string>({
    method: "personal_sign",
    params: [message, fromAddress],
  });

  return signature;
};

import { ethers } from "ethers";

export const verifySignature = async (
  message: string,
  signature: string,
  address: string
) => {
  const signer = ethers.verifyMessage(message, signature);

  return signer.toLowerCase() === address.toLowerCase();
};

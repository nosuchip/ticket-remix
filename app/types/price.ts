export type Currency = "USD" | "EUR" | "THB";

export interface Price {
  price: number;
  currency?: Currency;
  description?: string;
}

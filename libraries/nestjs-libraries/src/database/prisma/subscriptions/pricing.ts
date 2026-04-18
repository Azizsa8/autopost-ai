export interface PricingInnerInterface {
  current: string;
  month_price: number;
  year_price: number;
  maxProfiles: number;
  maxPostsPerDay: number;
  ai: boolean;
}
export interface PricingInterface {
  [key: string]: PricingInnerInterface;
}
export const pricing: PricingInterface = {
  starter: {
    current: 'starter',
    month_price: 99,
    year_price: 990,
    maxProfiles: 2,
    maxPostsPerDay: 1,
    ai: true,
  },
  growth: {
    current: 'growth',
    month_price: 249,
    year_price: 2490,
    maxProfiles: 5,
    maxPostsPerDay: 10,
    ai: true,
  },
  business: {
    current: 'business',
    month_price: 499,
    year_price: 4990,
    maxProfiles: 15,
    maxPostsPerDay: 999999,
    ai: true,
  },
  agency: {
    current: 'agency',
    month_price: 999,
    year_price: 9990,
    maxProfiles: 50,
    maxPostsPerDay: 999999,
    ai: true,
  },
};

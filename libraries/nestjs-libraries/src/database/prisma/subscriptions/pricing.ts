export interface PricingInnerInterface {
  current: string;
  month_price: number;
  year_price: number;
  maxProfiles: number;
  maxPostsPerDay: number;
  ai: boolean;
  webhooks: number;
  team_members: number;
  community_features: boolean;
  featured_by_gitroom: boolean;
  import_from_channels: boolean;
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
    webhooks: 0,
    team_members: 0,
    community_features: false,
    featured_by_gitroom: false,
    import_from_channels: false,
  },
  growth: {
    current: 'growth',
    month_price: 249,
    year_price: 2490,
    maxProfiles: 5,
    maxPostsPerDay: 10,
    ai: true,
    webhooks: 1,
    team_members: 1,
    community_features: true,
    featured_by_gitroom: false,
    import_from_channels: false,
  },
  business: {
    current: 'business',
    month_price: 499,
    year_price: 4990,
    maxProfiles: 15,
    maxPostsPerDay: 999999,
    ai: true,
    webhooks: 5,
    team_members: 5,
    community_features: true,
    featured_by_gitroom: true,
    import_from_channels: true,
  },
  agency: {
    current: 'agency',
    month_price: 999,
    year_price: 9990,
    maxProfiles: 50,
    maxPostsPerDay: 999999,
    ai: true,
    webhooks: 99,
    team_members: 99,
    community_features: true,
    featured_by_gitroom: true,
    import_from_channels: true,
  },
};

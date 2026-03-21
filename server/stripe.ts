import Stripe from "stripe";

// Optional: Fallback to a dummy key if env missing during early dev
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_dummy";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16" as any,
});

// Plan configs
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    maxCarousels: 1,
    maxVideos: 10,
    maxViews: 1000,
  },
  pro: {
    name: "Pro",
    price: 3990, // cents
    priceId: process.env.STRIPE_PRICE_ID_PRO || "price_pro_dummy",
    maxCarousels: 2,
    maxVideos: 50,
    maxViews: 10000,
  },
  ultra: {
    name: "Ultra",
    price: 9990,
    priceId: process.env.STRIPE_PRICE_ID_ULTRA || "price_ultra_dummy",
    maxCarousels: Infinity,
    maxVideos: Infinity,
    maxViews: 50000,
  },
  gold: {
    name: "Gold",
    price: 29990,
    priceId: process.env.STRIPE_PRICE_ID_GOLD || "price_gold_dummy",
    maxCarousels: Infinity,
    maxVideos: Infinity,
    maxViews: Infinity,
  }
};

export type PlanId = keyof typeof PLANS;

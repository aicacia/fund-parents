import { browser } from '$app/env';
import type { Stripe } from '@stripe/stripe-js';

export const stripeUI: Stripe = browser
	? (window.Stripe as any)(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
	: (null as any);

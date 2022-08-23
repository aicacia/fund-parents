import { base } from '$app/paths';
import type Stripe from 'stripe';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	const res = await fetch(`${event.url.origin}${base}/api/subscriptions`);
	if (res.ok) {
		return { subscriptions: (await res.json()) as Stripe.Subscription[] };
	} else {
		return { subscriptions: [] };
	}
};

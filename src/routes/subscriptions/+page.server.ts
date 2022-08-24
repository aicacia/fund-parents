import { base } from '$app/paths';
import type Stripe from 'stripe';
import { authGuard } from '../authGuard';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await authGuard(event.url);

	const successStr = event.url.searchParams.get('success');
	const success = successStr ? Boolean(successStr) : undefined;
	const cancelledStr = event.url.searchParams.get('cancelled');
	const cancelled = cancelledStr ? Boolean(cancelledStr) : undefined;

	const res = await fetch(`${event.url.origin}${base}/api/subscriptions`);
	let subscriptions: Stripe.Subscription[] = [];
	if (res.ok) {
		subscriptions = await res.json();
	}

	return { success, cancelled, subscriptions };
};

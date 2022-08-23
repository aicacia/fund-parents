import { run } from '$lib/prisma';
import type { RequestHandler } from './$types';
import { stripeAPI } from '../../../stripeAPI';
import { authenticated } from '../../../auth';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = authenticated(async (event) => {
	const user = await run((client) =>
		client.user.findFirst({ where: { id: event.locals.token?.userId } })
	);

	if (!user) {
		throw error(404);
	}

	const subscription = await stripeAPI.subscriptions.update(event.params.subscriptionId, {
		cancel_at_period_end: true
	});

	return new Response(JSON.stringify(subscription), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
});

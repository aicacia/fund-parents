import { run } from '$lib/prisma';
import type { RequestHandler } from './$types';
import { stripeAPI } from '../../stripeAPI';
import { authenticated } from '../../auth';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = authenticated(async (event) => {
	const user = await run((client) =>
		client.user.findFirst({ where: { id: event.locals.token?.userId } })
	);

	if (!user) {
		throw error(404);
	}

	const session = await stripeAPI.checkout.sessions.create({
		mode: 'subscription',
		customer: user.stripeCustomerId,
		line_items: [
			{
				price: 'price_1LYTkdHQrR2lDCVmezw4Z2zE',
				quantity: 1
			}
		],
		success_url: `${process.env.BASE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.BASE_URL}/subscription/canceled`
	});

	return new Response(JSON.stringify(session.url), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
});

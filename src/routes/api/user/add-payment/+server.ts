import { run } from '$lib/prisma';
import { stripeAPI } from '../../stripeAPI';
import type { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';
import { authenticated } from '../../auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = authenticated(async (event) => {
	const data = await event.request.json();
	return run((client) => addPayment(client, event.locals.token?.userId as number, data)).then(
		(paymentMethod) => {
			if (paymentMethod) {
				return new Response(JSON.stringify(paymentMethod), {
					status: 201,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			} else {
				throw error(400);
			}
		}
	);
});

async function addPayment(client: PrismaClient, userId: number, data: any) {
	const user = await client.user.findFirst({
		where: {
			id: userId
		},
		select: {
			stripeCustomerId: true
		}
	});

	if (user) {
		const paymentMethod = await stripeAPI.paymentMethods.create({
			customer: user.stripeCustomerId,
			billing_details: data.billing_details,
			[data.type]: data[data.type],
			type: data.type
		});

		return paymentMethod;
	} else {
		return null;
	}
}

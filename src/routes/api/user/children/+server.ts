import { run } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import { authenticated } from '../../auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = authenticated((event) =>
	run(async (client) =>
		client.child.create({
			data: {
				...(await event.request.json()),
				userId: event.locals.token?.userId
			}
		})
	).then((child) => {
		if (child) {
			return new Response(JSON.stringify(child), {
				status: 201,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		} else {
			throw error(404);
		}
	})
);

import { run } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import { authenticated } from '../auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = authenticated((event) =>
	run((client) =>
		client.user.findFirst({
			where: {
				id: event.locals.token?.userId
			},
			include: {
				children: true,
				emails: true
			}
		})
	).then((user) => {
		if (user) {
			return new Response(JSON.stringify(user), {
				headers: {
					'Content-Type': 'application/json'
				}
			});
		} else {
			return error(403);
		}
	})
);

export const PATCH: RequestHandler = authenticated(async (event) => {
	const data = await event.request.json();
	return run((client) =>
		client.user.update({
			data: {
				...data,
				confirmed: true
			},
			where: {
				id: event.locals.token?.userId
			}
		})
	).then((user) => {
		if (user) {
			return new Response(JSON.stringify(user), {
				headers: {
					'Content-Type': 'application/json'
				}
			});
		} else {
			throw error(403);
		}
	});
});

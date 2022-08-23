import { run } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import { authenticated } from 'src/routes/api/auth';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = authenticated((event) =>
	run(async (client) =>
		client.child.update({
			where: {
				id: +event.params.childId,
				userId: event.locals.token?.userId
			},
			data: {
				...(await event.request.json()),
				userId: event.locals.token?.userId
			}
		})
	).then((child) => {
		if (child) {
			return new Response(JSON.stringify(child), {
				headers: {
					'Content-Type': 'application/json'
				}
			});
		} else {
			throw error(404);
		}
	})
);

export const DELETE: RequestHandler = authenticated(async (event) => {
	const id = +event.params.childId;
	const userId = event.locals.token?.userId;

	return run(async (client) =>
		client.child.delete({
			where: {
				id: (
					await client.child.findFirst({
						where: {
							id,
							userId
						},
						select: {
							id: true
						}
					})
				)?.id
			}
		})
	).then((user) => {
		if (user) {
			return new Response(null, {
				status: 204,

				headers: {
					'Content-Type': 'application/json'
				}
			});
		} else {
			throw error(404);
		}
	});
});

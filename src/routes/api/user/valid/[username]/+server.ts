import { run } from '$lib/prisma';
import type { RequestHandler } from './$types';
import { authenticated } from 'src/routes/api/auth';

export const GET: RequestHandler = authenticated((event) =>
	run((client) =>
		client.user.findFirst({
			where: {
				username: event.params.username
			},
			select: {
				id: true
			}
		})
	).then(
		(user) =>
			new Response(JSON.stringify(user ? false : true), {
				headers: {
					'Content-Type': 'application/json'
				}
			})
	)
);

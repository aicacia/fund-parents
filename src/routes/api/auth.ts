import { run } from '$lib/prisma';
import type { IUser } from '$lib/state/user';
import type { RequestEvent } from '.svelte-kit/types/src/routes/api/user/$types';
import { error, type RequestHandler } from '@sveltejs/kit';

export const authenticated: (handler: RequestHandler) => any =
	(handler) => async (event: RequestEvent) => {
		let user: IUser | null;
		try {
			user = await run((client) =>
				client.user.findFirst({
					where: { id: event.locals.token?.userId },
					include: {
						emails: true,
						children: true
					}
				})
			);
		} catch (e) {
			console.error(e);
			throw error(403);
		}
		if (user) {
			event.locals.user = user;
			return handler(event as any);
		} else {
			throw error(403);
		}
	};

import cookie from 'cookie';
import { dev, prerendering } from '$app/env';
import type { Handle, HandleError } from '@sveltejs/kit';
import { decode, type IJwtString } from './routes/api/jwt';
import { run } from '$lib/prisma';

export const handle: Handle = async ({ event, resolve }) => {
	const rawToken = event.request.headers.has('cookie')
		? cookie.parse(event.request.headers.get('cookie') || '').token
		: 'undefined';

	if (rawToken && rawToken !== 'undefined') {
		event.locals.rawToken = rawToken as IJwtString<{ userId: number }>;
	}
	if (event.locals.rawToken) {
		event.locals.token = await decode(event.locals.rawToken);
	}
	if (event.locals.token) {
		event.locals.user = await run((client) =>
			client.user.findFirst({
				where: {
					id: event.locals.token?.userId
				},
				include: {
					emails: true,
					children: true
				}
			})
		);
	}
	return resolve(event);
};

const onError: HandleError = ({ error, event }) => {
	if (!prerendering) {
		console.error(event.clientAddress, event.url.pathname + event.url.search, error);
	}
};

export const handleError = dev ? undefined : onError;

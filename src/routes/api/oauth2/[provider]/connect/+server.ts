import { providers } from '$lib/oauth2';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const url = new URL(event.request.url);
	const provider = providers[event.params.provider];
	throw redirect(302, provider.signin(url, { userId: event.locals.token?.userId || 0 }));
};

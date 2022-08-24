import { providers } from '$lib/oauth2';
import { run } from '$lib/prisma';
import type { RequestHandler } from './$types';
import { userFromCallback } from '../userFromCallback';
import { error, redirect } from '@sveltejs/kit';
import { encode } from '../../../jwt';

export const GET: RequestHandler = async (event) => {
	const provider = providers[event.params.provider];
	const url = new URL(event.request.url);
	const { profile, state } = await provider.callback(url);
	const names = 'name' in profile ? (profile as any)['name'].split(' ') : [];

	const params = {
		userId: Number((state as any)['userId']),
		firstName: names[0],
		lastName: names[names.length - 1],
		email: profile.email,
		emailVerified: !!(profile as any)['email_verified']
	};
	const user = await run((prisma) => userFromCallback(prisma, params));
	if (user) {
		const token = await encode({ userId: user.id });

		event.setHeaders({
			'Set-Cookie': `token=${token}; path=/; SameSite=Lax; Secure; expires=${new Date(
				Date.now() + 1000 * 60 * 60 * 24 * 365
			).toUTCString()}`,
			Location: (state as any)['redirect'] || '/'
		});
		throw redirect(302, (state as any)['redirect'] || '/');
	} else {
		throw error(
			403,
			params.userId
				? `Failed to connect account with ${event.params.provider}`
				: `Failed to authenticate with ${event.params.provider}`
		);
	}
};

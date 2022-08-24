import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const sessionId = event.url.searchParams.get('session_id');
	throw redirect(302, `${process.env.BASE_URL}/subscriptions?success=true&sessionId=${sessionId}`);
};

import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async (_event) => {
	throw redirect(302, `${process.env.BASE_URL}/subscriptions?cancelled=true`);
};

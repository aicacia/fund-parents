import { base } from '$app/paths';
import { isSignedIn } from '$lib/state/user';
import { redirect } from '@sveltejs/kit';

export async function authGuard(url: URL) {
	if (isSignedIn()) {
		return {};
	} else {
		throw redirect(302, `${base}?redirectPath=${encodeURIComponent(url.pathname + url.search)}`);
	}
}

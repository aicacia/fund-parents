import { getCurrentUser } from '$lib/state/user';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	try {
		const _user = await getCurrentUser(event.fetch);
	} catch (e) {
		console.error(e);
	}
};

import { authGuard } from '../authGuard';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await authGuard(event.url);
	return {};
};

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
	const redirectPath = event.url.searchParams.get('redirectPath');

	return {
		redirectPath
	};
};

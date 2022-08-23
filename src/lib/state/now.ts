import { browser } from '$app/env';
import { derived, writable } from 'svelte/store';

const nowWritable = writable(Date.now());

export const now = derived(nowWritable, (now) => now);

if (browser) {
	setInterval(() => {
		nowWritable.set(Date.now());
	}, 1000);
}

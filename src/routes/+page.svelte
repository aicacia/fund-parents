<svelte:options immutable />

<script lang="ts">
	import Layout from '$lib/components/Layout.svelte';
	import { redirectPathWritable } from '$lib/state/user';
	import { get } from 'svelte/store';

	export let redirectPath: string | undefined = undefined;

	if (redirectPath && !get(redirectPathWritable)) {
		redirectPathWritable.set(redirectPath);
	}
</script>

<Layout />

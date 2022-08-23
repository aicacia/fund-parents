<svelte:options immutable />

<script lang="ts">
	import Layout from '$lib/components/Layout.svelte';
	import Subscription from '$lib/components/subscription/Subscription.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Layout>
	{#if data.subscriptions}
		<Subscription subscriptions={data.subscriptions} />
	{/if}
</Layout>

<svelte:options immutable />

<script lang="ts">
	import Layout from '$lib/components/Layout.svelte';
	import Subscriptions from '$lib/components/subscriptions/Subscriptions.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Layout>
	{#if data.subscriptions}
		<Subscriptions
			subscriptions={data.subscriptions}
			success={data.success}
			cancelled={data.cancelled}
		/>
	{/if}
</Layout>

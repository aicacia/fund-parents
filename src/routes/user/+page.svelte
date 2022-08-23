<svelte:options immutable />

<script lang="ts">
	import Layout from '$lib/components/Layout.svelte';
	import User from '$lib/components/user/User.svelte';
	import { user } from '$lib/state/user';
</script>

<Layout>
	{#if $user}
		<User user={$user} />
	{/if}
</Layout>

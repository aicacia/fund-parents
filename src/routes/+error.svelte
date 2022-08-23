<svelte:options immutable />

<script lang="ts">
	import { dev } from '$app/env';
	import { page } from '$app/stores';

	$: lines = ($page.error.stack || '').split('\n');
	$: firstLine = lines[0];
	$: rest = lines.slice(1);
</script>

<div class="container mx-auto">
	<h1>{$page.status} - {$page.error.message}</h1>
	<p class="m-0">{firstLine}</p>
	{#if dev}
		{#each rest as line}
			<p class="m-0 ps-4">{line}</p>
		{/each}
	{/if}
</div>

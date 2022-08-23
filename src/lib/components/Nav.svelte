<svelte:options immutable />

<script lang="ts">
	import UserDropdown from './UserDropdown.svelte';
</script>

<div class="border-b">
	<nav class="container mx-auto flex flex-row justify-between">
		<a href="/" class="text-2xl font-bold self-center">Fund Parents</a>
		<UserDropdown />
	</nav>
</div>

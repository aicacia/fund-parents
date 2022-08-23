<svelte:options immutable />

<script lang="ts">
	import Personal from './Personal.svelte';
	import Location from './Location.svelte';
	import type { IUser } from '$lib/state/user';
	import Children from './Children.svelte';

	export let user: IUser;
</script>

<div class="container mx-auto">
	<Personal {user} />
	<Location {user} />
	<Children {user} />
</div>

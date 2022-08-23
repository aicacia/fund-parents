<svelte:options immutable />

<script lang="ts">
	import type { Child as IChild } from '@prisma/client';
	import type { IUser } from '$lib/state/user';
	import Child from './Child.svelte';

	export let user: IUser;

	$: children = user.children;
	let newChild: Partial<IChild> | undefined;

	function onAdd() {
		newChild = {};
	}
	function onCreate() {
		newChild = undefined;
	}
</script>

<h2 class="mt-2">Children</h2>
<p>Please do not use last names.</p>
<hr class="mb-2" />
{#each children as child (child.id)}
	<Child {child} />
{/each}

{#if newChild}
	<Child child={newChild} onUpdate={onCreate} />
{:else}
	<div class="flex justify-end mt-4">
		<button class="btn primary" on:click={onAdd}>Add Child</button>
	</div>
{/if}

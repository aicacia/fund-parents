<svelte:options immutable />

<script lang="ts">
	import { onMount } from 'svelte';

	export let open = false;

	function onOpen() {
		open = !open;
	}
	function onClickOutside() {
		open = false;
	}

	onMount(() => {
		document.body.addEventListener('click', onClickOutside);

		return () => {
			document.body.removeEventListener('click', onClickOutside);
		};
	});
</script>

<div class="relative inline-block" on:click|stopPropagation>
	<div>
		<button type="button" class="btn btn ghost" on:click={onOpen}>
			<slot name="label" />
		</button>
	</div>
	<div
		class="origin-top-right absolute right-0 w-56 shadow bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-[1001]"
		role="menu"
		class:scale-0={!open}
		class:scale-100={open}
		tabindex="-1"
	>
		<ul role="none">
			<slot />
		</ul>
	</div>
</div>

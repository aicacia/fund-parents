<svelte:options immutable />

<script lang="ts" context="module">
	let COUNT = 0;
</script>

<script lang="ts">
	import Portal from 'svelte-portal/src/Portal.svelte';
	import MdClose from 'svelte-icons/md/MdClose.svelte';
	import { createInsecureID } from '$lib/util';

	export let onClose: () => void = () => undefined;
	export let small = false;
	export let open = false;

	let key = createInsecureID();
	let prevOpen: boolean;
	let index = 0;
	$: if (prevOpen !== open) {
		key = createInsecureID();
		prevOpen = open;
		if (open) {
			COUNT += 1;
		} else {
			COUNT -= 1;
		}
		index = COUNT > 0 ? COUNT : 0;
	}

	function close() {
		open = false;
		onClose();
	}

	function onClickOutside() {
		open = false;
		onClose();
	}
</script>

<Portal>
	<div class="relative z-[1000{index}]" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-gray-500 bg-opacity-25" class:hidden={!open} />
		<div class="fixed inset-0 overflow-y-auto" class:hidden={!open}>
			<div class="flex w-full h-full justify-center p-4" on:click={onClickOutside}>
				<div
					class="flex flex-col relative self-center bg-white text-left shadow-xl sm:w-[512px]"
					class:m-auto={small}
					on:click|stopPropagation
				>
					<div class="flex flex-row flex-shrink items-start justify-between px-4 pt-4">
						<div class="flex-grow">
							{#key key}
								<slot name="title" />
							{/key}
						</div>
						<button
							class="bg-transparent border-0 text-black outline-none focus:outline-none"
							on:click={close}
						>
							<div class="w-6 h-6"><MdClose /></div>
						</button>
					</div>
					<div class="relative p-4 flex-col flex-grow">
						{#key key}
							<slot />
						{/key}
					</div>
				</div>
			</div>
		</div>
	</div>
</Portal>

<svelte:options immutable />

<script lang="ts">
	import Footer from './Footer.svelte';
	import Nav from './Nav.svelte';
	import Notifications from './Notifications.svelte';
</script>

<div class="relative flex w-full h-full">
	<div class="flex flex-col w-full h-full">
		<div class="flex flex-col w-full h-full overflow-hidden">
			<Nav />
			<div class="flex flex-grow">
				<slot />
			</div>
			<div class="mt-auto">
				<Footer />
			</div>
			<Notifications />
		</div>
	</div>
</div>

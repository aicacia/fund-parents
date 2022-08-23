<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
</script>

<div class="w-full flex z-[1000]">
	<div class="w-full">
		<div class="text-center text-xs mt-8">
			&copy; {new Date().getFullYear()}
			<a href={base}>fund-parents.aicacia.com</a>
		</div>
		<div class="text-center text-xs my-2">
			<a target="_blank" href="https://github.com/aicacia/fund-parents">Source Code</a>
			|
			<a target="_blank" href={`${base}/privacy-policy`}>Privacy Policy</a>
			|
			<a target="_blank" href={`${base}/terms-of-service`}>Terms of Service</a>
		</div>
	</div>
</div>

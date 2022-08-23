<svelte:options immutable />

<script lang="ts">
	import MdAccountCircle from 'svelte-icons/md/MdAccountCircle.svelte';
	import { base } from '$app/paths';
	import { user, signOut } from '$lib/state/user';
	import Dropdown from './ui/Dropdown.svelte';
	import LoginModal from './LoginModal.svelte';

	let loginOpen = false;

	function onOpenLogin() {
		loginOpen = true;
	}
</script>

{#if $user}
	<Dropdown>
		<svelte:fragment slot="label">
			<span class="w-6 h-6 inline-block text-black"><MdAccountCircle /></span>
		</svelte:fragment>
		<li>
			<span class="px-4 py-2 block w-full disabled">@{$user.username}</span>
		</li>
		<li><hr /></li>
		<li>
			<a role="button" class="px-4 py-2 block hover:bg-gray-100" href={`${base}/user`}
				>Your Profile</a
			>
		</li>
		<li>
			<a role="button" class="px-4 py-2 block hover:bg-gray-100" href={`${base}/subscription`}
				>Subscriptions</a
			>
		</li>
		<li><hr /></li>
		<li on:click={signOut}>
			<button class="block px-4 py-2 w-full hover:bg-gray-100">Sign out</button>
		</li>
	</Dropdown>
{:else}
	<button class="btn primary mx-2 my-2" on:click={onOpenLogin}>Login</button>
{/if}

<LoginModal bind:open={loginOpen} />

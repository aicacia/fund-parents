<svelte:options immutable />

<script lang="ts">
	import FaFacebookSquare from 'svelte-icons/fa/FaFacebookSquare.svelte';
	import FaGoogle from 'svelte-icons/fa/FaGoogle.svelte';
	import { base } from '$app/paths';
	import Cookies from 'js-cookie';
	import { signIn } from '$lib/state/user';
	import { createNotification } from '$lib/state/notifications';
	import Modal from './ui/Modal.svelte';

	export let open = false;

	let loading = false;
	function signInWith(provider = 'google') {
		loading = true;
		const childWindow = window.open(
			`${base}/api/oauth2/${provider}/signin?redirect=/`,
			`Login with ${provider}`,
			`width=${Math.max(window.outerWidth * 0.3, 320)},height=${Math.max(
				window.outerHeight * 0.7,
				320
			)}`
		);

		function cleanUp() {
			clearInterval(intervalId);
			open = false;
			loading = false;
			childWindow?.close();
		}

		const intervalId = setInterval(() => {
			const hasToken = !!Cookies.get('token');
			if (!childWindow) {
				createNotification('Failed to open OAuth window');
				cleanUp();
			} else if (childWindow.closed || hasToken) {
				signIn()
					.then(cleanUp)
					.catch((error: Error) => {
						if (hasToken) {
							Cookies.remove('token');
						} else {
							createNotification(error.message);
							cleanUp();
						}
					});
			}
		}, 1000);
	}
</script>

<Modal bind:open>
	<div class="flex flex-col">
		<button
			type="button"
			disabled={loading}
			on:click={() => signInWith('google')}
			class="btn primary inline-flex flex-row justify-between my-1"
		>
			<span class="self-center w-5 h-5 mr-2"><FaGoogle /></span>
			<span class="self-center flex-grow">Continue with Google</span>
		</button>
		<button
			type="button"
			disabled={loading}
			on:click={() => signInWith('facebook')}
			class="btn primary inline-flex flex-row justify-between my-1"
		>
			<span class="self-center w-5 h-5 mr-2"><FaFacebookSquare /></span>
			<span class="self-center flex-grow">Continue with Facebook</span>
		</button>
	</div>
</Modal>

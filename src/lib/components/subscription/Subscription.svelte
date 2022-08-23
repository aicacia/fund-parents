<svelte:options immutable />

<script lang="ts">
	import { cancelSubscription, createSubscription } from '$lib/state/user';
	import { formatCurrency } from '$lib/util';
	import type Stripe from 'stripe';
	import Spinner from '../Spinner.svelte';
	import Modal from '../ui/Modal.svelte';

	export let subscriptions: Stripe.Subscription[];

	let subscribing = false;
	async function onSubscribe() {
		subscribing = true;
		try {
			await createSubscription();
		} finally {
			subscribing = false;
		}
	}

	let subscription: Stripe.Subscription | undefined;
	let cancelOpen = false;
	function onOpenCancel(s: Stripe.Subscription) {
		subscription = s;
		cancelOpen = true;
	}
	function onCloseCancel() {
		subscription = undefined;
	}
	let canceling = false;
	async function onCancel() {
		if (!subscription) {
			return;
		}
		canceling = true;
		try {
			const newSubscription = await cancelSubscription(subscription.id);
			const index = subscriptions.findIndex((s) => s.id === newSubscription.id);
			if (index !== -1) {
				subscriptions[index] = newSubscription;
			}
			subscription = undefined;
			cancelOpen = false;
		} finally {
			canceling = false;
		}
	}
</script>

<div class="container mx-auto">
	<h2>Subscriptions</h2>
	<hr class="mb-4" />
	<ul>
		{#each subscriptions as subscription (subscription.id)}
			<li class="flex flex-row justify-between">
				<h3 class:line-through={subscription.cancel_at}>{subscription.plan.nickname}</h3>
				<div>
					<span class:line-through={subscription.cancel_at}
						>{formatCurrency(subscription.plan.amount / 100, subscription.plan.currency)}
						{subscription.plan.interval}</span
					>
					{#if !subscription.cancel_at}
						<button class="btn danger" on:click={() => onOpenCancel(subscription)}>Cancel</button>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
	<button class="btn primary inline-flex mt-8" on:click={onSubscribe} disabled={subscribing}
		>Subscribe{#if subscribing}<span class="w-5 h-5 inline-block ml-2 text-white self-center"
				><Spinner /></span
			>{/if}</button
	>
</div>

<Modal bind:open={cancelOpen} onClose={onCloseCancel}>
	<h2 slot="title">{subscription?.plan.nickname}</h2>
	<p>Cancel your subscription?</p>
	<div class="flex justify-end">
		<button class="btn danger" on:click={onCancel} disabled={canceling}>Cancel</button>
	</div>
</Modal>

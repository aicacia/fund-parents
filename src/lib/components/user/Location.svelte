<svelte:options immutable />

<script lang="ts" context="module">
	const suite = create('user_location_form', (data: Partial<IUser>, fieldname?: keyof IUser) => {
		if (fieldname) {
			only(fieldname);
		}

		test('city', 'city can not be empty', () => {
			enforce(data.city).isNotBlank();
		});
		test('country', 'country can not be empty', () => {
			enforce(data.country).isNotBlank();
		});
	});
</script>

<script lang="ts">
	import { updateUser, type IUser } from '$lib/state/user';
	import { debounce } from '@aicacia/debounce';
	import { create, test, only, type SuiteResult, enforce, skipWhen } from 'vest';
	import InputMessages from '../ui/InputMessages.svelte';
	import classnames from 'vest/classnames';
	import { getLocation, getLocationDetails } from '$lib/util';
	import { createNotification } from '$lib/state/notifications';
	import { tick } from 'svelte';

	export let user: IUser;

	let result: SuiteResult;

	$: country = user.country;
	$: city = user.city;
	$: state = { country, city };
	$: result = suite(state).done((r) => {
		result = r;
	});
	$: formClassName = classnames(result, {
		warning: 'warning',
		invalid: 'invalid',
		valid: 'valid'
	});

	async function update() {
		if (result.isValid()) {
			await updateUser(state);
		}
	}
	const debouncedUpdate = debounce(update, 1000);

	function validate(fieldname?: keyof IUser) {
		suite(state, fieldname).done((r) => {
			result = r;
			debouncedUpdate();
		});
	}
	function onChange(event: Event & { currentTarget: HTMLInputElement | HTMLTextAreaElement }) {
		validate(event.currentTarget.name as keyof IUser);
	}

	let getttingLocation = false;
	async function onGetLocation() {
		getttingLocation = true;
		try {
			const geolocation = await getLocation();
			const details = await getLocationDetails(geolocation);
			country = details.address.country;
			city = details.address.city;
			await tick();
			validate('country');
			validate('city');
		} catch (e) {
			console.error(e);
			createNotification((e as Error).message);
		} finally {
			getttingLocation = false;
		}
	}
</script>

<h2 class="mt-2">Location</h2>
<hr class="mb-2" />
<div class="flex flex-row">
	<div class="flex-grow mx-1">
		<label for="country">Country</label>
		<input
			type="text"
			name="country"
			class={formClassName('country')}
			bind:value={country}
			on:input={onChange}
		/>
		<InputMessages {result} name="country" />
	</div>
	<div class="flex-grow mx-1">
		<label for="city">City</label>
		<input
			type="text"
			name="city"
			class={formClassName('city')}
			bind:value={city}
			on:input={onChange}
		/>
		<InputMessages {result} name="city" />
	</div>
	<div class="flex-shrink ml-1">
		<button class="btn primary mt-6" on:click={onGetLocation} disabled={getttingLocation}
			>Current</button
		>
	</div>
</div>

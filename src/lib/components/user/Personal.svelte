<svelte:options immutable />

<script lang="ts" context="module">
	async function checkValidUsername(username: string, lastUsername: string) {
		if (username === lastUsername) {
			return username;
		}
		try {
			const valid = await validUsername(username);
			return valid ? username : Promise.reject(`${username} is already used`);
		} catch (e) {
			return Promise.reject(e);
		}
	}

	const suite = create(
		'user_personal_form',
		(data: Partial<IUser>, origUser: IUser, fieldname?: keyof IUser) => {
			if (fieldname) {
				only(fieldname);
			}

			test('name', 'name can not be empty', () => {
				enforce(data.name).isNotBlank();
			});
			test('username', 'username can not be empty', () => {
				enforce(data.username).isNotBlank();
			});
			skipWhen(
				(result) => result.getErrors('username').length !== 0,
				() => {
					test('username', 'username must be unique', () => {
						return checkValidUsername(data.username as string, origUser.username);
					});
				}
			);
		}
	);

	const reUsername = /[^a-zA-Z0-9\_\-]+/;
</script>

<script lang="ts">
	import { updateUser, validUsername, type IUser } from '$lib/state/user';
	import { debounce } from '@aicacia/debounce';
	import { create, test, only, type SuiteResult, enforce, skipWhen } from 'vest';
	import InputMessages from '../ui/InputMessages.svelte';
	import classnames from 'vest/classnames';
	import { tick } from 'svelte';

	export let user: IUser;

	let result: SuiteResult;

	$: name = user.name;
	$: username = user.username;
	$: bio = user.bio;
	$: state = { name, username, bio };
	$: result = suite(state, user).done((r) => {
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
		suite(state, user, fieldname).done((r) => {
			result = r;
			debouncedUpdate();
		});
	}
	function onChange(event: Event & { currentTarget: HTMLInputElement | HTMLTextAreaElement }) {
		validate(event.currentTarget.name as keyof IUser);
	}

	async function onUsernameChange(event: Event & { currentTarget: HTMLInputElement }) {
		const value = event.currentTarget.value || '';
		if (value) {
			username = value.replace(reUsername, '').trim();
		}
		await tick();
		onChange(event);
	}
</script>

<h2 class="mt-2">Personal Details</h2>
<hr class="mb-2" />
<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
	<div>
		<label for="name">Name</label>
		<input
			type="text"
			name="name"
			class={formClassName('name')}
			bind:value={name}
			on:input={onChange}
		/>
		<InputMessages {result} name="name" />
	</div>
	<div>
		<label for="username">Username</label>
		<input
			type="text"
			name="username"
			class={formClassName('username')}
			value={username}
			on:input={onUsernameChange}
		/>
		<InputMessages {result} name="username" />
	</div>
</div>
<div>
	<label for="bio">Bio</label>
	<textarea name="bio" class={formClassName('bio')} bind:value={bio} on:input={onChange} />
	<InputMessages {result} name="bio" />
</div>

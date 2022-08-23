<svelte:options immutable />

<script lang="ts" context="module">
	const MIN_DATE = new Date();
	MIN_DATE.setFullYear(MIN_DATE.getFullYear() - 24);

	const MAX_DATE = new Date();
	MAX_DATE.setFullYear(MAX_DATE.getFullYear() + 1);

	function validDate(date: Date) {
		return !isNaN(date.getTime());
	}
	function validBirthday(date: Date) {
		return date.getTime() >= MIN_DATE.getTime() && date.getTime() <= MAX_DATE.getTime();
	}

	const suite = create('user_child_form', (data: Partial<Child>, fieldname?: keyof Child) => {
		if (fieldname) {
			only(fieldname);
		}

		test('name', 'name can not be empty', () => {
			enforce(data.name).isNotBlank();
		});
		test('birthday', 'birthday can not be empty', () => {
			enforce(data.birthday).condition(validDate);
		});
		test('birthday', 'invalid birthday', () => {
			enforce(data.birthday).condition(validBirthday);
		});
	});
</script>

<script lang="ts">
	import { debounce } from '@aicacia/debounce';
	import { create, test, only, type SuiteResult, enforce } from 'vest';
	import InputMessages from '../ui/InputMessages.svelte';
	import classnames from 'vest/classnames';
	import type { Child } from '@prisma/client';
	import { addChild, removeChild, updateChild } from '$lib/state/user';
	import { noop } from 'svelte/internal';
	import Modal from '../ui/Modal.svelte';

	export let child: Partial<Child>;
	export let onUpdate: () => void = noop;

	let result: SuiteResult;

	$: name = child.name;
	$: birthdayString = child.birthday ? child.birthday.toISOString().slice(0, 10) : '';
	$: birthday = new Date(birthdayString);
	$: state = { name, birthday };
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
			if (child.id) {
				await updateChild(child.id, state);
			} else {
				await addChild(state);
			}
			onUpdate();
		}
	}
	const debouncedUpdate = debounce(update, 1000);

	function validate(fieldname?: keyof Child) {
		suite(state, fieldname).done((r) => {
			result = r;
			debouncedUpdate();
		});
	}
	function onChange(event: Event & { currentTarget: HTMLInputElement | HTMLTextAreaElement }) {
		validate(event.currentTarget.name as keyof Child);
	}

	let deleteOpen = false;
	function openDelete() {
		deleteOpen = true;
	}

	let deletingChild = false;
	async function onDelete() {
		deletingChild = true;
		try {
			await removeChild(child.id as number);
			deleteOpen = false;
		} finally {
			deletingChild = false;
		}
	}
</script>

<div class="flex flex-row">
	<div class="flex-grow mr-1">
		<label for="name">Name</label>
		<input
			type="text"
			name="name"
			class={`h-10 ${formClassName('name')}`}
			bind:value={name}
			on:input={onChange}
		/>
		<InputMessages {result} name="name" />
	</div>
	<div class="flex-grow mx-1">
		<label for="birthday">Birthday</label>
		<input
			type="date"
			min={MIN_DATE.toISOString().slice(0, 10)}
			max={MAX_DATE.toISOString().slice(0, 10)}
			name="birthday"
			class={`h-10 ${formClassName('birthday')}`}
			bind:value={birthdayString}
			on:input={onChange}
		/>
		<InputMessages {result} name="birthday" />
	</div>
	{#if child.id}
		<div class="flex-shrink self-end ml-1">
			<button class="btn danger h-10" on:click={openDelete} disabled={deleteOpen}>Remove</button>
		</div>
	{/if}
</div>

{#if child.id}
	<Modal bind:open={deleteOpen}>
		<h3 slot="title">Remove {child.name}?</h3>
		<div class="flex justify-end">
			<button class="btn danger h-10" on:click={onDelete} disabled={deletingChild}>Delete</button>
		</div>
	</Modal>
{/if}

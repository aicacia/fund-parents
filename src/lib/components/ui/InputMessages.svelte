<svelte:options immutable />

<script lang="ts">
	import type { SuiteResult } from 'vest';
	import classnames from 'vest/classnames';

	export let result: SuiteResult;
	export let name: string;

	$: messageClassName = classnames(result, {
		warning: 'warning-feedback',
		invalid: 'invalid-feedback',
		valid: 'valid-feedback'
	})(name);

	$: errors = result.getErrors(name);
	$: warnings = result.getWarnings(name);
</script>

<ul>
	{#each errors as message}
		<li class={messageClassName}>{message}</li>
	{/each}
	{#each warnings as message}
		<li class={messageClassName}>{message}</li>
	{/each}
</ul>

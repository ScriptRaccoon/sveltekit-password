<script lang="ts">
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import type { ActionData } from "./$types";
	export let form: ActionData;

	if (form?.is_correct && browser) {
		setTimeout(() => {
			goto("/personal");
		}, 2000);
	}
</script>

<h1>Login</h1>

<p>This page is password-protected.</p>

<form method="POST">
	<label>
		Password
		<input name="password" type="password" />
	</label>
	<button>Login</button>
</form>

{#if form}
	<p class="message" class:success={form.is_correct}>
		{form.message}
	</p>
{/if}

<style>
	input {
		width: 100%;
		padding: 0.5rem;
		border: 0.1rem solid gray;
	}

	input:focus {
		border-color: var(--primary-color);
	}

	label {
		display: block;
		margin-bottom: 1rem;
	}

	button {
		background-color: var(--primary-color);
		color: white;
		font-family: inherit;
		border: none;
		padding: 0.5rem 1rem;
		font-size: inherit;
		cursor: pointer;
		outline-offset: 0.2rem;
	}

	.message {
		color: red;
	}

	.message.success {
		color: darkgreen;
	}
</style>

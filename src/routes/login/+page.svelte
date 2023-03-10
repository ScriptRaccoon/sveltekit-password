<script lang="ts">
	import type { ActionData } from "./$types";
	export let form: ActionData;
</script>

<h1>Login</h1>

<form method="POST">
	<label>
		Password
		<input name="password" type="password" />
	</label>
	<button>Login</button>
</form>

{#if form}
	{#if form.password_correct}
		<p>
			Login successful. You can now open the <a href="/personal"
				>personal</a
			> subpage.
		</p>
	{:else}
		<p>The password is not correct.</p>
	{/if}
{/if}

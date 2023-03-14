<script lang="ts">
	import "./app.css";
	import Nav from "$lib/Nav.svelte";
</script>

<svelte:head>
	<title>Website with password-protected subpage</title>
</svelte:head>

<Nav />

<main>
	<slot />
</main>

<style>
	main {
		padding: 1rem;
		max-width: 38rem;
		margin-inline: auto;
	}
</style>

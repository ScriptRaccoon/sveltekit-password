<script lang="ts">
	import "./app.css";
	import Nav from "../lib/Nav.svelte";
</script>

<svelte:head>
	<title>Website</title>
</svelte:head>

<Nav />

<main>
	<slot />
</main>

<style>
	main {
		max-width: 38rem;
		margin-inline: auto;
	}
</style>

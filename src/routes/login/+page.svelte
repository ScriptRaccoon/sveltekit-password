<h1>Login</h1>
<form action="/login" method="POST">
	<label>
		Password
		<input type="password" />
	</label>
	<button>Login</button>
</form>

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
</style>

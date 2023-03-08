<nav>
	<ul>
		<li>
			<a href="/">Home</a>
		</li>
		<li>
			<a href="/blog">Blog</a>
		</li>
		<li>
			<a href="/personal"
				>Personal<img
					class="lock"
					src="/lock.svg"
					alt="lock"
				/></a
			>
		</li>
	</ul>
</nav>

<style>
	ul {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
		background-color: var(--primary-color);
		color: white;
		padding: 1rem;
		list-style: none;
	}

	.lock {
		height: 1.5rem;
		translate: 0.1rem 0.25rem;
	}
</style>

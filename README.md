# SvelteKit-Password

https://sveltekit-password.netlify.app/

This website demonstrates how to implement a password-protected page inside of a SvelteKit application.

The password is: sveltekit2023

# How it's done

## Setup

First of all, we start with three simple pages: `/`, `/blog` and `/personal`.

```
/routes

  +page.svelte

  /blog
    +page.svelte

  /personal
    +page.svelte
```

We would like to protect `/personal` with a password.

Let's first create a password and save it in our `.env` file:

```
SECRET_PASSWORD = sveltekit123
```

## Login page

Now let's create a login page `/login/+page.svelte` with a login form:

```html
<h1>Login</h1>

<form method="POST">
	<label>Password<input name="password" type="password" /></label>
	<button>Login</button>
</form>
```

To handle the POST request, we create `/login/+page.server.ts` and add an Action handler which validates the password:

```typescript
import type { Actions } from "./$types";
import { SECRET_PASSWORD } from "$env/static/private";
import { fail, redirect } from "@sveltejs/kit";
import { save_session } from "../../db/session";

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const password = data.get("password");
    const password_correct = password === SECRET_PASSWORD;

    if (password_correct) {
      ...
    }

    return fail(401, { password_correct });
  },
};
```

If the password is not correct, we send the info back to the login page. This info is contained in the `form` object:

```svelte
<script lang="ts">
  import type { ActionData } from "./$types";
  export let form: ActionData;
</script>

// ... login form ...

{#if form && !form.password_correct}
  <p>The password is not correct.</p>
{/if}
```

## Cookies

However, if the password is correct, our action handler sets a cookie and then redirects to the personal page:

```typescript
if (password_correct) {
	const session_id = save_session();
	const one_week = 60 * 60 * 24 * 7;
	cookies.set("session_id", session_id, {
		path: "/",
		maxAge: one_week,
	});

	throw redirect(307, "/personal");
}
```

The cookie lasts for one week and is httpOnly by default. To generate it, we have used a utility function `save_session` from `session.ts` which basically implements a database in memory with the stored sessions.

```typescript
const sessions = new Set(); // should be in a database

export function save_session(): string {
	const session_id = crypto.randomUUID();
	sessions.add(session_id);
	return session_id;
}
```

The utility `has_session` simply checks if the session is in the database.

```typescript
export function has_session(session_id: string): boolean {
	return sessions.has(session_id);
}
```

## Password protection

Now we need to add a load function to the personal page to check if the user has already logged in - using the cookie. If not, we redirect to the login page.

```typescript
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { has_session } from "../../db/session";

export const load: PageServerLoad = async ({ cookies }) => {
	const session_id = cookies.get("session_id");
	if (!session_id) throw redirect(307, "/login");
	const logged_in = has_session(session_id);
	if (!logged_in) throw redirect(307, "/login");
};
```

This essentially is the password protection already.

However, you will notice that you get an error when the login page redirects you to the personal page. This is because the latter has no form action implemented, and we redirect from a form action. So let's add an empty one:

```typescript
import type { PageServerLoad, Actions } from "./$types";

// ... load function ...

export const actions: Actions = {
	default: async () => {},
};
```

And that's it!

## Progressive Enhancement

We can improve the UX of the login process by replacing the server-side navigation with a client-side navigation. This can be done simply by adding the action directive `use:enhance` to our login form:

```svelte
<script lang="ts">
  import { enhance } from "$app/forms";
  // ...
</script>

<h1>Login</h1>

<form method="POST" use:enhance>
  // ..
</form>
```

Now, when JS is enabled, the redirection will look much smoother.

## Protect more pages

So far, we have only protected one single page inside our application. If you want to protect multiple pages, you can either use hooks (see the [documentation](https://kit.svelte.dev/docs/hooks) or the video [Protect SvelteKit Routes with Hooks](https://www.youtube.com/watch?v=K1Tya6ovVOI) by Huntabyte) or use the following method:

Let's create a nested page inside of our personal page: `/personal/notes/+page.svelte`. Its content is not relevant for now, but you might want to add a heading to identify it. With our current solution, you can access it even when you are not logged in. Of course we could just copy-paste our code from `+page.server.ts`, but this is not a good way. Instead, we move the login logic to a layout load function as follows.

Create an empty layout at `/personal/+layout.svelte`.

```svelte
<slot />
```

This is a _nested layout_ which is added to our root layout. It does not replace it.

Create its corresponding server file `personal/+layout.server.ts` and move the login logic there, thereby also replacing the type `PageServerLoad` by `LayoutServerLoad`.

```typescript
import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { has_session } from "../../db/session";

export const load: LayoutServerLoad = async ({ cookies }) => {
	const session_id = cookies.get("session_id");
	if (!session_id) throw redirect(307, "/login");
	const logged_in = has_session(session_id);
	if (!logged_in) throw redirect(307, "/login");
};
```

Thus, our `personal/+page.server.ts` only keeps the empty action:

```typescript
import type { Actions } from "./$types";

export const actions: Actions = {
	default: async () => {},
};
```

What we have done protects all nested pages inside of the `/personal` folder (since they load the nested layout), and this applies in particular to our `/personal/notes` page.

There is a security issue, however, as explained by Hunterbyte in the video [Are your routes actually protected?](https://www.youtube.com/watch?v=UbhhJWV3bmI). Navigate to `/personal`, delete the cookie (imagine that the cookie is expired), and try to go to `/personal/notes`. You have access even though you should not be logged in anymore. In other words, even though our solution protects the pages from users who are not logged in, it does not proctect the pages from users who have just been logged out (in the same session).

The reason is that the server load of `/personal/notes` (which is empty right now, we did not create it) does not load the server load inside of `personal/+layout.server.ts`. You can check this by console logs. Fortunately, there is a way to solve this: we create `/personal/notes/+page.server.ts` and add the following:

```typescript
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
};
```

We also add this code to `/personal/+page.server.ts`. The parent refers to the surrounding layout server load. This way we are forcing it to rerun and hence check again if the user is still logged in.

As you see this grew a bit out of hand. You might not need to do this when you just want to protect a single page, and maybe you also do not really care about logging out users who already have the password. But for bigger endeavors (such as an admin page) it becomes apparent that a layout (or page) server load function is not ideal. Hooks are a better solution. Again, check out the video [Protect SvelteKit Routes with Hooks](https://www.youtube.com/watch?v=K1Tya6ovVOI) by Huntabyte. Maybe I will create a "follow-up" repository to this one.

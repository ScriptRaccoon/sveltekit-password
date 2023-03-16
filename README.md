# SvelteKit-Password

https://sveltekit-password.netlify.app/

This website demonstrates how to implement a password-protected subpage inside of a SvelteKit application.

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

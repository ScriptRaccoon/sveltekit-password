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
			const session_id = save_session();
			const one_week = 60 * 60 * 24 * 7;
			cookies.set("session_id", session_id, {
				path: "/",
				maxAge: one_week,
			});

			throw redirect(303, "/personal");
		}
		return fail(401, { password_correct });
	},
};

import type { Actions } from "./$types";
import { SECRET_PASSWORD } from "$env/static/private";
import { fail } from "@sveltejs/kit";
import { save_session } from "../../db/session";

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get("password");
		const is_correct = password == SECRET_PASSWORD;
		if (is_correct) {
			const session_id = save_session();
			cookies.set("session_id", session_id);
			return { message: "The password is correct" };
		} else {
			return fail(401, {
				message: "The password is not correct",
			});
		}
	},
};

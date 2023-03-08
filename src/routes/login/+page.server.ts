import type { Actions } from "./$types";
import { SECRET_PASSWORD } from "$env/static/private";
import { fail } from "@sveltejs/kit";
import { save_session } from "../../db/session";

const MESSAGES = {
	CORRECT: "The password is correct! You will be redirected now.",
	INCORRECT: "The password is not correct",
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const password = data.get("password");
		const is_correct = password === SECRET_PASSWORD;

		if (is_correct) {
			const session_id = save_session();
			cookies.set("session_id", session_id, { path: "/" });

			return { is_correct, message: MESSAGES.CORRECT };
		}
		return fail(401, { is_correct, message: MESSAGES.INCORRECT });
	},
};

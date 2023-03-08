import type { Actions } from "./$types";
import { SECRET_PASSWORD } from "$env/static/private";
import { fail } from "@sveltejs/kit";

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const password = data.get("password");
		const is_correct = password == SECRET_PASSWORD;
		if (is_correct) {
			return { message: "The password is correct" };
		} else {
			return fail(401, {
				message: "The password is not correct",
			});
		}
	},
};

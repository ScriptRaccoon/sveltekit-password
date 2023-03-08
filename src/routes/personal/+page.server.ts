import { has_session } from "../../db/session";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }) => {
	const session_id = cookies.get("session_id");
	if (!session_id) throw redirect(307, "/login");
	const logged_in = has_session(session_id);
	if (!logged_in) throw redirect(307, "/login");
};

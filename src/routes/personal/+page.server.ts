import type { Actions, PageServerLoad } from "./$types";

export const actions: Actions = {
	default: async () => {},
};

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
};

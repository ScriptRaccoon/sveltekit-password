const sessions = new Set(); // should be in a database

export function save_session(): string {
	const session_id = crypto.randomUUID();
	sessions.add(session_id);
	return session_id;
}

export function has_session(session_id: string): boolean {
	return sessions.has(session_id);
}

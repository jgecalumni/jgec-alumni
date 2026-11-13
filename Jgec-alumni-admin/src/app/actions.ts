"use server";

import { cookies } from "next/headers";

export async function clearAuthCookies() {
	const c = cookies();
	c.delete("accessToken");
	c.delete("refreshToken");
	c.delete("tokenAdmin");
	c.delete("tokenMoney");
	c.delete("token");
	c.delete("user_session");
}

"use server";

import { cookies } from "next/headers";

export async function clearAuthCookies() {
	cookies().delete("tokenAdmin");
	cookies().delete("tokenMoney");
}

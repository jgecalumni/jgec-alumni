import { NextResponse, type NextRequest } from "next/server";

function parseJwt(token?: string) {
	if (!token) return null;
	try {
		const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
		return JSON.parse(atob(base64));
	} catch {
		return null;
	}
}

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isPublic = path === "/login" || path === "/reset-password";
	const now = Math.floor(Date.now() / 1000);

	const refreshData = parseJwt(request.cookies.get("refreshToken")?.value);
	const hasValidRefresh = Boolean(
		refreshData && (!refreshData.exp || refreshData.exp > now)
	);

	// If no valid refresh token is present, logout automatically
	if (!hasValidRefresh) {
		if (isPublic) {
			const res = NextResponse.next();
			if (request.cookies.has("accessToken")) res.cookies.delete("accessToken");
			if (request.cookies.has("user_session")) res.cookies.delete("user_session");
			return res;
		}
		const response = NextResponse.redirect(new URL("/login", request.nextUrl));
		response.cookies.delete("accessToken");
		response.cookies.delete("user_session");
		return response;
	}

	// Refresh token is valid; resolve accessToken or fallback to session
	let tokenData = parseJwt(request.cookies.get("accessToken")?.value);
	if (tokenData?.exp && tokenData.exp <= now) {
		tokenData = null;
	}

	if (!tokenData) {
		let session: Record<string, any> = {};
		try {
			session = JSON.parse(request.cookies.get("user_session")?.value || "{}");
		} catch {}

		tokenData = {
			userId: refreshData.userId,
			role: session.role || "ADMIN",
			allowedPaths: session.allowedPaths || [],
		};
	}

	const role = String(tokenData.role || "").toUpperCase();
	const isMoney = role === "MONEY";
	const allowedPaths: string[] = tokenData.allowedPaths?.length
		? tokenData.allowedPaths
		: (() => {
				try {
					return JSON.parse(request.cookies.get("user_session")?.value || "{}").allowedPaths || [];
				} catch {
					return [];
				}
		  })();

	const isWildcard = role === "SUPER_ADMIN" || allowedPaths.includes("*");

	// Authenticated user accessing public routes
	if (isPublic) {
		if (path === "/reset-password") return NextResponse.next();
		const home = isMoney ? "/receipt" : isWildcard ? "/" : allowedPaths[0] || "/";
		return NextResponse.redirect(new URL(home, request.nextUrl));
	}

	// MONEY role restricted to /receipt
	if (isMoney) {
		if (path !== "/receipt") {
			return NextResponse.redirect(new URL("/receipt", request.nextUrl));
		}
		return NextResponse.next();
	}

	// Role-based route guard
	if (!isWildcard) {
		const isAllowed = allowedPaths.some(
			(p: string) => path === p || (p !== "/" && path.startsWith(`${p}/`))
		);
		if (!isAllowed) {
			return NextResponse.redirect(new URL(allowedPaths[0] || "/", request.nextUrl));
		}
	}

	const response = NextResponse.next();

	// Ensure user_session cookie is populated for client-side consumption
	if (!request.cookies.has("user_session") && tokenData.userId) {
		const isJgec = request.nextUrl.hostname.includes("jgecalumni.in");
		response.cookies.set(
			"user_session",
			JSON.stringify({
				id: tokenData.userId,
				name: tokenData.name,
				email: tokenData.email,
				role: tokenData.role,
				allowedPaths,
			}),
			{
				path: "/",
				httpOnly: false,
				...(isJgec ? { domain: ".jgecalumni.in" } : {}),
			}
		);
	}

	return response;
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico).*)"],
};

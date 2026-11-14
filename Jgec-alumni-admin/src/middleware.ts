import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

function parseJwt(token: string) {
	try {
		const base64Url = token.split(".")[1];
		if (!base64Url) return null;
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join("")
		);
		return JSON.parse(jsonPayload);
	} catch {
		return null;
	}
}

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isPublic = path === "/login" || path === "/reset-password";

	const token =
		request.cookies.get("accessToken")?.value ||
		request.cookies.get("tokenAdmin")?.value ||
		request.cookies.get("tokenMoney")?.value ||
		"";

	let tokenData = parseJwt(token);

	if (tokenData && tokenData.exp) {
		const currentTime = Math.floor(Date.now() / 1000);
		if (tokenData.exp < currentTime) {
			tokenData = null; 
		}
	}

	if (!tokenData) {
		const refreshToken = request.cookies.get("refreshToken")?.value;
		if (refreshToken) {
			const refreshData = parseJwt(refreshToken);
			if (
				refreshData &&
				refreshData.exp &&
				refreshData.exp > Math.floor(Date.now() / 1000)
			) {
				
				tokenData = { role: "ADMIN", allowedPaths: [] };
			}
		}
	}

	if (!tokenData) {
		if (isPublic) {
			return NextResponse.next();
		}
		const response = NextResponse.redirect(new URL("/login", request.nextUrl));
		response.cookies.delete("accessToken");
		response.cookies.delete("tokenAdmin");
		response.cookies.delete("tokenMoney");
		return response;
	}

	const rawRole = (tokenData.role || "").toString();
	const isAdmin =
		rawRole === "SUPER_ADMIN" ||
		rawRole === "ADMIN" ||
		rawRole.toLowerCase() === "admin";
	const isMoney = rawRole.toLowerCase() === "money";

	let allowedPaths: string[] = tokenData.allowedPaths || [];
	if (!allowedPaths.length) {
		const userSessionCookie = request.cookies.get("user_session")?.value;
		if (userSessionCookie) {
			try {
				const parsed = JSON.parse(userSessionCookie);
				allowedPaths = parsed.allowedPaths || [];
			} catch {}
		}
	}

	const isWildcard =
		allowedPaths.includes("*") || rawRole === "SUPER_ADMIN";

	if (isPublic && tokenData) {
		if (path === "/reset-password") {
			return NextResponse.next();
		}
		if (isMoney) {
			return NextResponse.redirect(new URL("/receipt", request.nextUrl));
		}
		const fallback = isWildcard ? "/" : allowedPaths[0] || "/";
		return NextResponse.redirect(new URL(fallback, request.nextUrl));
	}

	if (isAdmin) {
		if (!isWildcard) {
			const isAllowed = allowedPaths.some(
				(p: string) =>
					path === p ||
					(p !== "/" && path.startsWith(`${p}/`)) ||
					(p === "/" && path === "/")
			);
			if (!isAllowed) {
				const fallback = allowedPaths[0] || "/";
				return NextResponse.redirect(new URL(fallback, request.nextUrl));
			}
		}

		const response = NextResponse.next();

		if (!request.cookies.has("user_session")) {
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
	} else if (isMoney) {
		if (path !== "/receipt") {
			return NextResponse.redirect(new URL("/receipt", request.nextUrl));
		}
		return NextResponse.next();
	} else {
		const response = NextResponse.redirect(new URL("/login", request.nextUrl));
		response.cookies.delete("accessToken");
		response.cookies.delete("tokenAdmin");
		response.cookies.delete("tokenMoney");
		return response;
	}
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|assets|favicon.ico).*)",
	],
};

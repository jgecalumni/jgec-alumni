import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

function parseJwt(token: string) {
	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join("")
		);
		return JSON.parse(jsonPayload);
	} catch (e) {
		return null;
	}
}

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isPublic = path === "/login";

	const token =
		request.cookies.get("tokenAdmin")?.value ||
		request.cookies.get("tokenMoney")?.value || "";

	let tokenData = parseJwt(token);	

	// Check if token is expired
	if (tokenData && tokenData.exp) {
		const currentTime = Math.floor(Date.now() / 1000);
		
		if (tokenData.exp < currentTime) {
			tokenData = null; // Treat as invalid
		}
	}

	// If the user does not have a valid token (missing, invalid, or expired)
	if (!tokenData) {
		
		const response = isPublic
			? NextResponse.next()
			: NextResponse.redirect(new URL("/login", request.nextUrl));
		response.cookies.delete("tokenAdmin");
		response.cookies.delete("tokenMoney");
		return response;
	}

	// If user is logged in and trying to access login page, redirect them accordingly
	if (isPublic && tokenData) {
		if (tokenData.role === "admin") {
			return NextResponse.redirect(new URL("/", request.nextUrl));
		}
		if (tokenData.role === "money") {
			return NextResponse.redirect(new URL("/receipt", request.nextUrl));
		}
	}

	// Role-based access control
	if (tokenData) {
		if (tokenData.role === "admin") {
			// admin can access all routes
			return NextResponse.next();
		} else if (tokenData.role === "money") {
			// money can only access /receipt
			if (path !== "/receipt") {
				return NextResponse.redirect(new URL("/receipt", request.nextUrl));
			}
		} else {
			// unknown role - clear cookies and redirect to login
			const response = NextResponse.redirect(new URL("/login", request.nextUrl));
			response.cookies.delete("tokenAdmin");
			response.cookies.delete("tokenMoney");
			return response;
		}
	}
}

export const config = {
	matcher: [
		"/login",
		"/",
		"/gallery",
		"/members",
		"/notice",
		"/events",
		"/scholarship",
		"/receipt",
		"/documents",
	],
};

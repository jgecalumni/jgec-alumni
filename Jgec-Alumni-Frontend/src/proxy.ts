import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isPublic = path === "/login";
	const isProfile = path.startsWith("/profile/"); // ✅ Correctly matches dynamic paths
	const token = request.cookies.get("token")?.value || "";

	if (isPublic && token) {
		return NextResponse.redirect(new URL("/", request.nextUrl));
	} else if (isProfile && !token) {
		return NextResponse.redirect(new URL("/login", request.nextUrl));
	}
}

// Apply middleware to all profile routes dynamically
export const config = {
	matcher: [
		"/login",
		"/",
		"/gallery",
		"/giving-back",
		"/contact",
		"/kanchenjunga",
		"/research-intership",
		"/scholarships",
		"/take-a-trip",
		"/upcoming-events",
		"/vission-mission",
		"/profile/:path*", 
	],
};

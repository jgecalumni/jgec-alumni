import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/store/provider";
import ReactQueryProvider from "@/store/query-client";
import { Toaster } from "react-hot-toast";
import { Poppins } from "next/font/google"
import "react-quill/dist/quill.snow.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
	title: "Jalpaiguri Government Engineering College Alumni Association.",
	description:
		"The alumni association of Jalpaiguri Government Engineering College.",
	keywords:
		"Jalpaiguri Government Engineering College, JGEC, Alumni Association, JGEC Alumni Association, Jalpaiguri",
	openGraph: {
		title: "Jalpaiguri Government Engineering College.",
		description:
			"The alumini association of Jalpaiguri Government Engineering College.",
		// url: 'https://cfi-jgec-new.vercel.app',
		type: "website",
	},
};

const poppins = Poppins({
	weight: ['400', '500', '600', '700'],
	subsets: ['latin'],
	variable:'--font-poppins'
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${poppins.className} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Providers>
						<ReactQueryProvider>
							{children}
							<Toaster />
						</ReactQueryProvider>
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}

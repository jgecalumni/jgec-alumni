"use client"
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Topbar from "@/components/topbar";
import { useAuth } from "@/store/AuthContext";
import React from "react";
import Loading from "../Loader";

const Layout = ({ children }: { children: React.ReactNode }) => {
	const { loading } = useAuth();
	if (!loading) {
		return <Loading />;
	}
	return (
		<div className="w-full">
			<Topbar />
			<Navbar />
			{children}
			<Footer />
		</div>
	);
};

export default Layout;

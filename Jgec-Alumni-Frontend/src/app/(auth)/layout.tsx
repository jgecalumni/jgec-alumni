import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Topbar from "@/components/topbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<Topbar/>
			<Navbar/> 
			{children}
			<Footer/> 
		</div>
	);
};

export default Layout;

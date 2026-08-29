import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const Page = () => {
	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<Card>
				<CardHeader className="text-red-400">
					<CardTitle>Card Title</CardTitle>
					<CardDescription>Card Description</CardDescription>
				</CardHeader>
				<CardContent>
					<p>Card Content</p>
				</CardContent>
				<CardFooter>
					<p>Card Footer</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default Page;

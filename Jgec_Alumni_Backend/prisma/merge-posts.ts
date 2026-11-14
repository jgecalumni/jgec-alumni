import prisma from "./index";

async function mergeDuplicatePosts() {
	console.log("Checking for duplicate 'Governing Body Member' posts...");

	const posts = await prisma.governingBodyPost.findMany({
		where: {
			title: {
				contains: "Governing Body Member",
			},
		},
		include: { members: true },
		orderBy: { id: "asc" },
	});

	console.log(`Found ${posts.length} posts with title matching 'Governing Body Member'`);

	if (posts.length <= 1) {
		console.log("No duplicates to merge.");
		return;
	}

	const primaryPost = posts[0];
	console.log(`Target primary post ID: ${primaryPost.id} (Order: ${primaryPost.order})`);

	let currentOrder = primaryPost.members.length;

	for (let i = 1; i < posts.length; i++) {
		const duplicatePost = posts[i];
		console.log(`Processing duplicate post ID: ${duplicatePost.id} with ${duplicatePost.members.length} members`);

		for (const member of duplicatePost.members) {
			currentOrder += 1;
			console.log(`  Moving member "${member.name}" to post ID ${primaryPost.id} with order ${currentOrder}`);
			await prisma.governingBodyMember.update({
				where: { id: member.id },
				data: {
					postId: primaryPost.id,
					order: currentOrder,
				},
			});
		}

		// Delete the now empty duplicate post
		console.log(`  Deleting empty post ID: ${duplicatePost.id}`);
		await prisma.governingBodyPost.delete({
			where: { id: duplicatePost.id },
		});
	}

	// Now resequence all posts orders 1, 2, 3, 4, ...
	const allPosts = await prisma.governingBodyPost.findMany({
		orderBy: { order: "asc" },
	});

	console.log("Resequencing post orders:");
	for (let idx = 0; idx < allPosts.length; idx++) {
		const p = allPosts[idx];
		await prisma.governingBodyPost.update({
			where: { id: p.id },
			data: { order: idx + 1 },
		});
		console.log(`  Post ID ${p.id} "${p.title}" -> Order #${idx + 1}`);
	}

	console.log("Done! Duplicate posts merged successfully.");
}

mergeDuplicatePosts()
	.catch((e) => {
		console.error("Error merging duplicate posts:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

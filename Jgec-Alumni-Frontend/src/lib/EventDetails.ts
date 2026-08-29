interface EventDetail {
	id: number;
	title: string;
	description: string;
	details: string;
	imageUrl: string;
	date: string;
	time: string;
	schedule: [
		{
			id: number;
			startTime: string;
			endTime: string;
			activity: string;
		}
	];
}

export const EventDetails: EventDetail[] = [
	{
		id: 1,
		title: "We are going to arrange a get-together!",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit.Asperiores, accusantium? Ratione nisi, odio illo id sapiente,temporibus iure qui reprehenderit quisquam unde fugiat mollitia aperiam eum tempore cumque, recusandae earum.",
		details:
			"Aenean viverra rhoncus pede. Phasellus leo dolor, tempus non, auctor endrerit quis, nisi. Fusce neque. Donec vitae orci sed dolor rutrum auctor. Sed ngilla mauris sit amet nibhr, tempus non, auctor endrerit quis, nisi.Etiam rhoncus. Ut leo. Morbi mollis tellus ac sapien. Fusce fermentum oo nec arcu. Quisque malesuada placerat nisl. Etiam sit amet orci eget faucitincidunt. Quisque rutrum. Pellentesque posuere. Praesent ac massa at ligula laoureet iaculis. Cras risus ipsum, faucibus ut, ullamcorper id, varius ac, leo.Ut a nisl id Etiam rhoncus. Ut leo. Morbi mollis tellus ac sapien. Fusce fermentum oo nec ante tempus hendrerit. Curabitur at lacus ac velit ornare lobortis. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In turpis. Quisque id mi.",
		imageUrl: "/assets/membership.jpg",
		date: "2024-12-31",
		time: "23:59:59",
		schedule: [
			{
				id: 1,
				startTime: "8am",
				endTime: "10am",
				activity: "Breakfast",
			},
		],
	},
	{
		id: 2,
		title: "We are going to arrange a get-together!",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit.Asperiores, accusantium? Ratione nisi, odio illo id sapiente,temporibus iure qui reprehenderit quisquam unde fugiat mollitia aperiam eum tempore cumque, recusandae earum.",
		details:
			"Aenean viverra rhoncus pede. Phasellus leo dolor, tempus non, auctor endrerit quis, nisi...",
		imageUrl: "/assets/membership.jpg",
		date: "2024-12-31",
		time: "23:59:59",
		schedule: [
			{
				id: 1,
				startTime: "8am",
				endTime: "10am",
				activity: "Breakfast",
			},
		],
	},
];

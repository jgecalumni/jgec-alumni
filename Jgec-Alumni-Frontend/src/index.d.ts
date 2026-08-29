interface IRegisterType {
	email: string;
	password: string;
	name: string;
	nickname: string;
	passingYear: string;
	department: string;
	residentialAddress: string;
	professionalAddress: string;
	photo: null;
	receipt: null;
}
interface ILoginType {
	email: string;
	password: string;
}

interface IEventType {
	id: any;
	name: string;
	shortDescription: string;
	details: string;
	event_thumbnail: string;
	date: string;
	time: string;
	location: string;
	hostName: string;
	hostDetails: string;
	schedule: [
		{
			startTime: string;
			endTime: string;
			activity: string;
		}
	];
	createdAt: string;
	updatedAt: string;
}

interface INoticeType {
	id: string;
	title: string;
	description: string;
	date: string;
	link: string;
	link_public_id: string;
	createdAt: string;
	updatedAt: string;
}

interface IScholarshipType {
	document: any;
	id: string;
	name: string;
	subtitle: string;
	providerName: string;
	providerImage: string;
	providerDepartment:string;
	providerPassingYear:any
	providerDescription: string;
	description: string;
	whoCanApply: string;
	whenToApply: string;
	ageLimit: string;
	amountDetails: string;
	semRequire: string;
	isActive: boolean;
	department: string;
	startDate: string;
	endDate: string;
	scholarshipApplicants: [
		{
			id: string;
			name: string;
			email: string;
			mobile: string;
			department: string;
			hsPercentage: string;
			btechResults: string;
		}
	];
}
interface IUserType {
	id: number;
	name: string;
	email: string;
	password: string;
	studentId: any;
	passingYear: any;
	department: string;
	residentialAddress: string;
	professionalAddress: string;
	photo: string | null;
	photo_public_id: string;
	receipt: string | null;
	receipt_public_id: string;
	createdAt: string;
	updatedAt: string;
}

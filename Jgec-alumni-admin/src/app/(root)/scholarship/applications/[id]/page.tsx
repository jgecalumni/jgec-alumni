import React from "react";
import ScholarshipApplicants from "@/components/Scholarships/ScholarshipApplicants";

export default function ScholarshipApplicationsPage({ params }: { params: { id: string } }) {
	return <ScholarshipApplicants id={params.id} />;
}

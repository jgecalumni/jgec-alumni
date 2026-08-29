export const WelcomeMail = (name: string) => {
	return `<body
    style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; color: #333; line-height: 1.6;">
    <div
        style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
        <!-- Header Section -->
        <div style="background-color: #a8b9ed; color: #080A0D; text-align: center; padding: 20px;">
            <img src="https://res.cloudinary.com/daanphoru/image/upload/v1744962756/Logo_vx2vnz.png"
                alt="JGEC Alumni Association Logo" style="max-width: 160px; margin-bottom: 10px; object-fit: contain;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 500;">Welcome to Jalpaiguri Government Engineering
                College Alumni Association</h1>
        </div>

        <!-- Content Section -->
        <div style="padding: 20px">
            <!-- Welcome Greetings -->
            <div>
                <h4 style="color: #516bb7; font-size: 16px; margin-bottom: 4px;">Dear ${name},</h4>
                <p style="font-size: 14px; margin-bottom: 10px;">We are thrilled to welcome you to the <strong style="font-size: 12px;"">JGEC Alumni Association</strong>. It
                    is our pleasure to
                    have you as part of our vibrant community that connects generations of graduates from our
                    prestigious
                    institution.</p>
            </div>

            <!-- Responsibilities -->
            <div>
                <h2 style="color: #516bb7; font-size: 16px; margin-bottom: 0px;">Your Role as an Alumni Member</h2>
                <p style="font-size: 14px;">As a valued member, you have the opportunity to:</p>
                <ul style="font-size: 14px;">
                    <li>Contribute to the growth and success of current students and fellow alumni.</li>
                    <li>Participate in networking events, mentoring programs, and alumni meetups.</li>
                    <li>Stay updated with college news and initiatives.</li>
                    <li>Support institutional development and community engagement projects.</li>
                </ul>
            </div>

            <!-- Best Regards -->
            <div>
                <h2 style="color: #080A0D; font-size: 14px;">Best Regards,</h2>
                <p style="font-size: 14px;">
                    The <strong>JGEC Alumni Association</strong><br>
                    <em>"Driven by Gratitude, Bonded with Nostalgia"</em>
                </p>
            </div>
        </div>

        <!-- Footer Section -->
        <div style="background-color: #f4f4f9; text-align: center; padding: 15px; font-size: 14px; color: #555;">
            <p>If you have any questions, feel free to reach us at <a href="mailto:alumnijgec320@gmail.com"
                    style="color: #516bb7; text-decoration: none;">alumnijgec320@gmail.com</a>.</p>
            <p>Follow us on our social media channels to stay connected!</p>
        </div>
    </div>
</body>`;
};

export const ScholarshipApplicationMail = (
	applicant: string,
	scholarship: string
) => {
	return `
        <body
        style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px; margin: 0;">
        <div
            style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h1 style="text-align: center; color: #333;">Scholarship Application Received</h1>

            <p style="font-size: 16px; color: #555;">
                Dear <strong>${applicant}</strong>,
            </p>

            <p style="font-size: 16px; color: #555;">
                We are pleased to inform you that we have received your application for the <strong>${scholarship}</strong>.
            </p>

            <p style="font-size: 16px; color: #555;">
                Your application is currently under review by our team. The review process involves verifying your
                academic achievements,
                financial status, and many more. 
                Once the review
                is complete, we will provide the list in the notice section.
            </p>

            <p style="font-size: 16px; color: #555;">
                If additional information is required, our team will contact you directly. In the meantime, If you have any questions, feel free to reach out Dr. Mousam Chatterjee (+91 9433480022).
            </p>

            <p style="font-size: 16px; font-weight: bold; color: #333;">
                Thank you for applying, and we wish you the best of luck!
            </p>

            <p style="font-size: 16px; color: #555; margin-top: 20px;">
                Best regards,<br>
                <strong>JGEC Alumni Association</strong>
            </p>
        </div>
    </body>
        `;
};

export const ReceiptSubmitMail = (
	name: string,
	amount: number,
	transactionId: string,
	donationFor: string
) => {
	return `
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9fb; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <!-- Header Section -->
        <div style="background-color: #516bb7; color: #ffffff; text-align: center; padding: 25px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Receipt Request Confirmation</h1>
        </div>
        
        <!-- Content Section -->
        <div style="padding: 25px;">
            <h4 style="color: #516bb7; font-size: 18px; margin-bottom: 10px;">Dear ${name},</h4>
            <p style="font-size: 15px; margin-bottom: 15px;">We have successfully received your request for a donation receipt. Below are the details of your request:</p>
            <div style="background: #f4f4f9; padding: 15px; border-radius: 8px;">
                <p style="font-size: 15px;"><strong>Name:</strong> ${name}</p>
                <p style="font-size: 15px;"><strong>Amount:</strong> ₹${amount}</p>
                <p style="font-size: 15px;"><strong>Donation For:</strong> ${donationFor}</p>
                <p style="font-size: 15px;"><strong>Transaction ID:</strong> ${transactionId}</p>
            </div>
            <p style="font-size: 15px; margin-top: 15px;">Our team is currently processing your request. You will receive your receipt within 7-10 working days. If you have any questions, feel free to reach out Dr. Mousam Chatterjee (+91 9433480022).</p>
            <p style="font-size: 15px;">Thank you for your generosity and support.</p>
            <div >
                <h2 style="color: #080A0D; font-size: 14px;">Best Regards,</h2>
                <p style="font-size: 14px;">
                    The <strong>JGEC Alumni Association</strong><br>
                    <em>"Driven by Gratitude, Bonded with Nostalgia"</em>
                </p>
            </div>
        </div>
        <!-- Footer Section -->
        <div style="background-color: #506bb6; text-align: center; padding: 15px; font-size: 14px; color: #ffff;">
            <p>If you have any questions, feel free to reach us.</p>
            <p>Follow us on our social media channels to stay connected!</p>
        </div>
    </div>
</body>
`;
};

export const ReceiptApprovalMail = (
	name: string,
	amount: number,
	transactionId: string,
	donationFor: string
) => {
	return `
    
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9fb; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <!-- Header Section -->
        <div style="background-color: #516bb7; color: #ffffff; text-align: center; padding: 25px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Receipt Request Confirmation</h1>
        </div>
        
        <!-- Content Section -->
        <div style="padding: 25px;">
            <h4 style="color: #516bb7; font-size: 18px; margin-bottom: 10px;">Dear Admin,</h4>
            <p style="font-size: 15px; margin-bottom: 15px;">A new receipt request has been submitted and requires your approval. Here are the details:</p>
            <div style="background: #f4f4f9; padding: 15px; border-radius: 8px;">
                <p style="font-size: 15px;"><strong>Name:</strong> ${name}</p>
                <p style="font-size: 15px;"><strong>Amount:</strong> ₹${amount}</p>
                <p style="font-size: 15px;"><strong>Donation For:</strong> ${donationFor}</p>
                <p style="font-size: 15px;"><strong>Transaction ID:</strong> ${transactionId}</p>
            </div>
            <p style="font-size: 15px; margin-top: 15px;">Please review and approve or reject this request in the admin panel.</p>
            <p style="font-size: 15px;">Thank you for your attention to this request.</p>
            <div >
                <h2 style="color: #080A0D; font-size: 14px;">Best Regards,</h2>
                <p style="font-size: 14px;">
                    The <strong>JGEC Alumni Association</strong><br>
                    <em>"Driven by Gratitude, Bonded with Nostalgia"</em>
                </p>
            </div>
        </div>
        
        
        
        <!-- Footer Section -->
        <!-- Footer Section -->
        <div style="background-color: #506bb6; text-align: center; padding: 15px; font-size: 14px; color: #ffff;">
            <p>If you have any questions, feel free to reach us.</p>
            <p>Follow us on our social media channels to stay connected!</p>
        </div>
    </div>
</body>
`;
};

export const approvedReceiptMail = (
	name: string,
	amount: number,
	transactionId: string,
	donationFor: string
) => {
	return `
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9fb; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <!-- Header Section -->
        <div style="background-color: #516bb7; color: #ffffff; text-align: center; padding: 25px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Receipt Request Approved</h1>
        </div>
        
        <!-- Content Section -->
        <div style="padding: 25px;">
            <h4 style="color: #516bb7; font-size: 18px; margin-bottom: 10px;">Dear ${name},</h4>
            <p style="font-size: 15px; margin-bottom: 15px;">We are pleased to inform you that your receipt request has been approved. Below are the details of your donation:</p>
            <div style="background: #f4f4f9; padding: 15px; border-radius: 8px;">
                <p style="font-size: 15px;"><strong>Name:</strong> ${name}</p>
                <p style="font-size: 15px;"><strong>Amount:</strong> ₹${amount}</p>
                <p style="font-size: 15px;"><strong>Donation For:</strong> ${donationFor}</p>
                <p style="font-size: 15px;"><strong>Transaction ID:</strong> ${transactionId}</p>
            </div>
            <p style="font-size: 15px; margin-top: 15px;">Thank you for your generous support. Your contribution helps us in our mission to strengthen the bonds within our community.</p>
            <p style="font-size: 15px;">If you have any questions, feel free to reach out Dr. Mousam Chatterjee (+91 9433480022). Online receipt is attached below.</p>
            <div >
                <h2 style="color: #080A0D; font-size: 14px;">Best Regards,</h2>
                <p style="font-size: 14px;">
                    The <strong>JGEC Alumni Association</strong><br>
                    <em>"Driven by Gratitude, Bonded with Nostalgia"</em>
                </p>
            </div>
        </div>
        <!-- Footer Section -->
        <div style="background-color: #506bb6; text-align: center; padding: 15px; font-size: 14px; color: #ffff;">
            <p>If you have any questions, feel free to reach us.</p>
            <p>Follow us on our social media channels to stay connected!</p>
        </div>
    </div>
</body>
`;
};

export const denyReceiptMail = (
	name: string,
	amount: number,
	transactionId: string,
	donationFor: string
) => {
	return `
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9fb; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <!-- Header Section -->
        <div style="background-color: red; color: #ffffff; text-align: center; padding: 25px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Receipt Request Denied</h1>
        </div>
        
        <!-- Content Section -->
        <div style="padding: 25px;">
            <h4 style="color: #516bb7; font-size: 18px; margin-bottom: 10px;">Dear ${name},</h4>
            <p style="font-size: 15px; margin-bottom: 15px;">We regret to inform you that your receipt request has been denied. Below are the details of your donation:</p>
            <div style="background: #f4f4f9; padding: 15px; border-radius: 8px;">
                <p style="font-size: 15px;"><strong>Name:</strong> ${name}</p>
                <p style="font-size: 15px;"><strong>Amount:</strong> ₹${amount}</p>
                <p style="font-size: 15px;"><strong>Donation For:</strong> ${donationFor}</p>
                <p style="font-size: 15px;"><strong>Transaction ID:</strong> ${transactionId}</p>
            </div>
            <p style="font-size: 15px; margin-top: 15px;">If you have any questions, feel free to reach out Dr. Mousam Chatterjee (+91 9433480022).</p>
            <div >
                <h2 style="color: #080A0D; font-size: 14px;">Best Regards,</h2>
                <p style="font-size: 14px;">
                    The <strong>JGEC Alumni Association</strong><br>
                    <em>"Driven by Gratitude, Bonded with Nostalgia"</em>
                </p>
            </div>
        </div>
        <!-- Footer Section -->
        <div style="background-color: #506bb6; text-align: center; padding: 15px; font-size: 14px; color: #ffff;">
            <p>If you have any questions, feel free to reach us.</p>
            <p>Follow us on our social media channels to stay connected!</p>
        </div>
    </div>
</body>
`;
};

export const contributionReceiptMail = (
	name: string,
	amount: number,
	graduationYear: number
) => {
	return `
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9fb; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <!-- Header Section -->
        <div style="background-color: #516bb7; color: #ffffff; text-align: center; padding: 25px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Contribution Receipt</h1>
        </div>
        
        <!-- Content Section -->
        <div style="padding: 25px;">
            <h4 style="color: #516bb7; font-size: 18px; margin-bottom: 10px;">Dear ${name},</h4>
            <p style="font-size: 15px; margin-bottom: 15px;">Thank you for your generous contribution to the JGEC Alumni Association. Your support helps us strengthen our community and support current and future students.</p>
            <div style="background: #f4f4f9; padding: 15px; border-radius: 8px;">
                <p style="font-size: 15px;"><strong>Contributor Name:</strong> ${name}</p>
                <p style="font-size: 15px;"><strong>Graduation Year:</strong> ${graduationYear}</p>
                <p style="font-size: 15px;"><strong>Contribution Amount:</strong> ₹${amount}</p>
            </div>
            <p style="font-size: 15px; margin-top: 15px;">Your contribution receipt is attached to this email for your records.</p>
            <p style="font-size: 15px;">If you have any questions, feel free to reach out Dr. Mousam Chatterjee (+91 9433480022).</p>
            <div>
                <h2 style="color: #080A0D; font-size: 14px;">Best Regards,</h2>
                <p style="font-size: 14px;">
                    The <strong>JGEC Alumni Association</strong><br>
                    <em>"Driven by Gratitude, Bonded with Nostalgia"</em>
                </p>
            </div>
        </div>
        
        <!-- Footer Section -->
        <div style="background-color: #f4f4f9; text-align: center; padding: 15px; font-size: 14px; color: #555;">
            <p>If you have any questions, feel free to reach us at <a href="mailto:alumnijgec320@gmail.com" style="color: #516bb7; text-decoration: none;">alumnijgec320@gmail.com</a>.</p>
        </div>
    </div>
</body>
`;
};

// Bulk Contribution Report Mail Template
export const bulkContributionReportMail = (contributionCount: number, totalAmount: number) => {
	return `
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9fb; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <!-- Header Section -->
        <div style="background-color: #516bb7; color: #ffffff; text-align: center; padding: 25px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Alumni Contribution Report</h1>
        </div>
        
        <!-- Content Section -->
        <div style="padding: 25px;">
            <h4 style="color: #516bb7; font-size: 18px; margin-bottom: 10px;">Dear Admin,</h4>
            <p style="font-size: 15px; margin-bottom: 15px;">A new bulk contribution upload has been processed successfully. Here's the summary:</p>
            <div style="background: #f4f4f9; padding: 15px; border-radius: 8px;">
                <p style="font-size: 15px;"><strong>Total Contributors:</strong> ${contributionCount}</p>
                <p style="font-size: 15px;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
                <p style="font-size: 15px;"><strong>Generated On:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <p style="font-size: 15px; margin-top: 15px;">The detailed contribution report is attached to this email.</p>
            <div>
                <h2 style="color: #080A0D; font-size: 14px;">Best Regards,</h2>
                <p style="font-size: 14px;">
                    The <strong>JGEC Alumni Association</strong> System<br>
                    <em>"Driven by Gratitude, Bonded with Nostalgia"</em>
                </p>
            </div>
        </div>
        
        <!-- Footer Section -->
        <div style="background-color: #f4f4f9; text-align: center; padding: 15px; font-size: 14px; color: #555;">
            <p>If you have any questions, feel free to reach us at <a href="mailto:alumnijgec320@gmail.com" style="color: #516bb7; text-decoration: none;">alumnijgec320@gmail.com</a>.</p>
        </div>
    </div>
</body>
`;
};

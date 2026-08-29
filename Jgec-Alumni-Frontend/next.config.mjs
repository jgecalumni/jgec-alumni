/** @type {import('next').NextConfig} */
const nextConfig = {
	
	images: {
		domains: ["jgecalum.org", "flowbite.s3.amazonaws.com", "codeboxr.net","res.cloudinary.com"],
	},
	async rewrites() {
		return [
			{
				source: '/v1/api/:path*',
				destination: `http://backend:8000/v1/api/:path*`,
			},
		]
	},
};

export default nextConfig;

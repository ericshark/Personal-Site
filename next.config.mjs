/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Static export has no image optimizer; project screenshots ship as-is.
  images: { unoptimized: true },
};

export default nextConfig;

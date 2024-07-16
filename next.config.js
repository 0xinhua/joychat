const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**'
      }
    ]
  },
  rewrites: [
    {
      source: "/blogs",
      destination: "https://joychat-content.vercel.app/"
    },
    {
      source: "/blog/:path*",
      destination: "https://joychat-content.vercel.app/blog/:path*"
    },
    {
      source: "/:path(tos|privacy|cookies|about|blogs)",
      destination: "https://joychat-content.vercel.app/:path*"
    },
    {
      source: "/blogs/:match*",
      destination: "https://joychat-content.vercel.app/blogs/:match*"
    }
  ],
  transpilePackages: ['validation-schemas'],
  assetPrefix: 'https://joychat.io'
})

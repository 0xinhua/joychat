const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/blogs',
        destination: 'https://joychat-content.vercel.app',
      },
      {
        source: '/blog/:path*',
        destination: 'https://joychat-content.vercel.app/blog/:path*',
      },
      {
        source: '/:path(tos|privacy|cookies|about|blogs)', // 匹配 /tos, /privacy, /cookies 路径
        destination: 'https://joychat-content.vercel.app/:path', // 目标路径
      },
    ]
  },
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
  transpilePackages: ['validation-schemas'],
})

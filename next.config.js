const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const isProd = process.env.NODE_ENV === 'production'

const ContentSecurityPolicy = `
  default-src 'self' https://joychat-content.vercel.app;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://joychat-content.vercel.app giscus.app analytics.umami.is *.mxpnl.com cdn.mxpnl.com;
  style-src 'self' 'unsafe-inline' https://joychat-content.vercel.app;
  img-src 'self' data: blob: https://joychat-content.vercel.app *;
  media-src 'self' https://joychat-content.vercel.app *.s3.amazonaws.com;
  connect-src 'self' https://joychat-content.vercel.app *;
  font-src 'self' https://joychat-content.vercel.app;
  frame-src giscus.app`


const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
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
  async rewrites() {
    return [
      {
        "source": "/blog",
        "destination": "https://joychat-content.vercel.app/content"
      },
      {
        "source": "/blog/:slug*",
        "destination": "https://joychat-content.vercel.app/content/blog/:slug*"
      },
      {
        source: "/:path(tos|privacy|cookies|about)",
        destination: "https://joychat-content.vercel.app/content/:path*"
      },
      {
        source: "/content/_next/:path*",
        destination: "https://joychat-content.vercel.app/content/_next/:path*"
      },
      {
        source: "/content/:match*",
        destination: "https://joychat-content.vercel.app/content/:match*"
      },
      {
        source: "/static/favicons/site.webmanifest",
        destination: "https://joychat-content.vercel.app/content/static/favicons/site.webmanifest"
      },
      {
        source: "/search.json",
        destination: "https://joychat-content.vercel.app/content/search.json"
      }
    ]
  },
  transpilePackages: ['validation-schemas'],
  assetPrefix: isProd ? 'https://joychat.io' : undefined
})

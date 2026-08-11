import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows loading the dev server from other devices/networks (LAN, VPN, hotspot, etc.)
  // without Next.js blocking cross-origin dev asset requests. Dev-only — never affects
  // the production build. "*" wildcards one hostname label, so these cover the entire
  // private IP ranges (RFC 1918) regardless of which specific address gets assigned.
  allowedDevOrigins: [
    "10.*.*.*",
    "172.16.*.*",
    "172.17.*.*",
    "172.18.*.*",
    "172.19.*.*",
    "172.20.*.*",
    "172.21.*.*",
    "172.22.*.*",
    "172.23.*.*",
    "172.24.*.*",
    "172.25.*.*",
    "172.26.*.*",
    "172.27.*.*",
    "172.28.*.*",
    "172.29.*.*",
    "172.30.*.*",
    "172.31.*.*",
    "192.168.*.*",
  ],
};

export default nextConfig;

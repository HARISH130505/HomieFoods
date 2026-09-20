declare module 'next-pwa' {
  import type { NextConfig } from 'next';
  function withPWA(config?: any): (nextConfig?: any) => any;
  export default withPWA;
}

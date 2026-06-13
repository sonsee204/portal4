/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

export function AuthBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Primary gradient orbs */}
      <div className="bg-primary/20 absolute -top-40 -left-40 h-[500px] w-[500px] animate-pulse rounded-full blur-[140px]" />
      <div className="absolute -right-40 -bottom-40 h-[500px] w-[500px] animate-pulse rounded-full bg-blue-500/15 blur-[140px] [animation-delay:1s]" />
      <div className="bg-primary/10 absolute top-1/2 left-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full blur-[100px] [animation-delay:2s]" />
      <div className="absolute right-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full bg-emerald-500/8 blur-[100px] [animation-delay:3s]" />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(124, 58, 237, 0.4) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Diagonal sport stripes (subtle) */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, transparent, transparent 60px, rgba(124, 58, 237, 0.15) 60px, rgba(124, 58, 237, 0.15) 61px)',
        }}
      />
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Logo } from '@/components/atoms/Logo';
import { IonIcon } from '@/components/atoms/IonIcon';
import { AUTH } from '@/lib/strings';

const floatingShapes = [
  { size: 80, x: '15%', y: '20%', delay: 0, duration: 8 },
  { size: 60, x: '75%', y: '15%', delay: 1.5, duration: 10 },
  { size: 100, x: '65%', y: '70%', delay: 0.8, duration: 9 },
  { size: 50, x: '25%', y: '80%', delay: 2, duration: 7 },
  { size: 40, x: '85%', y: '45%', delay: 1, duration: 11 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export function AuthBrandPanel() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 p-10 xl:p-14">
      {/* Mesh gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(124,58,237,0.3)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(59,130,246,0.15)_0%,transparent_50%)]" />

      {/* Sport-themed grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Floating geometric shapes */}
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full border border-white/10 bg-white/[0.03]"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
          }}
          animate={{
            y: [0, -20, 0, 15, 0],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.08, 1, 0.95, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
        />
      ))}

      {/* Decorative corner accents */}
      <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-white/[0.06] to-transparent" />
      <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-white/[0.04] to-transparent" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div variants={itemVariants}>
          <Logo
            variant="full"
            href={undefined}
            className="[&_h1]:text-white [&_p]:text-violet-300/70"
          />
        </motion.div>

        {/* Tagline */}
        <motion.div variants={itemVariants} className="mt-10">
          <h2 className="text-2xl leading-tight font-bold text-white xl:text-3xl">
            {AUTH.BRAND.TAGLINE}
          </h2>
          <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-violet-400 to-emerald-400" />
        </motion.div>
      </motion.div>

      {/* Feature highlights */}
      <motion.div
        className="relative z-10 mt-auto space-y-4 pt-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {AUTH.BRAND.FEATURES.map((feature) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 backdrop-blur-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/20">
              <IonIcon
                name={feature.icon}
                size="sm"
                className="text-violet-300"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">
                {feature.title}
              </p>
              <p className="text-xs leading-relaxed text-violet-200/60">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

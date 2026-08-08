import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function ZaloIcon() {
  return (
    <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: '#fff' }}>
      Zalo
    </span>
  );
}

const buttons = [
  {
    id: 'call' as const,
    href: 'tel:+84123456789',
    label: 'Gọi ngay',
    icon: <Phone className="w-6 h-6" />,
    gradientFrom: '#3AE7E1',
    gradientTo: '#06b6d4',
    pulseColor: 'rgba(58, 231, 225, 0.5)',
    glowColor: 'rgba(58, 231, 225, 0.25)',
    shake: true,
  },
  {
    id: 'zalo' as const,
    href: 'https://zalo.me/',
    label: 'Chat Zalo',
    icon: <ZaloIcon />,
    gradientFrom: '#0068FF',
    gradientTo: '#5B9EFF',
    pulseColor: 'rgba(0, 104, 255, 0.5)',
    glowColor: 'rgba(0, 104, 255, 0.25)',
    shake: false,
  },
];

export function FloatingContactButtons() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return createPortal(
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 50,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        alignItems: 'flex-end',
      }}
    >
      {buttons.map((btn) => (
        <div key={btn.id} style={{ position: 'relative' }}>
          {/* Tooltip */}
          <AnimatePresence>
            {hoveredButton === btn.id && (
              <motion.span
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  right: '100%',
                  marginRight: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  whiteSpace: 'nowrap',
                  borderRadius: 10,
                  background: '#fff',
                  padding: '8px 14px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#0B1C2D',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  pointerEvents: 'none' as const,
                  letterSpacing: '0.01em',
                }}
              >
                {btn.label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Outer glow pulse */}
          <motion.span
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: 20,
              background: `radial-gradient(circle, ${btn.pulseColor}, transparent 70%)`,
              pointerEvents: 'none' as const,
            }}
            animate={{ scale: [1, 1.5, 1.8], opacity: [0.5, 0.2, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.span
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: 20,
              background: `radial-gradient(circle, ${btn.pulseColor}, transparent 70%)`,
              pointerEvents: 'none' as const,
            }}
            animate={{ scale: [1, 1.5, 1.8], opacity: [0.5, 0.2, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 1.2 }}
          />

          {/* Border ring pulse */}
          <motion.span
            style={{
              position: 'absolute',
              inset: -2,
              borderRadius: 16,
              border: `2px solid ${btn.pulseColor}`,
              pointerEvents: 'none' as const,
            }}
            animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />

          {/* Button */}
          <motion.a
            href={btn.href}
            target={btn.id === 'zalo' ? '_blank' : undefined}
            rel={btn.id === 'zalo' ? 'noopener noreferrer' : undefined}
            style={{
              position: 'relative',
              display: 'flex',
              width: 56,
              height: 56,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 14,
              background: `linear-gradient(135deg, ${btn.gradientFrom}, ${btn.gradientTo})`,
              border: 'none',
              color: '#fff',
              boxShadow: `0 6px 28px ${btn.glowColor}, 0 2px 8px rgba(0,0,0,0.3)`,
              cursor: 'pointer',
              textDecoration: 'none',
              overflow: 'hidden',
            }}
            whileHover={{ scale: 1.12, boxShadow: `0 8px 36px ${btn.pulseColor}, 0 2px 8px rgba(0,0,0,0.3)` }}
            whileTap={{ scale: 0.9 }}
            onHoverStart={() => setHoveredButton(btn.id)}
            onHoverEnd={() => setHoveredButton(null)}
          >
            {/* Shimmer overlay */}
            <motion.span
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
                pointerEvents: 'none' as const,
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
            />
            <motion.span
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}
              {...(btn.shake
                ? { animate: { rotate: [0, -12, 14, -12, 14, 0] as number[] }, transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2.5 } }
                : { animate: { y: [0, -2, 0] as number[] }, transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } })}
            >
              {btn.icon}
            </motion.span>
          </motion.a>
        </div>
      ))}
    </div>,
    document.body,
  );
}

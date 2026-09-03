"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface GradientCardProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const GradientCard = ({
  icon: Icon,
  title,
  description,
  ctaLabel = "Learn More",
  ctaHref = "#",
}: GradientCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 5;
      const rotateY = (x / rect.width) * 5;
      setRotation({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-[32px] overflow-hidden"
      style={{
        width: "100%",
        maxWidth: "360px",
        height: "450px",
        transformStyle: "preserve-3d",
        backgroundColor: "#0e131f",
        boxShadow:
          "0 -10px 100px 10px rgba(78, 99, 255, 0.25), 0 0 10px 0 rgba(0, 0, 0, 0.5)",
      }}
      initial={{ y: 0 }}
      animate={{
        y: isHovered ? -5 : 0,
        rotateX: rotation.x,
        rotateY: rotation.y,
        perspective: 1000,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Glass reflection */}
      <motion.div
        className="absolute inset-0 z-35 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.05) 100%)",
          backdropFilter: "blur(2px)",
        }}
        animate={{ opacity: isHovered ? 0.7 : 0.5 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Dark base */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(180deg, #000000 0%, #000000 70%)" }}
      />

      {/* Purple/blue glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2/3 z-20"
        style={{
          background:
            "radial-gradient(ellipse at bottom right, rgba(172, 92, 255, 0.7) -10%, rgba(79, 70, 229, 0) 70%), radial-gradient(ellipse at bottom left, rgba(56, 189, 248, 0.7) -10%, rgba(79, 70, 229, 0) 70%)",
          filter: "blur(40px)",
        }}
        animate={{ opacity: isHovered ? 0.9 : 0.8 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Central glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2/3 z-21"
        style={{
          background:
            "radial-gradient(circle at bottom center, rgba(161, 58, 229, 0.7) -20%, rgba(79, 70, 229, 0) 60%)",
          filter: "blur(45px)",
        }}
        animate={{ opacity: isHovered ? 0.85 : 0.75, y: "10%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Bottom border glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] z-25"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.05) 100%)",
        }}
        animate={{ opacity: isHovered ? 1 : 0.9 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Content */}
      <div className="relative flex flex-col h-full p-8 z-40">
        <motion.div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
          style={{
            background: "linear-gradient(225deg, #171c2c 0%, #121624 100%)",
            overflow: "hidden",
          }}
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center w-full h-full relative z-10 text-white">
            {Icon ? (
              <Icon className="w-5 h-5" />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 0L9.4 5.4L14.8 5.4L10.6 8.8L12 14.2L8 10.8L4 14.2L5.4 8.8L1.2 5.4L6.6 5.4L8 0Z"
                  fill="white"
                />
              </svg>
            )}
          </div>
        </motion.div>

        <div className="mb-auto">
          <motion.h3
            className="text-2xl font-medium text-white mb-3"
            style={{ letterSpacing: "-0.01em", lineHeight: 1.2 }}
          >
            {title}
          </motion.h3>
          <motion.p
            className="text-sm mb-6 text-gray-300"
            style={{ lineHeight: 1.5, fontWeight: 350 }}
          >
            {description}
          </motion.p>
          <motion.a
            href={ctaHref}
            className="inline-flex items-center text-white text-sm font-medium group"
            whileHover={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.5))" }}
          >
            {ctaLabel}
            <motion.svg
              className="ml-1 w-4 h-4"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <path
                d="M1 8H15M15 8L8 1M15 8L8 15"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

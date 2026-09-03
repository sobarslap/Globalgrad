"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { Button } from "@/components/ui/button";

export function CtaLamp() {
  return (
    <LampContainer>
      <motion.div
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        <h1 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
          Plan your study abroad <br /> the right way
        </h1>
        <p className="mt-2 max-w-md text-center text-slate-400">
          Free to start. Build your profile and see your first matches in
          minutes.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/sign-up">Create your profile</Link>
        </Button>
      </motion.div>
    </LampContainer>
  );
}

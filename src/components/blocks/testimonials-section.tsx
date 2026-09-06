"use client";

import { motion } from "motion/react";
import {
  TestimonialsColumn,
  type Testimonial,
} from "@/components/ui/testimonials-columns-1";

// Illustrative scenarios, not real customer reviews — this is a portfolio
// project with a demo dataset, so inventing named students with stock photos and
// specific admission claims would be dishonest. Each card shows the kind of
// clarity a feature produces, labelled by the applicant profile it fits.
const testimonials: Testimonial[] = [
  {
    text: "The readiness score pinpoints what's holding a profile back — raise an IELTS band, re-run the match, and reach schools can shift into the target bucket.",
    initials: "RS",
    name: "Readiness Scorecard",
    role: "MSc Computer Science profile",
  },
  {
    text: "Scholarship matching hides everything you're not eligible for and surfaces the funds you'd never have found on your own.",
    initials: "SE",
    name: "Scholarship Eligibility",
    role: "Data Science profile",
  },
  {
    text: "The funding-gap analyzer is honest about the numbers, then points to cheaper countries where the same plan actually balances.",
    initials: "FG",
    name: "Funding Gap Analyzer",
    role: "MBA profile",
  },
  {
    text: "Deadline alerts and the application tracker replace the spreadsheet — eight applications, every status and due date in one board.",
    initials: "AT",
    name: "Application Tracker",
    role: "MEng profile",
  },
  {
    text: "The AI advisor explains why one program fits a profile better than a higher-ranked one — the reasoning, not just a ranking.",
    initials: "AI",
    name: "AI Advisor",
    role: "Public Policy profile",
  },
  {
    text: "The Similar Student Finder compares your CGPA and test scores against anonymized past applicants and where they were admitted.",
    initials: "SS",
    name: "Similar Student Finder",
    role: "MSc Robotics profile",
  },
  {
    text: "The reality check surfaces hidden housing and living costs for a city before you commit an application fee to it.",
    initials: "RC",
    name: "Reality Check",
    role: "MSc Finance profile",
  },
  {
    text: "The visa hub lays out documents, financial-proof thresholds, timelines and common mistakes, country by country.",
    initials: "VH",
    name: "Visa Preparation Hub",
    role: "PhD profile",
  },
  {
    text: "Everything connects — profile, money, deadlines, decision — so it reads less like a search engine and more like a strategy.",
    initials: "DC",
    name: "Decision Core",
    role: "MSc Biotech profile",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative my-20">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[600px] flex-col items-center justify-center"
        >
          <div className="flex justify-center">
            <div className="rounded-lg border px-4 py-1 text-sm">How it helps</div>
          </div>
          <h2 className="mt-5 text-center text-4xl font-bold tracking-tighter md:text-5xl">
            Decisions, made with data
          </h2>
          <p className="mt-5 text-center opacity-75">
            Illustrative scenarios showing the kind of clarity each part of the
            platform gives an applicant — not customer reviews.
          </p>
        </motion.div>

        <div className="mt-10 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
}

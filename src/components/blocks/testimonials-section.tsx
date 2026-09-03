"use client";

import { motion } from "motion/react";
import {
  TestimonialsColumn,
  type Testimonial,
} from "@/components/ui/testimonials-columns-1";

const testimonials: Testimonial[] = [
  {
    text: "The readiness score told me exactly what was holding me back. I fixed my IELTS, re-ran the match, and three reach schools became targets.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Nusrat Jahan",
    role: "MSc CS applicant, admitted to TU Munich",
  },
  {
    text: "Scholarship matching saved me weeks. It ignored everything I wasn't eligible for and surfaced two funds I'd never heard of.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Rafiul Karim",
    role: "Data Science, fully funded",
  },
  {
    text: "The funding-gap analyzer was brutally honest — and then it showed me cheaper countries where my plan actually worked.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Sara Malik",
    role: "MBA applicant",
  },
  {
    text: "Deadline alerts alone were worth it. I stopped living in spreadsheets and the tracker kept eight applications straight.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Rahman",
    role: "MEng applicant",
  },
  {
    text: "The AI advisor explained why one program fit me better than a higher-ranked one. That reasoning changed my whole shortlist.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "Public Policy applicant",
  },
  {
    text: "Seeing anonymized students with my exact CGPA and IELTS — and where they got in — gave me the confidence to aim higher.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "MSc Robotics applicant",
  },
  {
    text: "The reality check saved me from a city I couldn't afford. Hidden housing costs, right there before I applied.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Aliza Khan",
    role: "MSc Finance applicant",
  },
  {
    text: "Visa prep was the part I dreaded. The hub laid out documents, timelines and common mistakes step by step.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hasan Ali",
    role: "PhD applicant",
  },
  {
    text: "It felt less like a search engine and more like a strategist. Everything connected — profile, money, deadlines, decision.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Maya Chowdhury",
    role: "MSc Biotech applicant",
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
            <div className="rounded-lg border px-4 py-1 text-sm">Student stories</div>
          </div>
          <h2 className="mt-5 text-center text-4xl font-bold tracking-tighter md:text-5xl">
            Decisions students trusted
          </h2>
          <p className="mt-5 text-center opacity-75">
            Real outcomes from applicants who planned with data instead of guesswork.
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

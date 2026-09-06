"use client";

import { motion } from "motion/react";
import {
  TestimonialsColumn,
  type Testimonial,
} from "@/components/ui/testimonials-columns-1";
import { Eyebrow } from "@/components/marketing/kit";

// Student testimonials.
const testimonials: Testimonial[] = [
  {
    text: "The readiness score instantly showed where my profile was weak. I raised my IELTS band, re-ran the match, and two reach schools moved into my target list.",
    initials: "RH",
    name: "Rafid Hasan",
    role: "MSc Computer Science · admitted to TU Munich",
  },
  {
    text: "Scholarship matching found funding I never knew existed and hid everything I wasn't eligible for. I stopped wasting nights on applications I'd never win.",
    initials: "TA",
    name: "Tahmina Akter",
    role: "MSc Data Science · Chevening scholar",
  },
  {
    text: "The funding-gap analyzer was brutally honest about my numbers, then pointed me to cheaper countries where the same plan actually balanced. That changed my whole shortlist.",
    initials: "SR",
    name: "Sabbir Rahman",
    role: "MBA applicant · now in Germany",
  },
  {
    text: "Eight applications, every status and deadline on one board. The alerts meant I never missed a document cutoff — it completely replaced my messy spreadsheet.",
    initials: "NJ",
    name: "Nusrat Jahan",
    role: "MEng · University of Alberta",
  },
  {
    text: "The AI advisor explained why a lower-ranked program fit me better than a famous one — the reasoning, not just a ranking. That's what made me trust it.",
    initials: "AC",
    name: "Arif Chowdhury",
    role: "MSc Public Policy applicant",
  },
  {
    text: "The Similar Student Finder compared my CGPA and scores against past applicants and showed exactly where people like me got in. It made my choices feel grounded.",
    initials: "MI",
    name: "Maliha Islam",
    role: "MSc Robotics · KTH Sweden",
  },
  {
    text: "The reality check surfaced hidden housing and living costs for a city before I paid a single application fee. It saved me from a very expensive mistake.",
    initials: "TA",
    name: "Tanvir Ahmed",
    role: "MSc Finance applicant",
  },
  {
    text: "The visa hub laid out documents, financial-proof thresholds, timelines and common mistakes country by country. I walked into my interview fully prepared.",
    initials: "FK",
    name: "Farhana Kabir",
    role: "PhD candidate · Netherlands",
  },
  {
    text: "Everything connects — profile, money, deadlines, decision. It felt less like a search engine and more like a strategy built around me.",
    initials: "IH",
    name: "Imran Hossain",
    role: "MSc Biotech · TU Delft",
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
          className="mx-auto flex max-w-[620px] flex-col items-center justify-center"
        >
          <Eyebrow>Loved by students</Eyebrow>
          <h2 className="mt-4 text-center text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.05]">
            Students who decided with data
          </h2>
          <p className="mt-5 text-center text-muted-foreground">
            Applicants across Bangladesh use GlobalGrad to turn a raw profile
            into an admit-ready plan. Here&apos;s what they say.
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

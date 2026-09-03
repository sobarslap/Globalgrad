# Graph Report - src  (2026-09-04)

## Corpus Check
- Corpus is ~8,667 words - fits in a single context window. You may not need a graph.

## Summary
- 131 nodes · 277 edges · 9 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Decision Engines & Domain
- UI Primitives & Interactive Card
- Landing Page Sections
- Scholarship Engine & Tests
- Navbar, Theme & CTA
- Dashboard & Profile Form
- Testimonials Marquee
- Root Layout & Theme

## God Nodes (most connected - your core abstractions)
1. `cn()` - 20 edges
2. `Button` - 10 edges
3. `StudentProfile` - 8 edges
4. `scoreReadiness()` - 7 edges
5. `Card` - 6 edges
6. `scoreScholarship()` - 6 edges
7. `CardHeader` - 5 edges
8. `CardTitle` - 5 edges
9. `CardContent` - 5 edges
10. `Program` - 5 edges

## Surprising Connections (you probably didn't know these)
- `DashboardPage()` --calls--> `matchScholarships()`  [EXTRACTED]
  app/(app)/dashboard/page.tsx → lib/engines/scholarship.ts
- `Button` --calls--> `cn()`  [EXTRACTED]
  components/ui/button.tsx → lib/utils.ts
- `CardDescription` --calls--> `cn()`  [EXTRACTED]
  components/ui/card.tsx → lib/utils.ts
- `CardFooter` --calls--> `cn()`  [EXTRACTED]
  components/ui/card.tsx → lib/utils.ts
- `LampContainer()` --calls--> `cn()`  [EXTRACTED]
  components/ui/lamp.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "Decision Engines & Domain"
Cohesion: 0.14
Nodes (19): bucketMeta, Results(), samplePrograms, sampleScholarships, DegreeLevel, MatchBucket, MatchingResult, Program (+11 more)

### Community 1 - "UI Primitives & Interactive Card"
Cohesion: 0.17
Nodes (13): chips, Interactive3D(), Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle (+5 more)

### Community 2 - "Landing Page Sections"
Cohesion: 0.12
Nodes (13): FeaturesSection(), flagship, secondary, HowItWorks(), steps, IntegrationsSection(), Footer(), GradientCard() (+5 more)

### Community 3 - "Scholarship Engine & Tests"
Cohesion: 0.24
Nodes (13): StudentProfile, clamp(), eqCI(), matchScholarships(), round1(), scoreScholarship(), baseStudent, eliteProgram (+5 more)

### Community 4 - "Navbar, Theme & CTA"
Cohesion: 0.24
Nodes (8): CtaLamp(), links, Navbar(), ThemeToggle(), Button, ButtonProps, buttonVariants, LampContainer()

### Community 5 - "Dashboard & Profile Form"
Cohesion: 0.40
Nodes (7): DashboardPage(), ProfileForm(), ProfileFormProps, StudentProfileInput, studentProfileSchema, StudentProfileValues, matchPrograms()

### Community 6 - "Testimonials Marquee"
Cohesion: 0.28
Nodes (7): firstColumn, secondColumn, testimonials, TestimonialsSection(), thirdColumn, Testimonial, TestimonialsColumn()

### Community 7 - "Root Layout & Theme"
Cohesion: 0.33
Nodes (4): geistMono, geistSans, metadata, ThemeProvider()

## Knowledge Gaps
- **20 isolated node(s):** `geistSans`, `geistMono`, `metadata`, `flagship`, `secondary` (+15 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Primitives & Interactive Card` to `Landing Page Sections`, `Navbar, Theme & CTA`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `ThemeToggle()` connect `Navbar, Theme & CTA` to `Dashboard & Profile Form`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `Button` connect `Navbar, Theme & CTA` to `UI Primitives & Interactive Card`, `Landing Page Sections`, `Dashboard & Profile Form`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `geistSans`, `geistMono`, `metadata` to the rest of the system?**
  _20 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Decision Engines & Domain` be split into smaller, more focused modules?**
  _Cohesion score 0.13538461538461538 - nodes in this community are weakly interconnected._
- **Should `Landing Page Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._
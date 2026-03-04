import React from "react";
import Image from "next/image";
import { Container, SectionHeader, ConditionBadge } from "@/components/ui";

const conditions = [
  {
    grade: "grade-a" as const,
    title: "Like New",
    desc: "Flawless screen and body. Battery health > 90%.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop", // Clean phone back
  },
  {
    grade: "grade-b" as const,
    title: "Good",
    desc: "Light scratches visible from 8 inches away. Battery > 85%.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop", // Normal usage
  },
  {
    grade: "grade-c" as const,
    title: "Fair",
    desc: "Noticeable wear and tear. 100% fully functional. Battery > 80%.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop", // Bit more worn
  },
];

const ConditionExplainer: React.FC = () => {
  return (
    <section className="py-12 bg-surface-card mb-2">
      <Container>
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <SectionHeader
            title="What You See is What You Get"
            subtitle="Every refurbished device goes through a 32-point inspection by certified technicians. We grade them simply so you know exactly what to expect."
            className="md:justify-center justify-center flex-col text-center"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {conditions.map((cond, idx) => (
            <div
              key={idx}
              className="bg-surface-page rounded-md overflow-hidden border border-border-default hover:border-amber-200 transition-colors"
            >
              <div className="relative h-48 w-full bg-navy-100">
                <Image
                  src={cond.image}
                  alt={`Grade ${cond.title}`}
                  fill
                  className="object-cover mix-blend-multiply opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4">
                  <ConditionBadge condition={cond.grade} size="md" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-text-heading mb-2">
                  {cond.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {cond.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ConditionExplainer;

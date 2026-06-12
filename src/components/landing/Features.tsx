import { motion } from "framer-motion";
import { Zap, Shield, Globe, Layers, Clock, Palette } from "lucide-react";
import { cn } from "../../lib/utils";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed. Every interaction is instant, every transition is smooth.",
    size: "large",
    gradient: "from-blue-500/10 to-indigo-500/10",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II compliant with end-to-end encryption.",
    size: "small",
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
  {
    icon: Globe,
    title: "Global Collaboration",
    description: "Real-time sync across time zones with intelligent conflict resolution.",
    size: "small",
    gradient: "from-amber-500/10 to-orange-500/10",
  },
  {
    icon: Layers,
    title: "Flexible Workflows",
    description: "Kanban, list, calendar, or timeline — adapt to how your team works best.",
    size: "small",
    gradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    icon: Clock,
    title: "Time Intelligence",
    description: "AI-powered time estimates and automatic progress tracking.",
    size: "small",
    gradient: "from-rose-500/10 to-red-500/10",
  },
  {
    icon: Palette,
    title: "Beautiful Design",
    description: "Every pixel crafted with care. A joy to use, every single day.",
    size: "large",
    gradient: "from-cyan-500/10 to-blue-500/10",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-white dark:bg-neutral-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
            Everything you need,
            <br />
            nothing you don't.
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            A carefully curated set of features that actually matter. No bloat, no clutter.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "group relative rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg",
                "bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60",
                feature.size === "large" ? "md:col-span-2" : ""
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  feature.gradient
                )}
              />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

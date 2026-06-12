import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";

const floatingCards = [
  { title: "Design Review", status: "In Progress", assignee: "AC", x: -180, y: -40, delay: 0 },
  { title: "API Integration", status: "Done", assignee: "BM", x: 200, y: -80, delay: 0.15 },
  { title: "User Testing", status: "Review", assignee: "DR", x: -120, y: 120, delay: 0.3 },
  { title: "Sprint Planning", status: "Todo", assignee: "EJ", x: 160, y: 100, delay: 0.45 },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-white to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Now with AI-powered insights
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1] mb-6"
        >
          Project management,
          <br />
          <span className="text-neutral-400 dark:text-neutral-500">reimagined.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          The most elegant way to plan, track, and ship work. Designed for teams who value clarity and craft.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <Link
            to="/dashboard"
            className="group flex items-center gap-2 px-6 py-3 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start for free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <button className="flex items-center gap-2 px-6 py-3 rounded-md border border-neutral-200 dark:border-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            <Play className="w-4 h-4" />
            Watch demo
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-6 text-xs text-neutral-400 mb-20"
        >
          {["Free forever plan", "No credit card", "Setup in 60s"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              {item}
            </span>
          ))}
        </motion.div>

        {/* Floating UI Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Main card */}
          <div
            className={cn(
              "relative rounded-2xl border p-6 sm:p-8",
              "bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl",
              "border-neutral-200/60 dark:border-neutral-800/60 shadow-2xl shadow-neutral-900/5 dark:shadow-black/20"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Active Projects</h3>
                <p className="text-xs text-neutral-500 mt-0.5">6 projects • 24 tasks this week</p>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              </div>
            </div>

            {/* Project rows */}
            <div className="space-y-3">
              {[
                { name: "Website Redesign", progress: 72, color: "bg-blue-500" },
                { name: "Mobile App v2.0", progress: 34, color: "bg-indigo-500" },
                { name: "API Integration", progress: 56, color: "bg-emerald-500" },
                { name: "Brand Guidelines", progress: 100, color: "bg-neutral-900 dark:bg-white" },
              ].map((project) => (
                <div key={project.name} className="flex items-center gap-4">
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 w-32 truncate">
                    {project.name}
                  </span>
                  <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                      className={cn("h-full rounded-full", project.color)}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-neutral-500 w-8 text-right">{project.progress}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating cards */}
          {floatingCards.map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: card.x,
                y: card.y,
              }}
              transition={{ duration: 0.6, delay: 0.6 + card.delay }}
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                "px-4 py-3 rounded-md border shadow-lg",
                "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl",
                "border-neutral-200/60 dark:border-neutral-800/60"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {card.assignee}
                </div>
                <div>
                  <div className="text-xs font-medium text-neutral-900 dark:text-white">{card.title}</div>
                  <div
                    className={cn(
                      "text-[10px] font-medium",
                      card.status === "Done"
                        ? "text-emerald-500"
                        : card.status === "In Progress"
                          ? "text-blue-500"
                          : card.status === "Review"
                            ? "text-amber-500"
                            : "text-neutral-400"
                    )}
                  >
                    {card.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

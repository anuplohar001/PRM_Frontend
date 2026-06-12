import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "../../data/sampleData";
import { cn } from "../../lib/utils";

export default function Testimonials() {
  return (
    <section className="py-32 bg-white dark:bg-neutral-900">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
            Loved by teams worldwide.
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            Join thousands of teams who have made Orbit their workspace.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={cn(
                "relative rounded-2xl border p-6",
                "bg-neutral-50 dark:bg-neutral-950 border-neutral-200/60 dark:border-neutral-800/60"
              )}
            >
              <Quote className="w-8 h-8 text-neutral-200 dark:text-neutral-800 mb-4" />
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-gradient-to-br from-neutral-700 to-neutral-900 dark:from-neutral-600 dark:to-neutral-800 flex items-center justify-center text-white text-xs font-bold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">{t.name}</div>
                  <div className="text-xs text-neutral-500">
                    {t.role} at {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

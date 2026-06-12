import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { pricingPlans } from "../../data/sampleData";
import { cn } from "../../lib/utils";

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={cn(
                "relative rounded-2xl border p-6 flex flex-col",
                plan.highlighted
                  ? "bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white"
                  : "bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-blue-500 text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={cn(
                    "text-sm font-semibold mb-1",
                    plan.highlighted ? "text-white dark:text-neutral-900" : "text-neutral-900 dark:text-white"
                  )}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span
                    className={cn(
                      "text-3xl font-bold",
                      plan.highlighted ? "text-white dark:text-neutral-900" : "text-neutral-900 dark:text-white"
                    )}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      plan.highlighted ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-500"
                    )}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xs mt-2",
                    plan.highlighted ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-500"
                  )}
                >
                  {plan.description}
                </p>
              </div>

              <div className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0",
                        plan.highlighted
                          ? "bg-white/20 dark:bg-neutral-900/20"
                          : "bg-blue-500/10"
                      )}
                    >
                      <Check
                        className={cn(
                          "w-2.5 h-2.5",
                          plan.highlighted ? "text-white dark:text-neutral-900" : "text-blue-500"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-xs",
                        plan.highlighted ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-600 dark:text-neutral-400"
                      )}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to="/dashboard"
                className={cn(
                  "w-full py-2.5 rounded-md text-sm font-medium text-center transition-opacity hover:opacity-90 block",
                  plan.highlighted
                    ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                )}
              >
                {plan.id === "enterprise" ? "Contact Sales" : "Get Started"}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

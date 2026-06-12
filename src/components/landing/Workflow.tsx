import { motion } from "framer-motion";
import { FileText, MessageSquare, GitBranch, Rocket, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

const steps = [
  {
    icon: FileText,
    title: "Plan",
    description: "Create projects, set milestones, and define clear objectives with your team.",
    color: "bg-blue-500",
  },
  {
    icon: MessageSquare,
    title: "Collaborate",
    description: "Discuss ideas, share feedback, and keep everyone aligned in real-time.",
    color: "bg-indigo-500",
  },
  {
    icon: GitBranch,
    title: "Track",
    description: "Monitor progress with intuitive boards and automated status updates.",
    color: "bg-purple-500",
  },
  {
    icon: Rocket,
    title: "Ship",
    description: "Launch with confidence. Celebrate wins and learn from every release.",
    color: "bg-emerald-500",
  },
];

export default function Workflow() {
  return (
    <section id="workflow" className="py-32 bg-neutral-50 dark:bg-neutral-950">
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
            A workflow that just flows.
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            From idea to launch, Orbit keeps your team moving forward without friction.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              <div
                className={cn(
                  "rounded-2xl border p-6 h-full",
                  "bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60"
                )}
              >
                <div className={cn("w-10 h-10 rounded-md flex items-center justify-center mb-4", step.color)}>
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{step.description}</p>
              </div>

              {/* Connector arrow */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-700" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Visual workflow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className={cn(
            "mt-16 rounded-2xl border p-8",
            "bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60"
          )}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">This Week</h4>
              {[
                { title: "Design system tokens", done: true },
                { title: "User research synthesis", done: true },
                { title: "Component library setup", done: false },
              ].map((task) => (
                <div
                  key={task.title}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md border",
                    "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200/60 dark:border-neutral-800/60"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      task.done
                        ? "bg-blue-500 border-blue-500"
                        : "border-neutral-300 dark:border-neutral-600"
                    )}
                  >
                    {task.done && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span
                    className={cn(
                      "text-sm",
                      task.done ? "text-neutral-400 line-through" : "text-neutral-700 dark:text-neutral-300"
                    )}
                  >
                    {task.title}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Team Activity</h4>
              {[
                { user: "Alice", action: "completed", target: "Design tokens", time: "2m ago" },
                { user: "Bob", action: "commented on", target: "API docs", time: "15m ago" },
                { user: "Charlie", action: "started", target: "Performance audit", time: "1h ago" },
              ].map((activity) => (
                <div
                  key={activity.target + activity.time}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md border",
                    "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200/60 dark:border-neutral-800/60"
                  )}
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                    {activity.user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium text-neutral-900 dark:text-white">{activity.user}</span>{" "}
                      {activity.action}{" "}
                      <span className="font-medium text-neutral-900 dark:text-white">{activity.target}</span>
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 flex-shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Progress</h4>
              {[
                { name: "Website Redesign", value: 72, color: "bg-blue-500" },
                { name: "Mobile App", value: 34, color: "bg-indigo-500" },
                { name: "API Integration", value: 56, color: "bg-emerald-500" },
              ].map((item) => (
                <div key={item.name} className="p-3 rounded-md border bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200/60 dark:border-neutral-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{item.name}</span>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={cn("h-full rounded-full", item.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

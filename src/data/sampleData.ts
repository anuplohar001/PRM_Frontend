export const projects = [
  { id: 1, name: "Website Redesign", status: "In Progress", progress: 72, team: ["A", "B", "C"], due: "Mar 15", priority: "High" },
  { id: 2, name: "Mobile App v2.0", status: "Planning", progress: 34, team: ["D", "E"], due: "Apr 2", priority: "High" },
  { id: 3, name: "Brand Guidelines", status: "Completed", progress: 100, team: ["A", "F"], due: "Feb 28", priority: "Medium" },
  { id: 4, name: "API Integration", status: "In Progress", progress: 56, team: ["B", "C", "D", "E"], due: "Mar 22", priority: "High" },
  { id: 5, name: "Q1 Marketing Campaign", status: "Review", progress: 89, team: ["F", "G"], due: "Mar 10", priority: "Medium" },
  { id: 6, name: "Database Migration", status: "Planning", progress: 12, team: ["C", "D"], due: "Apr 15", priority: "Low" },
];

export const tasks = [
  { id: 1, title: "Design system tokens", status: "Done", assignee: "Alice", project: "Website Redesign", priority: "High" },
  { id: 2, title: "User research interviews", status: "In Progress", assignee: "Bob", project: "Mobile App v2.0", priority: "High" },
  { id: 3, title: "Component library setup", status: "Todo", assignee: "Charlie", project: "Website Redesign", priority: "Medium" },
  { id: 4, title: "Performance audit", status: "In Progress", assignee: "Diana", project: "API Integration", priority: "High" },
  { id: 5, title: "Copywriting for landing", status: "Review", assignee: "Eve", project: "Q1 Marketing Campaign", priority: "Medium" },
  { id: 6, title: "Accessibility testing", status: "Todo", assignee: "Frank", project: "Website Redesign", priority: "Low" },
  { id: 7, title: "Analytics dashboard", status: "In Progress", assignee: "Grace", project: "API Integration", priority: "Medium" },
  { id: 8, title: "Social media assets", status: "Done", assignee: "Henry", project: "Q1 Marketing Campaign", priority: "Low" },
];

export const kanbanColumns = [
  { id: "todo", title: "To Do", tasks: tasks.filter((t) => t.status === "Todo") },
  { id: "inprogress", title: "In Progress", tasks: tasks.filter((t) => t.status === "In Progress") },
  { id: "review", title: "Review", tasks: tasks.filter((t) => t.status === "Review") },
  { id: "done", title: "Done", tasks: tasks.filter((t) => t.status === "Done") },
];

export const teamMembers = [
  { id: 1, name: "Alice Chen", role: "Product Designer", avatar: "AC", status: "online", tasks: 12 },
  { id: 2, name: "Bob Martinez", role: "Frontend Engineer", avatar: "BM", status: "online", tasks: 8 },
  { id: 3, name: "Charlie Kim", role: "Backend Engineer", avatar: "CK", status: "away", tasks: 15 },
  { id: 4, name: "Diana Ross", role: "UX Researcher", avatar: "DR", status: "online", tasks: 6 },
  { id: 5, name: "Eve Johnson", role: "Content Strategist", avatar: "EJ", status: "offline", tasks: 9 },
  { id: 6, name: "Frank Lee", role: "DevOps Engineer", avatar: "FL", status: "away", tasks: 11 },
];

export const activities = [
  { id: 1, user: "Alice Chen", action: "completed", target: "Design system tokens", time: "2 min ago" },
  { id: 2, user: "Bob Martinez", action: "commented on", target: "User research interviews", time: "15 min ago" },
  { id: 3, user: "Charlie Kim", action: "moved", target: "Component library setup", time: "1 hour ago" },
  { id: 4, user: "Diana Ross", action: "created", target: "Performance audit", time: "2 hours ago" },
  { id: 5, user: "Eve Johnson", action: "updated", target: "Q1 Marketing Campaign", time: "3 hours ago" },
];

export const analyticsData = [
  { name: "Mon", tasks: 12, completed: 8 },
  { name: "Tue", tasks: 18, completed: 14 },
  { name: "Wed", tasks: 15, completed: 12 },
  { name: "Thu", tasks: 22, completed: 18 },
  { name: "Fri", tasks: 28, completed: 24 },
  { name: "Sat", tasks: 10, completed: 8 },
  { name: "Sun", tasks: 6, completed: 5 },
];

export const calendarEvents = [
  { day: 5, title: "Sprint Planning", time: "10:00 AM", type: "meeting" },
  { day: 8, title: "Design Review", time: "2:00 PM", type: "review" },
  { day: 12, title: "Team Standup", time: "9:30 AM", type: "meeting" },
  { day: 15, title: "Launch Deadline", time: "All Day", type: "deadline" },
  { day: 18, title: "Retrospective", time: "4:00 PM", type: "meeting" },
  { day: 22, title: "Client Presentation", time: "11:00 AM", type: "review" },
];

export const aiSuggestions = [
  { id: 1, text: "3 tasks are blocked — consider reassigning to Charlie", type: "warning" },
  { id: 2, text: "Website Redesign is 2 days ahead of schedule", type: "success" },
  { id: 3, text: "Q1 Marketing Campaign needs copy review by Friday", type: "info" },
];

export const testimonials = [
  { id: 1, name: "Sarah Mitchell", role: "VP of Engineering", company: "Vercel", quote: "Orbit transformed how our team ships products. The clarity and focus it brings is unmatched." },
  { id: 2, name: "James Park", role: "Product Lead", company: "Linear", quote: "The most elegant project management tool I've ever used. It just gets out of your way." },
  { id: 3, name: "Emma Wilson", role: "Design Director", company: "Figma", quote: "Finally, a tool that designers actually want to use. Beautiful, fast, and incredibly intuitive." },
];

export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for individuals and small teams getting started.",
    features: ["Up to 3 projects", "Basic analytics", "5 team members", "Community support", "1GB storage"],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    period: "per user / month",
    description: "For growing teams that need more power and flexibility.",
    features: ["Unlimited projects", "Advanced analytics", "Unlimited team members", "Priority support", "100GB storage", "AI assistant", "Custom integrations"],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For organizations with advanced security and compliance needs.",
    features: ["Everything in Pro", "SSO & SAML", "Dedicated success manager", "Custom contracts", "Unlimited storage", "SLA guarantee", "On-premise option"],
    highlighted: false,
  },
];

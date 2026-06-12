import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
// import { projects } from "../../data/sampleData";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import UserHoverCard from "@/components/UserHoverCard";
import { useState } from "react";
import { User } from "@/services/hooks/types";

const statusColors: Record<string, string> = {
  "In Progress": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Planning: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
  Completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Review: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

const priorityColors: Record<string, string> = {
  High: "text-rose-500",
  Medium: "text-amber-500",
  Low: "text-neutral-400",
};

export default function ProjectTable({ projects }) {

  const navigate = useNavigate()
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [hoveredUser, setHoveredUser] = useState<User | null>()
  return (
    <div className="">

      <div className="border-light">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200/60 dark:border-neutral-800/60">
              {["Name", "Lead", "Due", "Status"].map((h) => (
                <th
                  key={h}
                  className="text-left text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((project, i) => (
              <motion.tr
                key={project.id}
                className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <td className="px-5 py-3.5 w-[600px]">
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">{project.name}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div
                    className="group relative w-fit"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();

                      setPosition({
                        x: rect.left + 40,
                        y: rect.top,
                      });

                      setHoveredUser(project.createdBy)
                    }}
                    onMouseLeave={() => setHoveredUser(null)}
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center text-xs font-semibold uppercase cursor-pointer">
                      {project.createdBy.name.charAt(0)}
                    </div>


                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={cn("text-xs font-medium", priorityColors[project.priority])}>{project.priority}</span>
                </td>

                <td className="px-5 py-3.5">
                  <span className={cn("text-[10px] font-medium px-2 py-1 rounded-full", statusColors[project.status])}>
                    {project.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {hoveredUser && (
        <UserHoverCard
          name={hoveredUser?.name || ""}
          email={hoveredUser?.email}
          role={hoveredUser?.role}
          teams={
            hoveredUser?.teamMemberships?.map(
              (membership) => membership.team
            ) || []
          }
          projects={
            hoveredUser?.projectMemberships?.map(
              (membership) => membership.project
            ) || []
          }
          position={position}
        />
      )}
    </div>
  );
}

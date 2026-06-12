import { motion, AnimatePresence } from "framer-motion";
import { Folder, Plus, Shield, X, } from "lucide-react";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import useTeams, { useAvailableMembersList, useCreateTeam } from "@/services/team.service";
import { useState } from "react";

const accessColors: Record<string, string> = {
  full: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  limited:
    "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
};

export default function TeamsTable() {


  const { teams, loading, refetchTeams } = useTeams();
  const { members = [] } = useAvailableMembersList();
  const org = localStorage.getItem("lastOrganizationId")
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [errors, setErrors] = useState<{ title?: string; members?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const { createTeam, loading: creatingTeam } = useCreateTeam()

  const navigate = useNavigate();



  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setSelectedMembers([]);
    setMemberSearch("");
    setErrors({});
    setSubmitted(false);
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!title.trim()) errs.title = "Team name is required.";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    createTeam(
      {
        name: title,
        organizationId: Number(org),
        createdById: user?.id,
      },
      (data) => {
        refetchTeams()
      },
      (err) => {
        console.error(err.message)
      }
    )
    handleClose();

  };






  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Teams
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage all your projects in one place
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
        >
          <Plus size={16} />
          Add Team
        </button>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200/60 dark:border-neutral-800/60">
              {["Name", "Created By", "Access"].map((h) => (
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
            {teams.map((team) => (
              <motion.tr
                key={team.id}
                className={cn(
                  "border-b border-neutral-100 dark:border-neutral-800/50",
                  "hover:bg-neutral-50 dark:hover:bg-neutral-800/30",
                  "cursor-pointer transition-colors"
                )}
                onClick={() => navigate(`/teams/${team.id}`)}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {team.name}
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        #{team.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {team.createdBy?.name}
                  </div>
                </td>

                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full",
                      team.fullTeamAccess
                        ? accessColors.full
                        : accessColors.limited
                    )}
                  >
                    {team.fullTeamAccess && <Shield className="w-3 h-3" />}
                    {team.fullTeamAccess ? "Full Access" : "Limited"}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Create Team Modal ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          >
            <div className="flex w-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ duration: 0.2 }}
                className="relative flex h-[50vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111]"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900">
                      <Folder size={13} className="text-neutral-400" />
                    </div>
                    <span className="text-sm font-medium text-neutral-200">
                      New Team
                    </span>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-neutral-500 transition hover:text-white"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

                  {/* Team Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      Team Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (errors.title)
                          setErrors((err) => ({ ...err, title: undefined }));
                      }}
                      placeholder="e.g. Design, Engineering…"
                      className={cn(
                        "w-full rounded-md border bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none transition",
                        errors.title
                          ? "border-red-500/60 focus:border-red-500"
                          : "border-neutral-800 focus:border-neutral-600"
                      )}
                    />
                    {errors.title && (
                      <p className="text-[11px] text-red-400">{errors.title}</p>
                    )}
                  </div>

                  {/* Members */}

                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-neutral-800 px-6 py-4">
                  <button
                    onClick={handleClose}
                    className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
                  >
                    Create Team
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
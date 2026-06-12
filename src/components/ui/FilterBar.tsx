import { useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface FilterBarProps {
  searchPlaceholder?: string;
  filters?: string[];
  onSearch?: (q: string) => void;
}

export default function FilterBar({ searchPlaceholder = "Search...", filters = [], onSearch }: FilterBarProps) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (f: string) => {
    setActiveFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-3", "p-3 rounded-md border bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60")}>



    </div>
  );
}

import { useEffect, useRef } from "react";

interface DropdownSelectModalProps<T> {
    open: boolean;
    onClose: () => void;
    search: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
    items: T[];
    selectedIds: number[];
    getId: (item: T) => number;
    getLabel: (item: T) => string;
    getSecondaryLabel?: (item: T) => string;
    onSelect: (id: number) => void;
    emptyMessage?: string;
    footer?: React.ReactNode;
}

const DropdownSelectModal = <T,>({
    open,
    onClose,
    search,
    onSearchChange,
    placeholder = "Search...",
    items,
    selectedIds,
    getId,
    getLabel,
    getSecondaryLabel,
    onSelect,
    emptyMessage = "No data found",
    footer
}: DropdownSelectModalProps<T>) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target as Node
                )
            ) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener(
                "mousedown",
                handleOutsideClick
            );
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute top-10 right-0 w-80 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl p-3 z-50"
        >
            <input
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) =>
                    onSearchChange(e.target.value)
                }
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent outline-none text-sm"
            />

            <div className="mt-3 space-y-1 max-h-60 overflow-y-auto">
                {items.length > 0 ? (
                    items.map((item) => {
                        const id = getId(item);
                        const selected =
                            selectedIds.includes(id);

                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => onSelect(id)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-left"
                            >
                                <div className="mr-2">
                                    <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={() =>
                                            onSelect(id)
                                        }
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between w-full">
                                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                        {getLabel(item)}
                                    </p>

                                    {getSecondaryLabel && (
                                        <p className="text-xs text-neutral-500">
                                            {getSecondaryLabel(
                                                item
                                            )}
                                        </p>
                                    )}
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <div className="text-sm text-neutral-500 text-center py-4">
                        {emptyMessage}
                    </div>
                )}
            </div>

            {footer && (
                <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default DropdownSelectModal;
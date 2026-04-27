import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "react-feather";

type Option = {
    label: string;
    onClick: () => void;
    danger?: boolean;
};

type OptionsMenuProps = {
    options: Option[];
};

const OptionsMenu: React.FC<OptionsMenuProps> = ({ options }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setOpen((prev) => !prev);

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="position-relative d-inline-block" ref={menuRef}>
            {/* Three dot button */}
            <button
                className="btn btn-sm btn-light border-0"
                onClick={toggleMenu}
            >
                <MoreHorizontal
                    size={16}
                    style={{ cursor: "pointer" }}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="dropdown-menu show"
                    style={{
                        position: "absolute",
                        right: 0,
                        zIndex: 9999, // 🔥 high z-index
                        minWidth: "150px",
                    }}
                >
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={`font-size-13 dropdown-item ${option.danger ? "text-danger" : ""
                                }`}
                            onClick={() => {
                                option.onClick();
                                setOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OptionsMenu;
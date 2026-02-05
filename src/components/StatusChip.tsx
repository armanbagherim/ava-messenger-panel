import { Chip } from "@mui/material";
import { useRecordContext } from "react-admin";

interface StatusChipProps {
    source: string;
    trueLabel: string;
    falseLabel: string;
    trueColor?: "success" | "error" | "warning" | "info" | "default";
    falseColor?: "success" | "error" | "warning" | "info" | "default";
}

export const StatusChip = ({
    source,
    trueLabel,
    falseLabel,
    trueColor = "success",
    falseColor = "default"
}: StatusChipProps) => {
    const record = useRecordContext();

    if (!record || record[source] === undefined) {
        return <Chip label={falseLabel} color={falseColor} size="small" />;
    }

    const isActive = Boolean(record[source]);

    const getColorStyles = (color: string, active: boolean) => {
        if (!active) {
            switch (color) {
                case "success":
                    return {
                        backgroundColor: "#f0f9ff",
                        color: "#0369a1",
                        border: "1px solid #bae6fd"
                    };
                case "error":
                    return {
                        backgroundColor: "#fef2f2",
                        color: "#dc2626",
                        border: "1px solid #fecaca"
                    };
                default:
                    return {
                        backgroundColor: "#f8fafc",
                        color: "#64748b",
                        border: "1px solid #e2e8f0"
                    };
            }
        }

        switch (color) {
            case "success":
                return {
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    boxShadow: "0 2px 4px rgba(16, 185, 129, 0.3)"
                };
            case "error":
                return {
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "white",
                    boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)"
                };
            case "warning":
                return {
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "white",
                    boxShadow: "0 2px 4px rgba(245, 158, 11, 0.3)"
                };
            default:
                return {
                    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                    color: "white",
                    boxShadow: "0 2px 4px rgba(99, 102, 241, 0.3)"
                };
        }
    };

    return (
        <Chip
            label={isActive ? trueLabel : falseLabel}
            size="small"
            variant={isActive ? "filled" : "outlined"}
            sx={{
                fontWeight: 400,
                fontSize: '0.625rem',
                height: '20px',
                ...getColorStyles(isActive ? trueColor : falseColor, isActive),
                '&:hover': {
                    transform: 'translateY(-0.5px)',
                    boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)'
                },
                transition: 'all 0.1s ease-in-out',
                '& .MuiChip-label': {
                    padding: '0 6px',
                    lineHeight: 1.2
                }
            }}
        />
    );
};

import { useRecordContext } from "react-admin";
import { Typography } from "@mui/material";

interface PersianDateFieldProps {
    source: string;
    label?: string;
    showTime?: boolean;
}

export const PersianDateField = ({ source, label, showTime = true }: PersianDateFieldProps) => {
    const record = useRecordContext();

    if (!record || !record[source]) {
        return <Typography variant="body2">-</Typography>;
    }

    const date = new Date(record[source]);

    // Format date in Persian (fa-IR) locale
    const dateOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    };

    const persianDate = date.toLocaleDateString("fa-IR", dateOptions);
    const persianTime = showTime ? date.toLocaleTimeString("fa-IR", timeOptions) : "";

    return (
        <Typography variant="body2">
            {showTime ? `${persianDate}، ${persianTime}` : persianDate}
        </Typography>
    );
};

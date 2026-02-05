import { useInput } from "react-admin";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface PersianIsoDatePickerInputProps {
    source: string;
    helperText?: string;
    validate?: any;
    [key: string]: any;
}

const parseIsoToGregorianParts = (value: string): { year: number; month: number; day: number } | null => {
    if (!value) return null;

    const dateOnlyMatch = /^\d{4}-\d{2}-\d{2}$/.exec(value);
    if (dateOnlyMatch) {
        const [year, month, day] = value.split("-").map(Number);
        if (year && month && day) return { year, month, day };
        return null;
    }

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;

    return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
    };
};

const gregorianPartsToIsoUtcMidnight = (parts: { year: number; month: number; day: number }) => {
    return new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).toISOString();
};

export const PersianIsoDatePickerInput = ({ source, helperText, validate, ...datePickerProps }: PersianIsoDatePickerInputProps) => {
    const {
        field,
        fieldState: { error },
        formState: { isSubmitted },
    } = useInput({ source, validate });

    const valueParts = parseIsoToGregorianParts(typeof field.value === "string" ? field.value : "");
    const pickerValue = valueParts
        ? new DateObject({
            year: valueParts.year,
            month: valueParts.month,
            day: valueParts.day,
            calendar: gregorian,
        }).convert(persian)
        : null;

    const handleChange = (date: any) => {
        if (!date) {
            field.onChange("");
            return;
        }

        try {
            const persianDate = date instanceof DateObject ? date : new DateObject(date);
            const g = persianDate.convert(gregorian);
            const iso = gregorianPartsToIsoUtcMidnight({
                year: g.year,
                month: g.month.number,
                day: g.day,
            });
            field.onChange(iso);
        } catch (_e) {
            field.onChange("");
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <DatePicker
                value={pickerValue}
                onChange={handleChange}
                calendar={persian}
                locale={persian_fa}
                format="YYYY-MM-DD"
                inputClass="ra-input"
                containerStyle={{ width: "100%" }}
                style={{
                    width: "100%",
                    height: "56px",
                    padding: "16.5px 14px",
                    fontSize: "16px",
                    border: "1px solid rgba(0, 0, 0, 0.23)",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                    ...(error && isSubmitted
                        ? {
                            borderColor: "#d32f2f",
                        }
                        : {}),
                }}
                placeholder="1404-12-25"
                {...datePickerProps}
            />
            {helperText && (
                <p
                    style={{
                        fontSize: "0.75rem",
                        color: "rgba(0, 0, 0, 0.6)",
                        marginTop: "4px",
                        marginLeft: "0",
                        marginRight: "0",
                    }}
                >
                    {helperText}
                </p>
            )}
            {error && isSubmitted && (
                <p
                    style={{
                        fontSize: "0.75rem",
                        color: "#d32f2f",
                        marginTop: "4px",
                        marginLeft: "0",
                        marginRight: "0",
                    }}
                >
                    {error.message}
                </p>
            )}
        </div>
    );
};

import { useInput } from 'react-admin';
import DatePicker from 'react-multi-date-picker';
import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

interface ShamsiDatePickerInputProps {
    source: string;
    label?: string;
    helperText?: string;
    [key: string]: any;
}

export const ShamsiDatePickerInput = ({
    source,
    label,
    helperText,
    ...datePickerProps
}: ShamsiDatePickerInputProps) => {
    const {
        field,
        fieldState: { error },
        formState: { isSubmitted },
        isRequired,
    } = useInput({ source });

    const handleChange = (date: any) => {
        // Convert to YYYY-MM-DD string for backend
        if (date && typeof date.format === 'function') {
            // Use the year as-is from the picker (already normalized)
            const formatted = date.format('YYYY-MM-DD');
            field.onChange(formatted);
        } else {
            field.onChange('');
        }
    };

    // Parse backend string to date object for the picker
    const parseToDate = (dateString: string) => {
        if (!dateString) return null;
        try {
            // Expecting format: 1402-11-12 or 0783-08-21
            const [year, month, day] = dateString.split('-').map(Number);
            if (year && month && day) {
                // Normalize 4-digit year (e.g., 0783 -> 783)
                const normalizedYear = year < 100 ? year + 1300 : year;
                return new DateObject({
                    year: normalizedYear,
                    month,
                    day,
                    calendar: persian,
                });
            }
        } catch (e) {
            console.error('Invalid date string:', dateString);
        }
        return null;
    };

    const value = parseToDate(field.value || '');

    return (
        <div style={{ width: '100%' }}>
            <DatePicker
                value={value}
                onChange={handleChange}
                calendar={persian}
                locale={persian_fa}
                format="YYYY-MM-DD"
                inputClass="ra-input"
                containerStyle={{ width: '100%' }}
                style={{
                    width: '100%',
                    height: '56px',
                    padding: '16.5px 14px',
                    fontSize: '16px',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    ...(error && isSubmitted
                        ? {
                            borderColor: '#d32f2f',
                        }
                        : {}),
                }}
                placeholder="1404-12-25"
                {...datePickerProps}
            />
            {helperText && (
                <p
                    style={{
                        fontSize: '0.75rem',
                        color: 'rgba(0, 0, 0, 0.6)',
                        marginTop: '4px',
                        marginLeft: '0',
                        marginRight: '0',
                    }}
                >
                    {helperText}
                </p>
            )}
            {error && isSubmitted && (
                <p
                    style={{
                        fontSize: '0.75rem',
                        color: '#d32f2f',
                        marginTop: '4px',
                        marginLeft: '0',
                        marginRight: '0',
                    }}
                >
                    {error.message}
                </p>
            )}
        </div>
    );
};

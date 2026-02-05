import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import {
    List,
    ListProps,
    SimpleForm,
    NumberInput,
    required,
    SaveButton,
    Toolbar,
    useNotify,
    useDataProvider,
    useListContext,
    useRefresh,
} from "react-admin";
import { useState, useEffect } from "react";
import {
    Autocomplete,
    Box,
    Card,
    CardContent,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

const CustomToolbar = (props: any) => (
    <Toolbar {...props}>
        <SaveButton label="ذخیره تنظیمات" alwaysEnable />
    </Toolbar>
);

const commonMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "audio/mpeg",
    "audio/ogg",
    "audio/wav",
    "audio/webm",
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
    "text/plain",
    "text/html",
    "application/json",
    "application/xml",
];

const commonWildcards = ["image/*", "audio/*", "video/*", "text/*", "application/*"];

const normalizeList = (values: readonly string[]) => {
    const normalized = values
        .map(v => v.trim())
        .filter(Boolean);
    return Array.from(new Set(normalized));
};

const isValidMime = (value: string) => {
    if (!value) return false;
    if (value.endsWith("/*")) return false;
    return /^[a-z0-9][a-z0-9.+-]*\/[a-z0-9][a-z0-9.+-]*$/i.test(value);
};

const isValidWildcard = (value: string) => {
    if (!value) return false;
    return /^[a-z0-9][a-z0-9.+-]*\/\*$/i.test(value);
};

type MultiValueInputProps = {
    label: string;
    helperText: string;
    options: string[];
    value: string[];
    onChange: (value: string[]) => void;
    isValid: (value: string) => boolean;
};

const MultiValueInput = ({ label, helperText, options, value, onChange, isValid }: MultiValueInputProps) => {
    const invalid = value.filter(v => !isValid(v));

    return (
        <Autocomplete
            multiple
            freeSolo
            options={options}
            value={value}
            onChange={(_, newValue) => onChange(normalizeList(newValue))}
            renderInput={params => (
                <TextField
                    {...params}
                    label={label}
                    helperText={invalid.length ? `مقادیر نامعتبر: ${invalid.join(", ")}` : helperText}
                    error={invalid.length > 0}
                />
            )}
        />
    );
};

export const UploadPolicyList = (props: ListProps) => {
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const { data, isLoading } = useListContext();

    const currentPolicy = data && data.length > 0 ? (data[0] as any) : null;
    const [allowedMime, setAllowedMime] = useState<string[]>([]);
    const [allowedWildcards, setAllowedWildcards] = useState<string[]>([]);

    useEffect(() => {
        if (!currentPolicy) return;
        setAllowedMime(currentPolicy.allowed_mime || []);
        setAllowedWildcards(currentPolicy.allowed_wildcards || []);
    }, [currentPolicy]);

    if (isLoading) {
        return <div>در حال بارگذاری...</div>;
    }

    const handleSubmit = async (data: any) => {
        try {
            const updatedData = {
                max_size_bytes: data.max_size_bytes,
                max_uploads_per_day: data.max_uploads_per_day,
                allowed_mime: allowedMime,
                allowed_wildcards: allowedWildcards,
            };

            await dataProvider.update("upload_policy_default", {
                id: "default",
                data: updatedData,
                previousData: currentPolicy,
            });

            notify("تنظیمات با موفقیت ذخیره شد!", { type: "success" });
            refresh();
        } catch (error) {
            console.error('Error saving upload policy:', error);
            notify('خطا در ذخیره تنظیمات: ' + (error instanceof Error ? error.message : 'Unknown error'), { type: 'error' });
        }
    };

    return (
        <Card sx={{ m: 2, width: "100%" }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    تنظیمات سیاست آپلود پیش‌فرض
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    این تنظیمات برای همه کاربران به عنوان سیاست پیش‌فرض آپلود فایل اعمال می‌شود.
                </Typography>

                <SimpleForm
                    toolbar={<CustomToolbar />}
                    onSubmit={handleSubmit}
                    defaultValues={{
                        max_size_bytes: currentPolicy?.max_size_bytes ?? 52428800,
                        max_uploads_per_day: currentPolicy?.max_uploads_per_day ?? 100,
                    }}
                    key={currentPolicy ? "loaded" : "empty"}
                >
                    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ width: "100%" }}>
                            <NumberInput
                                source="max_size_bytes"
                                label="حداکثر حجم فایل (بایت)"
                                validate={required()}
                                fullWidth
                                helperText="مثال: 52428800 (50MB)"
                                sx={{ flex: 1, minWidth: 280 }}
                            />

                            <NumberInput
                                source="max_uploads_per_day"
                                label="حداکثر تعداد آپلود در روز"
                                validate={required()}
                                fullWidth
                                helperText="مثال: 100"
                                sx={{ flex: 1, minWidth: 280 }}
                            />
                        </Stack>

                        <MultiValueInput
                            label="فرمت‌های MIME مجاز"
                            helperText="مثال: image/jpeg"
                            options={commonMimeTypes}
                            value={allowedMime}
                            onChange={setAllowedMime}
                            isValid={isValidMime}
                        />

                        <MultiValueInput
                            label="الگوهای مجاز (Wildcard)"
                            helperText="مثال: image/*"
                            options={commonWildcards}
                            value={allowedWildcards}
                            onChange={setAllowedWildcards}
                            isValid={isValidWildcard}
                        />
                    </Box>
                </SimpleForm>
            </CardContent>
        </Card>
    );
};

const uploadPolicyResource = {
    name: "upload_policy_default",
    list: (props: ListProps) => (
        <List {...props} actions={false} pagination={false} perPage={1}>
            <UploadPolicyList {...props} />
        </List>
    ),
    icon: SettingsIcon,
    options: { label: "سیاست آپلود" },
};

export default uploadPolicyResource;

import BroadcastOnPersonalIcon from "@mui/icons-material/BroadcastOnPersonal";
import CakeIcon from "@mui/icons-material/Cake";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";
import {
    Create,
    CreateProps,
    List,
    ListProps,
    SimpleForm,
    TextInput,
    SelectArrayInput,
    SelectInput,
    BooleanInput,
    Datagrid,
    TextField,
    DateField,
    NumberInput,
    FunctionField,
    ResourceProps,
    required,
    useDataProvider,
    useNotify,
    useRedirect,
} from "react-admin";

const choices_user_filter = [
    { id: "all", name: "همه کاربران" },
    { id: "admins", name: "فقط ادمین‌ها" },
];

const choices_msg_type = [
    { id: "m.text", name: "متن" },
    { id: "m.notice", name: "اعلان" },
];

const RoleSysnamesSelectInput = ({ source, ...rest }: any) => {
    const dataProvider = useDataProvider();
    const [loading, setLoading] = useState(true);
    const [choices, setChoices] = useState<Array<{ id: string; name: string }>>([]);

    useEffect(() => {
        let cancelled = false;

        dataProvider
            .getList("roles", {
                pagination: { page: 1, perPage: 100 },
                sort: { field: "priority", order: "ASC" },
                filter: {},
            })
            .then(({ data }: any) => {
                if (cancelled) return;
                const nextChoices = (data || [])
                    .map((role: any) => ({
                        id: role.sysname,
                        name: role.display_name || role.sysname,
                    }))
                    .filter((choice: any) => Boolean(choice?.id));
                setChoices(nextChoices);
                setLoading(false);
            })
            .catch(() => {
                if (cancelled) return;
                setChoices([]);
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [dataProvider]);

    return <SelectArrayInput source={source} choices={choices} disabled={loading} {...rest} />;
};

export const broadcastSend = (props: CreateProps) => {
    const notify = useNotify();
    const redirect = useRedirect();

    const validate = (values: any) => {
        const errors: any = {};

        const userFilter = values?.user_filter;
        const roleSysnames = (values?.role_sysnames || []).filter(Boolean);
        const body = (values?.content?.body || "").trim();

        if (!roleSysnames.length && !userFilter) {
            errors.user_filter = "اجباری";
        }
        if (!body) {
            errors.content = errors.content || {};
            errors.content.body = "اجباری";
        }

        return errors;
    };

    const transform = (data: any) => {
        const roleSysnames = (data?.role_sysnames || []).filter(Boolean);

        const next: any = {
            ...data,
            content: {
                msgtype: data?.content?.msgtype || "m.text",
                body: data?.content?.body,
            },
        };

        if (roleSysnames.length) {
            next.role_sysnames = roleSysnames;
            delete next.user_filter;
        } else {
            delete next.role_sysnames;
        }

        return next;
    };

    const onSuccess = (data: any) => {
        notify("پیام با موفقیت ارسال شد", { type: "success" });
        redirect("/broadcast_logs");
    };

    return (
        <Create
            {...props}
            title="ارسال پیام اضطراری"
            mutationOptions={{ onSuccess }}
            transform={transform}
        >
            <SimpleForm validate={validate}>
                <SelectInput
                    source="user_filter"
                    label="مخاطبان"
                    choices={choices_user_filter}
                    fullWidth
                />
                <RoleSysnamesSelectInput
                    source="role_sysnames"
                    label="نقش (اختیاری)"
                    fullWidth
                />
                <SelectInput
                    source="content.msgtype"
                    label="نوع پیام"
                    choices={choices_msg_type}
                    defaultValue="m.text"
                    fullWidth
                />
                <TextInput
                    source="content.body"
                    label="متن پیام"
                    validate={required()}
                    multiline
                    rows={4}
                    fullWidth
                />
            </SimpleForm>
        </Create>
    );
};

const birthdayTodayFilters = [
    <TextInput
        key="date"
        source="date"
        label="تاریخ (شمسی)"
        helperText="مثال: 1402-11-12"
        alwaysOn
        fullWidth
    />,
];

const birthdayRecipientsFilters = [
    <TextInput
        key="date"
        source="date"
        label="تاریخ (شمسی)"
        helperText="مثال: 1402-11-12"
        alwaysOn
        fullWidth
    />,
    <SelectInput
        key="success_only"
        source="success_only"
        label="فقط پیام‌های موفق"
        choices={[
            { id: "all", name: "همه" },
            { id: "true", name: "موفق" },
            { id: "false", name: "ناموفق" },
        ]}
        alwaysOn
        fullWidth
    />,
];

export const broadcastBirthdayToday = (props: ListProps) => {
    return (
        <List
            {...props}
            title="لیست تولدهای امروز"
            filters={birthdayTodayFilters}
            perPage={50}
        >
            <Datagrid>
                <TextField source="user_id" label="شناسه کاربری" />
                <TextField source="phone_number" label="شماره موبایل" />
                <TextField source="first_name" label="نام" />
                <TextField source="last_name" label="نام خانوادگی" />
                <TextField source="personnel_number" label="شماره پرسنلی" />
                <TextField source="national_code" label="کد ملی" />
                <TextField source="birthdate_shamsi" label="تاریخ تولد شمسی" />
            </Datagrid>
        </List>
    );
};

export const broadcastBirthdayRecipients = (props: ListProps) => {
    return (
        <List
            {...props}
            title="مخاطبان پیام تولد"
            filters={birthdayRecipientsFilters}
            filterDefaultValues={{ success_only: "all" }}
            perPage={50}
        >
            <Datagrid>
                <TextField source="user_id" label="شناسه کاربری" />
                <TextField source="phone_number" label="شماره موبایل" />
                <TextField source="first_name" label="نام" />
                <TextField source="last_name" label="نام خانوادگی" />
                <TextField source="personnel_number" label="شماره پرسنلی" />
                <TextField source="national_code" label="کد ملی" />
                <FunctionField
                    label="وضعیت"
                    render={(record: any) =>
                        record?.success !== undefined
                            ? record.success
                                ? "موفق"
                                : "ناموفق"
                            : record?.status ?? ""
                    }
                />
                <FunctionField
                    label="خطا"
                    render={(record: any) => record?.error ?? record?.error_message ?? ""}
                />
            </Datagrid>
        </List>
    );
};

export const broadcastBirthdayToggle = (props: CreateProps) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const [defaultValues, setDefaultValues] = useState<any>({ enabled: false });
    const [statusDetails, setStatusDetails] = useState<any>(null);

    const onSuccess = (data: any) => {
        notify("تنظیمات تبریک تولد با موفقیت تغییر کرد", { type: "success" });
    };

    useEffect(() => {
        let cancelled = false;

        dataProvider
            .getOne("broadcast_birthday_toggle", { id: "broadcast_birthday_toggle" })
            .then(({ data }: any) => {
                if (cancelled) return;
                setStatusDetails(data);
                const enabled =
                    typeof data?.enabled === "boolean"
                        ? data.enabled
                        : typeof data?.data?.enabled === "boolean"
                            ? data.data.enabled
                            : undefined;
                if (typeof enabled === "boolean") {
                    setDefaultValues({ enabled });
                }
            })
            .catch(() => {
                if (cancelled) return;
            });

        return () => {
            cancelled = true;
        };
    }, [dataProvider]);

    return (
        <Create {...props} title="تنظیمات تبریک تولد خودکار" mutationOptions={{ onSuccess }}>
            <SimpleForm defaultValues={defaultValues} key={String(defaultValues?.enabled)}>
                {statusDetails ? (
                    <div style={{ marginBottom: 12 }}>
                        <div>
                            <strong>آخرین اجرا:</strong>{" "}
                            {statusDetails?.last_run_date ? String(statusDetails.last_run_date) : "-"}
                        </div>
                        <div>
                            <strong>ساعت بررسی:</strong>{" "}
                            {statusDetails?.check_hour !== undefined && statusDetails?.check_hour !== null
                                ? String(statusDetails.check_hour)
                                : "-"}
                        </div>
                    </div>
                ) : null}
                <BooleanInput
                    source="enabled"
                    label="فعال کردن تبریک تولد خودکار"
                />
            </SimpleForm>
        </Create>
    );
};

export const broadcastBirthdayTemplate = (props: CreateProps) => {
    const notify = useNotify();

    const onSuccess = (data: any) => {
        notify("قالب تبریک تولد با موفقیت تغییر کرد", { type: "success" });
    };

    return (
        <Create {...props} title="ویرایش قالب تبریک تولد" mutationOptions={{ onSuccess }}>
            <SimpleForm>
                <TextInput
                    source="template"
                    label="قالب پیام تبریک"
                    defaultValue="🎂 تبریک تولد {name}! سال پر از موفقیت داشته باشید 🎁"
                    multiline
                    rows={3}
                    validate={required()}
                    fullWidth
                />
            </SimpleForm>
        </Create>
    );
};

export const broadcastLogs = (props: ListProps) => {
    return (
        <List {...props} title="لاگ پیام‌های ارسالی">
            <Datagrid>
                <TextField source="log_id" label="شناسه" />
                <TextField source="message_text" label="متن پیام" />
                <TextField source="message_type" label="نوع پیام" />
                <TextField source="sender_user_id" label="ارسال‌کننده" />
                <TextField source="user_filter" label="مخاطبان" />
                <TextField source="role_sysname" label="نقش" />
                <DateField source="sent_at" label="زمان ارسال" />
                <FunctionField
                    label="تولد؟"
                    render={(record: any) => (record?.is_birthday ? "بله" : "خیر")}
                />
                <TextField source="sent_count" label="تعداد ارسال موفق" />
                <TextField source="failed_count" label="تعداد ارسال ناموفق" />
                <TextField source="total_users" label="کل کاربران" />
            </Datagrid>
        </List>
    );
};

export const broadcastStats = (props: CreateProps) => {
    const notify = useNotify();
    const [stats, setStats] = useState<any>(null);

    const onSuccess = (data: any) => {
        notify("آمار با موفقیت دریافت شد", { type: "success" });
        setStats(data);
    };

    return (
        <Create {...props} title="آمار پیام‌ها" mutationOptions={{ onSuccess }}>
            <SimpleForm>
                <p>برای دریافت آمار کلی پیام‌های ارسالی، دکمه ذخیره را بزنید.</p>
                {stats ? (
                    <pre style={{ direction: "ltr", textAlign: "left", whiteSpace: "pre-wrap" }}>
                        {JSON.stringify(stats, null, 2)}
                    </pre>
                ) : null}
            </SimpleForm>
        </Create>
    );
};

const broadcastSendResource: ResourceProps = {
    name: "broadcast_send",
    create: broadcastSend,
    icon: SendIcon,
    options: { label: "ارسال پیام همگانی" },
};

const broadcastBirthdayToggleResource: ResourceProps = {
    name: "broadcast_birthday_toggle",
    create: broadcastBirthdayToggle,
    icon: CakeIcon,
    options: { label: "تبریک تولد (روشن/خاموش)" },
};

const broadcastBirthdayTemplateResource: ResourceProps = {
    name: "broadcast_birthday_template",
    create: broadcastBirthdayTemplate,
    icon: CakeIcon,
    options: { label: "قالب تبریک تولد" },
};

const broadcastLogsResource: ResourceProps = {
    name: "broadcast_logs",
    list: broadcastLogs,
    icon: BroadcastOnPersonalIcon,
    options: { label: "لاگ پیام‌ها" },
};

const broadcastStatsResource: ResourceProps = {
    name: "broadcast_stats",
    create: broadcastStats,
    icon: BroadcastOnPersonalIcon,
    options: { label: "آمار پیام‌ها" },
};

const broadcastBirthdayTodayResource: ResourceProps = {
    name: "broadcast_birthday_today",
    list: broadcastBirthdayToday,
    icon: CakeIcon,
    options: { label: "تولدهای امروز" },
};

const broadcastBirthdayRecipientsResource: ResourceProps = {
    name: "broadcast_birthday_recipients",
    list: broadcastBirthdayRecipients,
    icon: CakeIcon,
    options: { label: "مخاطبان پیام تولد" },
};

export {
    broadcastSendResource,
    broadcastBirthdayToggleResource,
    broadcastBirthdayTemplateResource,
    broadcastLogsResource,
    broadcastStatsResource,
    broadcastBirthdayTodayResource,
    broadcastBirthdayRecipientsResource,
};

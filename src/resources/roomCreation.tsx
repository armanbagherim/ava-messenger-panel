import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CampaignIcon from "@mui/icons-material/Campaign";
import {
    Create,
    CreateProps,
    SimpleForm,
    TextInput,
    SelectInput,
    SelectArrayInput,
    ResourceProps,
    required,
    useTranslate,
    useNotify,
    useRedirect,
    useDataProvider,
} from "react-admin";

import { useEffect, useMemo, useState } from "react";

const choices_preset = [
    { id: "private", name: "خصوصی" },
    { id: "public_chat", name: "عمومی" },
];

const choices_visibility = [
    { id: "public", name: "عمومی" },
    { id: "private", name: "خصوصی" },
];

const InviteSelectInput = ({ source, ...rest }: any) => {
    const dataProvider = useDataProvider();
    const [loading, setLoading] = useState(true);
    const [choices, setChoices] = useState<Array<{ id: string; name: string }>>([]);

    useEffect(() => {
        let cancelled = false;

        dataProvider
            .getList("users", {
                pagination: { page: 1, perPage: 100 },
                sort: { field: "creation_ts_ms", order: "DESC" },
                filter: {},
            })
            .then(({ data }: any) => {
                if (cancelled) return;
                setChoices(
                    (data || []).map((u: any) => ({
                        id: u.id,
                        name: u.displayname || u.id,
                    }))
                );
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

    const safeChoices = useMemo(() => choices.filter((c: any) => c?.id), [choices]);

    return <SelectArrayInput source={source} choices={safeChoices} {...rest} disabled={loading} />;
};

const AdminUserIdsSelectInput = ({ source, ...rest }: any) => {
    const dataProvider = useDataProvider();
    const [loading, setLoading] = useState(true);
    const [choices, setChoices] = useState<Array<{ id: string; name: string }>>([]);

    useEffect(() => {
        let cancelled = false;

        dataProvider
            .getList("users", {
                pagination: { page: 1, perPage: 100 },
                sort: { field: "creation_ts_ms", order: "DESC" },
                filter: {},
            })
            .then(({ data }: any) => {
                if (cancelled) return;
                setChoices(
                    (data || []).map((u: any) => ({
                        id: u.id,
                        name: u.displayname || u.id,
                    }))
                );
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

    const safeChoices = useMemo(() => choices.filter((c: any) => c?.id), [choices]);

    return <SelectArrayInput source={source} choices={safeChoices} {...rest} disabled={loading} />;
};

const RoleIdsSelectInput = ({ source, ...rest }: any) => {
    const dataProvider = useDataProvider();
    const [loading, setLoading] = useState(true);
    const [choices, setChoices] = useState<Array<{ id: number; name: string }>>([]);

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
                setChoices(
                    (data || []).map((r: any) => ({
                        id: r.id,
                        name: r.display_name || r.sysname || String(r.id),
                    }))
                );
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

    const safeChoices = useMemo(() => choices.filter((c: any) => c?.id !== undefined && c?.id !== null), [choices]);

    return <SelectArrayInput source={source} choices={safeChoices} {...rest} disabled={loading} />;
};

export const groupCreate = (props: CreateProps) => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (data: any) => {
        notify("گروه با موفقیت ایجاد شد", { type: "success" });
        redirect("/rooms");
    };

    return (
        <Create {...props} title="ایجاد گروه جدید" mutationOptions={{ onSuccess }}>
            <SimpleForm>
                <TextInput
                    source="name"
                    label="نام گروه"
                    validate={required()}
                    fullWidth
                />
                <TextInput
                    source="topic"
                    label="موضوع گروه"
                    fullWidth
                />
                <SelectInput
                    source="preset"
                    label="نوع گروه"
                    choices={choices_preset}
                    validate={required()}
                    fullWidth
                />
                <RoleIdsSelectInput
                    source="role_ids"
                    label="نقش‌ها"
                    fullWidth
                />
                <AdminUserIdsSelectInput
                    source="admin_user_ids"
                    label="ادمین‌ها"
                    fullWidth
                />
                <InviteSelectInput
                    source="invite"
                    label="دعوت کاربران"
                    fullWidth
                />
            </SimpleForm>
        </Create>
    );
};

export const channelCreate = (props: CreateProps) => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (data: any) => {
        notify("کانال با موفقیت ایجاد شد", { type: "success" });
        redirect("/rooms");
    };

    return (
        <Create {...props} title="ایجاد کانال جدید" mutationOptions={{ onSuccess }}>
            <SimpleForm>
                <TextInput
                    source="name"
                    label="نام کانال"
                    validate={required()}
                    fullWidth
                />
                <TextInput
                    source="topic"
                    label="موضوع کانال"
                    fullWidth
                />
                <SelectInput
                    source="preset"
                    label="نوع کانال"
                    choices={choices_preset}
                    validate={required()}
                    fullWidth
                />
                <SelectInput
                    source="visibility"
                    label="نمایش"
                    choices={choices_visibility}
                    validate={required()}
                    fullWidth
                />
                <RoleIdsSelectInput
                    source="role_ids"
                    label="نقش‌ها"
                    fullWidth
                />
                <AdminUserIdsSelectInput
                    source="admin_user_ids"
                    label="ادمین‌ها"
                    fullWidth
                />
                <InviteSelectInput
                    source="invite"
                    label="دعوت کاربران (اختیاری)"
                    fullWidth
                />
            </SimpleForm>
        </Create>
    );
};

const groupCreationResource: ResourceProps = {
    name: "group_creation",
    create: groupCreate,
    icon: GroupAddIcon,
    options: { label: "ایجاد گروه" },
};

const channelCreationResource: ResourceProps = {
    name: "channel_creation",
    create: channelCreate,
    icon: CampaignIcon,
    options: { label: "ایجاد کانال" },
};

export { groupCreationResource, channelCreationResource };

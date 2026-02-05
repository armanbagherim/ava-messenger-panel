import SearchIcon from "@mui/icons-material/Search";
import ContactsIcon from "@mui/icons-material/Contacts";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
    Create,
    CreateProps,
    Datagrid,
    List,
    ListProps,
    SimpleForm,
    TextField,
    TextInput,
    NumberInput,
    ResourceProps,
    required,
    useTranslate,
    useNotify,
    useRedirect,
    Button,
    TopToolbar,
} from "react-admin";
import { useState } from "react";

const UserSearchActions = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [limit, setLimit] = useState(20);

    return (
        <TopToolbar>
            <TextInput
                source="search_term"
                label="جستجو"
                defaultValue={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <NumberInput
                source="limit"
                label="تعداد نتایج"
                defaultValue={limit}
                onChange={(e) => setLimit(e.target.value)}
            />
        </TopToolbar>
    );
};

export const userSearch = (props: ListProps) => {
    return (
        <List {...props} title="جستجوی کاربران" actions={<UserSearchActions />}>
            <Datagrid>
                <TextField source="user_id" label="شناسه کاربری" />
                <TextField source="display_name" label="نام نمایشی" />
                <TextField source="phone_number" label="شماره موبایل" />
                <TextField source="email" label="ایمیل" />
                <TextField source="role" label="نقش" />
            </Datagrid>
        </List>
    );
};

export const contactAdd = (props: CreateProps) => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (data: any) => {
        notify("مخاطب با موفقیت اضافه شد", { type: "success" });
        redirect("/user_contacts");
    };

    return (
        <Create {...props} title="افزودن مخاطب" mutationOptions={{ onSuccess }}>
            <SimpleForm>
                <TextInput
                    source="contact_user_id"
                    label="شناسه کاربری مخاطب"
                    validate={required()}
                    fullWidth
                    placeholder="مثال: @user:domain.com"
                />
            </SimpleForm>
        </Create>
    );
};

export const contactList = (props: ListProps) => (
    <List {...props} title="مخاطبان">
        <Datagrid>
            <TextField source="contact_user_id" label="شناسه کاربری" />
            <TextField source="display_name" label="نام نمایشی" />
            <TextField source="added_at" label="تاریخ افزودن" />
        </Datagrid>
    </List>
);

const userSearchResource: ResourceProps = {
    name: "user_search",
    list: userSearch,
    icon: SearchIcon,
};

const contactAddResource: ResourceProps = {
    name: "contact_add",
    create: contactAdd,
    icon: PersonAddIcon,
};

const contactListResource: ResourceProps = {
    name: "user_contacts",
    list: contactList,
    icon: ContactsIcon,
};

export { userSearchResource, contactAddResource, contactListResource };

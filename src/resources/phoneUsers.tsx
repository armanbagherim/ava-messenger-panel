import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
    Create,
    CreateProps,
    Datagrid,
    Edit,
    EditProps,
    FunctionField,
    List,
    ListProps,
    SimpleForm,
    TextField,
    TextInput,
    NumberInput,
    ResourceProps,
    required,
} from "react-admin";
import { PersianIsoDatePickerInput } from "../components/PersianIsoDatePickerInput";

const formatPersianIsoDate = (value?: string) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";

    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
    }).format(d);
};

export const phoneUserList = (props: ListProps) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="user_id" label="شناسه کاربری" />
            <TextField source="phone_number" label="شماره موبایل" />
            <TextField source="first_name" label="نام" />
            <TextField source="last_name" label="نام خانوادگی" />
            <TextField source="national_code" label="کد ملی" />
            <TextField source="personnel_number" label="شماره پرسنلی" />
            <TextField source="role_id" label="نقش" />
            <FunctionField
                label="تاریخ تولد"
                render={(record: any) => formatPersianIsoDate(record?.birthdate)}
            />
        </Datagrid>
    </List>
);

export const phoneUserCreate = (props: CreateProps) => (
    <Create {...props} title="افزودن کاربر جدید">
        <SimpleForm>
            <TextInput
                source="phone_number"
                label="شماره موبایل"
                validate={required()}
                fullWidth
            />
            <TextInput
                source="national_code"
                label="کد ملی"
                validate={required()}
                fullWidth
            />
            <TextInput source="first_name" label="نام" validate={required()} fullWidth />
            <TextInput source="last_name" label="نام خانوادگی" validate={required()} fullWidth />
            <NumberInput source="role_id" label="نقش" validate={required()} fullWidth />
            <TextInput source="personnel_number" label="شماره پرسنلی" fullWidth />
            <PersianIsoDatePickerInput
                source="birthdate"
                helperText="تاریخ تولد را انتخاب کنید"
                fullWidth
            />
            <TextInput source="user_id" label="شناسه کاربری" fullWidth />
        </SimpleForm>
    </Create>
);

export const phoneUserEdit = (props: EditProps) => (
    <Edit {...props} title="ویرایش کاربر">
        <SimpleForm>
            <TextInput source="phone_number" label="شماره موبایل" fullWidth disabled />
            <TextInput source="national_code" label="کد ملی" fullWidth disabled />
            <TextInput source="first_name" label="نام" fullWidth />
            <TextInput source="last_name" label="نام خانوادگی" fullWidth />
            <NumberInput source="role_id" label="نقش" fullWidth />
            <TextInput source="personnel_number" label="شماره پرسنلی" fullWidth />
            <PersianIsoDatePickerInput
                source="birthdate"
                helperText="تاریخ تولد را انتخاب کنید"
                fullWidth
            />
            <TextInput source="user_id" label="شناسه کاربری" fullWidth />
        </SimpleForm>
    </Edit>
);

const phoneUsers: ResourceProps = {
    name: "phone_users",
    list: phoneUserList,
    create: phoneUserCreate,
    edit: phoneUserEdit,
    icon: PersonAddIcon,
};

export default phoneUsers;

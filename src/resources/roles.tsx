import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import {
    Create,
    CreateProps,
    Datagrid,
    Edit,
    EditProps,
    List,
    ListProps,
    SimpleForm,
    TextField,
    TextInput,
    NumberInput,
    BooleanInput,
    ResourceProps,
    required,
    useTranslate,
    Button,
    useNotify,
    useRedirect,
    Confirm,
    useDataProvider,
    SelectInput,
    useRecordContext,
} from "react-admin";
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

// کامپوننت DeleteButton سفارشی برای انتخاب نقش جایگزین
const RoleDeleteButton = ({ record }: any) => {
    const [open, setOpen] = useState(false);
    const [replacementRole, setReplacementRole] = useState("");
    const notify = useNotify();
    const redirect = useRedirect();
    const dataProvider = useDataProvider();

    if (!record) {
        return null; // اگر record وجود نداشت، چیزی نمایش نده
    }

    const handleDelete = async () => {
        try {
            await dataProvider.delete('roles', {
                id: record.id,
                previousData: record,
                data: {
                    sysname: record.sysname,
                    replacement_sysname: replacementRole
                }
            } as any);
            notify('نقش با موفقیت حذف شد', { type: 'success' });
            redirect('/roles');
        } catch (error: any) {
            notify(`خطا در حذف نقش: ${error.message}`, { type: 'error' });
        }
        setOpen(false);
    };

    return (
        <>
            <Button label="حذف" onClick={() => setOpen(true)} />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>حذف نقش {record.display_name || 'ناشناس'}</DialogTitle>
                <DialogContent>
                    <p>لطفاً نقش جایگزین را برای کاربران این نقش انتخاب کنید:</p>
                    <SelectInput
                        source="replacement_sysname"
                        choices={[
                            { id: 'staff', name: 'کارمند ارشد' },
                            { id: 'ops', name: 'اپس' },
                            { id: 'qa_role', name: 'کیوای' },
                        ]}
                        value={replacementRole}
                        onChange={(e: any) => setReplacementRole(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button label="انصراف" onClick={() => setOpen(false)} />
                    <Button label="حذف" onClick={handleDelete} color="error" />
                </DialogActions>
            </Dialog>
        </>
    );
};

export const roleList = (props: ListProps) => (
    <List {...props} title="نقش‌ها">
        <Datagrid rowClick="edit">
            <TextField source="role_id" label="شناسه نقش" />
            <TextField source="sysname" label="نام سیستمی" />
            <TextField source="display_name" label="نام نمایشی" />
            <TextField source="priority" label="اولویت" />
            <TextField source="active" label="فعال" />
            <RoleDeleteButton />
        </Datagrid>
    </List>
);

export const roleCreate = (props: CreateProps) => (
    <Create {...props} title="ایجاد نقش جدید">
        <SimpleForm>
            <TextInput
                source="sysname"
                label="نام سیستمی"
                validate={required()}
                fullWidth
            />
            <TextInput
                source="display_name"
                label="نام نمایشی"
                validate={required()}
                fullWidth
            />
            <NumberInput
                source="priority"
                label="اولویت"
                validate={required()}
                fullWidth
            />
            <BooleanInput
                source="active"
                label="فعال"
                defaultValue={true}
            />
        </SimpleForm>
    </Create>
);

export const roleEdit = (props: EditProps) => (
    <Edit {...props} title="ویرایش نقش" mutationMode="optimistic">
        <SimpleForm>
            <TextInput source="role_id" label="شناسه نقش" fullWidth disabled />
            <TextInput source="sysname" label="نام سیستمی" validate={required()} fullWidth />
            <TextInput source="display_name" label="نام نمایشی" validate={required()} fullWidth />
            <NumberInput source="priority" label="اولویت" validate={required()} fullWidth />
            <BooleanInput source="active" label="فعال" />
        </SimpleForm>
    </Edit>
);

const roles: ResourceProps = {
    name: "roles",
    list: roleList,
    create: roleCreate,
    edit: roleEdit,
    icon: AdminPanelSettingsIcon,
    options: { label: "نقش‌ها" },
};

export default roles;

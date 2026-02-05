import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import DevicesIcon from "@mui/icons-material/Devices";
import GetAppIcon from "@mui/icons-material/GetApp";
import UserIcon from "@mui/icons-material/Group";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import ViewListIcon from "@mui/icons-material/ViewList";
import {
  ArrayInput,
  ArrayField,
  Button,
  BooleanField,
  BooleanInput,
  Create,
  CreateProps,
  Datagrid,
  DateField,
  DeleteButton,
  Edit,
  EditButton,
  EditProps,
  FormTab,
  FunctionField,
  GetListParams,
  GetOneParams,
  Identifier,
  List,
  ListProps,
  Pagination,
  RaRecord,
  ReferenceField,
  ReferenceManyField,
  ResourceProps,
  required,
  SaveButton,
  SearchInput,
  SelectArrayInput,
  SelectInput,
  ShowButton,
  SimpleForm,
  SimpleFormIterator,
  TabbedForm,
  TextField,
  TextInput,
  TopToolbar,
  UpdateParams,
  useDataProvider,
  useRecordContext,
  useTranslate,
  FilterLiveSearch,
  FilterList,
  FilterListItem,
  useGetIdentity,
  useGetList,
  useListContext,
  useLogout,
  useNotify,
  useRefresh,
  useUnselect,
  maxLength,
  regex,
  NumberField,
  BulkDeleteButton,
  CreateButton,
} from "react-admin";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import AvatarField from "../components/AvatarField";
import { ServerNoticeButton, ServerNoticeBulkButton } from "../components/ServerNotices";
import { DATE_FORMAT } from "../components/date";
import { DeviceRemoveButton } from "../components/devices";
import { MediaIDField, ProtectMediaButton, QuarantineMediaButton } from "../components/media";
import { PersianDateField } from "../components/PersianDateField";
import { PersianIsoDatePickerInput } from "../components/PersianIsoDatePickerInput";
import { StatusChip } from "../components/StatusChip";
import { Grid } from "@mui/system";
import { Card, CardContent, Typography } from "@mui/material";

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

const choices_medium = [
  { id: "email", name: "resources.users.email" },
  { id: "msisdn", name: "resources.users.msisdn" },
];

const choices_type = [
  { id: "bot", name: "bot" },
  { id: "support", name: "support" },
];

// کامپوننت برای انتخاب نقش‌های داینامیک
const RoleSelectInput = ({ source, ...rest }: any) => {
  const dataProvider = useDataProvider();
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('RoleSelectInput: Fetching roles...');
    dataProvider.getList('roles', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'priority', order: 'ASC' },
      filter: {}
    }).then(({ data }) => {
      console.log('RoleSelectInput: Roles fetched:', data);
      setRoles(data.map((role: any) => ({
        id: role.id,
        name: role.display_name
      })));
      setLoading(false);
    }).catch(error => {
      console.error('RoleSelectInput: Error fetching roles:', error);
      setLoading(false);
    });
  }, [dataProvider]);

  if (loading) {
    return <SelectInput source={source} choices={[]} {...rest} disabled />;
  }

  return <SelectInput source={source} choices={roles} {...rest} />;
};

// کامپوننت برای تاریخ شمسی با validation
const ShamsiDateInput = ({ source, ...rest }: any) => {
  const validateShamsiDate = (value: string) => {
    if (!value) return undefined; // فیلد اختیاری

    // چک کردن فرمت YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return "فرمت تاریخ باید به شکل YYYY-MM-DD باشد (مثال: 1404-12-25)";
    }

    // چک کردن محدوده معتبر برای تاریخ شمسی
    const [year, month, day] = value.split('-').map(Number);

    if (year < 1300 || year > 1500) {
      return "سال باید بین 1300 تا 1500 باشد";
    }

    if (month < 1 || month > 12) {
      return "ماه باید بین 1 تا 12 باشد";
    }

    if (day < 1 || day > 31) {
      return "روز باید بین 1 تا 31 باشد";
    }

    // چک کردن ماه‌های 31 روزه
    if (month > 6 && day > 30) {
      return "این ماه حداکثر 30 روز دارد";
    }

    return undefined;
  };

  return (
    <TextInput
      source={source}
      label="تاریخ تولد شمسی"
      placeholder="1404-12-25"
      validate={validateShamsiDate}
      helperText="فرمت: YYYY-MM-DD (مثال: 1404-12-25)"
      {...rest}
    />
  );
};

const UserListActions = () => {
  const { isLoading, total } = useListContext();
  return (
    <TopToolbar>
      <CreateButton />
      {/* <ExportButton disabled={isLoading || total === 0} maxResults={10000} /> */}
      <Button component={Link} to="/import_users" label="CSV Import">
        <GetAppIcon sx={{ transform: "rotate(180deg)", fontSize: "20px" }} />
      </Button>
    </TopToolbar>
  );
};

const UserPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]} />;

const userFilters = [
  <SearchInput source="name" alwaysOn />,
  <BooleanInput sx={{ direction: "rtl", display: "flex", alignItems: "center", gap: "10px" }} source="guests" alwaysOn />,
  <BooleanInput sx={{ direction: "rtl", display: "flex", alignItems: "center", gap: "10px" }} label="resources.users.fields.show_deactivated" source="deactivated" alwaysOn />,
  <BooleanInput sx={{ direction: "rtl", display: "flex", alignItems: "center", gap: "10px" }} label="resources.users.fields.show_locked" source="locked" alwaysOn />,
];

const UserBulkActionButtons = () => (
  <>
    <ServerNoticeBulkButton />
    <BulkDeleteButton
      label="resources.users.action.erase"
      confirmTitle="resources.users.helper.erase"
      mutationMode="pessimistic"
    />
  </>
);

export const UserList = (props: ListProps) => (
  <List
    {...props}
    filters={userFilters}
    filterDefaultValues={{ guests: true, deactivated: false, locked: false }}
    sort={{ field: "name", order: "ASC" }}
    actions={<UserListActions />}
    pagination={<UserPagination />}
  >
    <Datagrid
      rowClick={(id: Identifier, resource: string) => `/${resource}/${id}`}
      bulkActionButtons={<UserBulkActionButtons />}
    >
      <AvatarField source="avatar_src" sx={{ height: "40px", width: "40px" }} sortBy="avatar_url" label="آواتار" />
      <TextField source="displayname" label="نام نمایشی" sortBy="displayname" />
      <TextField source="phone_number" label="شماره موبایل" />
      <TextField source="national_code" label="کد ملی" />
      <TextField source="role_display_name" label="نقش" />
      <TextField source="personnel_number" label="شماره پرسنلی" />
      <FunctionField label="تاریخ تولد" render={(record: any) => formatPersianIsoDate(record?.birthdate)} />
      <StatusChip source="admin" trueLabel="مدیر" falseLabel="کاربر عادی" trueColor="success" />
      <StatusChip source="deactivated" trueLabel="غیرفعال" falseLabel="فعال" falseColor="success" trueColor="error" />
      <PersianDateField source="creation_ts" label="تاریخ ایجاد" showTime />
      <EditButton />
    </Datagrid>
  </List>
);

// https://matrix.org/docs/spec/appendices#user-identifiers
// here only local part of user_id
// maxLength = 255 - "@" - ":" - storage.getItem("home_server").length
// storage.getItem("home_server").length is not valid here
const validateUser = [required(), maxLength(253), regex(/^[a-z0-9._=\-/]+$/, "synapseadmin.users.invalid_user_id")];

const validateAddress = [required(), maxLength(255)];

const UserEditActions = () => {
  const record = useRecordContext();
  const translate = useTranslate();

  return (
    <TopToolbar>
      {!record?.deactivated && <ServerNoticeButton />}
      <DeleteButton
        label="resources.users.action.erase"
        confirmTitle={translate("resources.users.helper.erase", {
          smart_count: 1,
        })}
        mutationMode="pessimistic"
      />
    </TopToolbar>
  );
};

export const UserCreate = (props: CreateProps) => (
  <Create
    {...props}
    redirect={(resource: string | undefined, id: Identifier | undefined) => {
      if (resource === "users") {
        return "/users";
      }
      return `/${resource}/${id}`;
    }}
    transform={(data: any) => ({
      phone_number: data.phone_number,
      national_code: data.national_code,
      first_name: data.first_name,
      last_name: data.last_name,
      role_id: data.role_id,
      personnel_number: data.personnel_number,
      birthdate: data.birthdate,
      user_id: data.user_id,
    })}
  >
    <SimpleForm>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 4,
              pb: 1,
              fontSize: "14px",
              borderBottom: '2px solid',
              borderColor: 'primary.light',
              display: 'inline-block'
            }}
          >
            اطلاعات کاربری
          </Typography>

          <TextInput source="user_id" label="شناسه کاربری" validate={required()} fullWidth variant="outlined" />
          <TextInput source="first_name" label="نام" validate={required()} fullWidth variant="outlined" />
          <TextInput source="last_name" label="نام خانوادگی" validate={required()} fullWidth variant="outlined" />
          <RoleSelectInput source="role_id" label="نقش" validate={required()} fullWidth variant="outlined" />

        </div>
        <div>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 4,
              pb: 1,
              fontSize: "14px",
              borderBottom: '2px solid',
              borderColor: 'primary.light',
              display: 'inline-block'
            }}
          >
            اطلاعات تماس و پرسنلی
          </Typography>

          <TextInput source="phone_number" label="شماره موبایل" validate={required()} fullWidth variant="outlined" />
          <TextInput source="national_code" label="کد ملی" validate={required()} fullWidth variant="outlined" />
          <TextInput source="personnel_number" label="شماره پرسنلی" fullWidth variant="outlined" />
          <PersianIsoDatePickerInput source="birthdate" validate={required()} helperText="تاریخ تولد را انتخاب کنید" fullWidth />
        </div>
      </div>
    </SimpleForm >
  </Create >
);

const UserTitle = () => {
  const record = useRecordContext();
  const translate = useTranslate();
  return (
    <span>
      {translate("resources.users.name", {
        smart_count: 1,
      })}{" "}
      {record ? `"${record.displayname || record.first_name + ' ' + record.last_name || record.id}"` : ""}
    </span>
  );
};

export const UserEdit = (props: EditProps) => {
  const translate = useTranslate();
  return (
    <Edit {...props} title={<UserTitle />} actions={<UserEditActions />}>
      <TabbedForm>
        <FormTab label={translate("resources.users.name", { smart_count: 1 })} icon={<PersonPinIcon />}>
          <div className="flex justify-end w-full">
            <AvatarField source="avatar_src" sortable={false} sx={{ height: "120px", width: "120px", mb: 2 }} />
          </div>

          <div className="grid grid-cols-2 w-full gap-2">
            <TextInput source="displayname" label="نام نمایشی" fullWidth />
            <TextInput source="first_name" label="نام" fullWidth />
            <TextInput source="last_name" label="نام خانوادگی" fullWidth />
            <RoleSelectInput source="role_id" label="نقش" fullWidth />
            <BooleanInput source="admin" />
            <BooleanInput source="deactivated" helperText="resources.users.helper.deactivate" />
            <DateField source="creation_ts_ms" showTime options={DATE_FORMAT} />
            <Typography variant="h6" gutterBottom>
              اطلاعات هویتی و پرسنلی
            </Typography>

            <TextInput source="phone_number" label="شماره موبایل" fullWidth />
            <TextInput source="national_code" label="کد ملی" fullWidth />
            <TextInput source="personnel_number" label="شماره پرسنلی" fullWidth />
            <PersianIsoDatePickerInput source="birthdate" helperText="تاریخ تولد را انتخاب کنید" fullWidth />
          </div>


        </FormTab>

        <FormTab label={translate("resources.devices.name", { smart_count: 2 })} icon={<DevicesIcon />} path="devices">
          <ReferenceManyField reference="devices" target="user_id" label={false}>
            <Datagrid style={{ width: "100%" }}>
              <TextField source="device_id" sortable={false} />
              <TextField source="display_name" sortable={false} />
              <TextField source="last_seen_ip" sortable={false} />
              <DateField source="last_seen_ts" showTime options={DATE_FORMAT} sortable={false} />
              <DeviceRemoveButton />
            </Datagrid>
          </ReferenceManyField>
        </FormTab>

        <FormTab label={translate("resources.connections.name", { smart_count: 2 })} icon={<SettingsInputComponentIcon />} path="connections">
          <ReferenceField reference="connections" source="id" label={false} link={false}>
            <ArrayField source="devices[].sessions[0].connections" label="resources.connections.name">
              <Datagrid style={{ width: "100%" }} bulkActionButtons={false}>
                <TextField source="ip" sortable={false} />
                <DateField source="last_seen" showTime options={DATE_FORMAT} sortable={false} />
                <TextField source="user_agent" sortable={false} style={{ width: "100%" }} />
              </Datagrid>
            </ArrayField>
          </ReferenceField>
        </FormTab>

        <FormTab
          label={translate("resources.users_media.name", { smart_count: 2 })}
          icon={<PermMediaIcon />}
          path="media"
        >
          <ReferenceManyField
            reference="users_media"
            target="user_id"
            label={false}
            pagination={<UserPagination />}
            perPage={50}
            sort={{ field: "created_ts", order: "DESC" }}
          >
            <Datagrid style={{ width: "100%" }}>
              <MediaIDField source="media_id" />
              <DateField source="created_ts" showTime options={DATE_FORMAT} />
              <DateField source="last_access_ts" showTime options={DATE_FORMAT} />
              <NumberField source="media_length" />
              <TextField source="media_type" />
              <TextField source="upload_name" />
              <TextField source="quarantined_by" />
              <QuarantineMediaButton label="resources.quarantine_media.action.name" />
              <ProtectMediaButton label="resources.users_media.fields.safe_from_quarantine" />
              <DeleteButton mutationMode="pessimistic" redirect={false} />
            </Datagrid>
          </ReferenceManyField>
        </FormTab>

        <FormTab label={translate("resources.rooms.name", { smart_count: 2 })} icon={<ViewListIcon />} path="rooms">
          <ReferenceManyField reference="joined_rooms" target="user_id" label={false}>
            <Datagrid dir="ltr" style={{ width: "100%" }} rowClick={id => "/rooms/" + id + "/show"} bulkActionButtons={false}>
              <TextField source="id" sortable={false} label="resources.rooms.fields.room_id" />
              <ReferenceField
                label="resources.rooms.fields.name"
                source="id"
                reference="rooms"
                sortable={false}
                link=""
              >
                <TextField source="name" sortable={false} />
              </ReferenceField>
              <TextField source="topic" sortable={false} />
              <NumberField source="num_joined_members" sortable={false} />
              <BooleanField source="federatable" sortable={false} />
              <BooleanField source="public" sortable={false} />
              <BooleanField source="encrypted" sortable={false} />
            </Datagrid>
          </ReferenceManyField>
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};

const resource: ResourceProps = {
  name: "users",
  icon: UserIcon,
  list: UserList,
  edit: UserEdit,
  create: UserCreate,
};

export default resource;

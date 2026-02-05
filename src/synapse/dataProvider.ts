import { stringify } from "query-string";
import {
  DataProvider,
  DeleteParams,
  GetOneParams,
  UpdateParams,
  Identifier,
  Options,
  PaginationPayload,
  RaRecord,
  SortPayload,
  fetchUtils
} from "react-admin";
import storage from "../storage";

// Adds the access token to all requests
const jsonClient = (url: string, options: Options = {}) => {
  const token = storage.getItem("access_token");
  console.log("httpClient " + url);
  if (token != null) {
    options.user = {
      authenticated: true,
      token: `Bearer ${token}`,
    };
  }
  return fetchUtils.fetchJson(url, options);
};

const mxcUrlToHttp = (mxcUrl: string) => {
  const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
  const re = /^mxc:\/\/([^/]+)\/(\w+)/;
  const ret = re.exec(mxcUrl);
  console.log("mxcClient " + ret);
  if (ret == null) return null;
  const serverName = ret[1];
  const mediaId = ret[2];
  return `${homeserver}/_matrix/media/r0/thumbnail/${serverName}/${mediaId}?width=24&height=24&method=scale`;
};

interface Room {
  room_id: string;
  name?: string;
  canonical_alias?: string;
  avatar_url?: string;
  joined_members: number;
  joined_local_members: number;
  version: number;
  creator: string;
  encryption?: string;
  federatable: boolean;
  public: boolean;
  join_rules: "public" | "knock" | "invite" | "private";
  guest_access?: "can_join" | "forbidden";
  history_visibility: "invited" | "joined" | "shared" | "world_readable";
  state_events: number;
  room_type?: string;
}

interface RoomState {
  age: number;
  content: {
    alias?: string;
  };
  event_id: string;
  origin_server_ts: number;
  room_id: string;
  sender: string;
  state_key: string;
  type: string;
  user_id: string;
  unsigned: {
    age?: number;
  };
}

interface ForwardExtremity {
  event_id: string;
  state_group: number;
  depth: number;
  received_ts: number;
}

interface EventReport {
  id: number;
  received_ts: number;
  room_id: string;
  name: string;
  event_id: string;
  user_id: string;
  reason?: string;
  score?: number;
  sender: string;
  canonical_alias?: string;
}

interface Threepid {
  medium: string;
  address: string;
  added_at: number;
  validated_at: number;
}

interface ExternalId {
  auth_provider: string;
  external_id: string;
}

interface User {
  name: string;
  displayname?: string;
  threepids: Threepid[];
  avatar_url?: string;
  is_guest: 0 | 1;
  admin: 0 | 1;
  deactivated: 0 | 1;
  erased: boolean;
  shadow_banned: 0 | 1;
  creation_ts: number;
  appservice_id?: string;
  consent_server_notice_sent?: string;
  consent_version?: string;
  consent_ts?: number;
  external_ids: ExternalId[];
  user_type?: string;
  locked: boolean;
}

interface Device {
  device_id: string;
  display_name?: string;
  last_seen_ip?: string;
  last_seen_user_agent?: string;
  last_seen_ts?: number;
  user_id: string;
}

interface Connection {
  ip: string;
  last_seen: number;
  user_agent: string;
}

interface Whois {
  user_id: string;
  devices: Record<
    string,
    {
      sessions: {
        connections: Connection[];
      }[];
    }
  >;
}

interface Pusher {
  app_display_name: string;
  app_id: string;
  data: {
    url?: string;
    format: string;
  };
  url: string;
  format: string;
  device_display_name: string;
  profile_tag: string;
  kind: string;
  lang: string;
  pushkey: string;
}

interface UserMedia {
  created_ts: number;
  last_access_ts?: number;
  media_id: string;
  media_length: number;
  media_type: string;
  quarantined_by?: string;
  safe_from_quarantine: boolean;
  upload_name?: string;
}

interface UserMediaStatistic {
  displayname: string;
  media_count: number;
  media_length: number;
  user_id: string;
}

interface RegistrationToken {
  token: string;
  uses_allowed: number;
  pending: number;
  completed: number;
  expiry_time?: number;
}

interface RaServerNotice {
  id: string;
  body: string;
}

interface Destination {
  destination: string;
  retry_last_ts: number;
  retry_interval: number;
  failure_ts: number;
  last_successful_stream_ordering?: number;
}

interface DestinationRoom {
  room_id: string;
  stream_ordering: number;
}

export interface DeleteMediaParams {
  before_ts: string;
  size_gt: number;
  keep_profiles: boolean;
}

export interface DeleteMediaResult {
  deleted_media: Identifier[];
  total: number;
}

export interface SynapseDataProvider extends DataProvider {
  deleteMedia: (params: DeleteMediaParams) => Promise<DeleteMediaResult>;
}

const resourceMap = {
  users: {
    path: "/_messenger/admin/phone/users",
    map: (u: User) => ({
      ...u,
      id: u.name,
      avatar_src: u.avatar_url ? mxcUrlToHttp(u.avatar_url) : undefined,
      is_guest: !!u.is_guest,
      admin: !!u.admin,
      deactivated: !!u.deactivated,
      // need timestamp in milliseconds
      creation_ts_ms: u.creation_ts * 1000,
    }),
    data: "users",
    total: json => json.total,
    create: (data: RaRecord) => {
      // اگر فیلدهای موبایلی وجود داشته باشد، از API جدید استفاده کن
      if (data.phone_number || data.national_code) {
        const payload = {
          phone_number: (data as any).phone_number,
          national_code: (data as any).national_code,
          first_name: (data as any).first_name,
          last_name: (data as any).last_name,
          role_id: (data as any).role_id,
          personnel_number: (data as any).personnel_number,
          birthdate: (data as any).birthdate,
          user_id: (data as any).user_id,
          displayname: (data as any).displayname,
          admin: (data as any).admin,
          deactivated: (data as any).deactivated,
        };
        return {
          endpoint: "/_messenger/admin/phone/users",
          body: payload,
          method: "POST",
        };
      }
      // در غیر این صورت از API قدیمی استفاده کن
      return {
        endpoint: `/_messenger/admin/phone/users/@${encodeURIComponent(data.id)}:${storage.getItem("home_server")}`,
        body: data,
        method: "PUT",
      };
    },
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/deactivate/${encodeURIComponent(params.id)}`,
      body: { erase: true },
      method: "POST",
    }),
    getOne: (params: GetOneParams) => ({
      endpoint: `/_messenger/admin/phone/users?user_id=${encodeURIComponent(params.id)}`,
      method: "GET",
    }),
    update: (params: UpdateParams) => {
      // فقط فیلدهای مورد نیاز را ارسال کن
      const data = params.data as any;
      const updateData = {
        user_id: data.id || data.user_id,
        displayname: data.displayname,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        national_code: data.national_code,
        personnel_number: data.personnel_number,
        birthdate: data.birthdate,
        role_id: data.role_id,
        admin: data.admin,
        deactivated: data.deactivated,
      };
      delete (updateData as any).id; // حذف id اضافی
      
      return {
        endpoint: "/_messenger/admin/phone/users",
        body: updateData,
        method: "POST",
      };
    },
  },
  phone_users: {
    path: "/_messenger/admin/phone/users",
    map: (u: any) => ({
      ...u,
      id: u?.user_id || u?.name,
    }),
    data: "users",
    total: (json: any) => json?.total ?? json?.users?.length ?? 0,
    create: (data: RaRecord) => {
      const payload = {
        phone_number: (data as any).phone_number,
        national_code: (data as any).national_code,
        first_name: (data as any).first_name,
        last_name: (data as any).last_name,
        role_id: (data as any).role_id,
        personnel_number: (data as any).personnel_number,
        birthdate: (data as any).birthdate,
        user_id: (data as any).user_id,
      };

      return {
        endpoint: "/_messenger/admin/phone/users",
        body: payload,
        method: "POST",
      };
    },
    getOne: (params: GetOneParams) => ({
      endpoint: "/_messenger/admin/phone/users?user_id=" + encodeURIComponent(params.id),
      method: "GET",
    }),
    update: (params: UpdateParams) => {
      const data = params.data as any;
      const payload = {
        user_id: data.id || data.user_id,
        displayname: data.displayname,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        national_code: data.national_code,
        personnel_number: data.personnel_number,
        birthdate: data.birthdate,
        role_id: data.role_id,
        admin: data.admin,
        deactivated: data.deactivated,
      };
      delete (payload as any).id;

      return {
        endpoint: "/_messenger/admin/phone/users",
        body: payload,
        method: "POST",
      };
    },
  },
  rooms: {
    path: "/_synapse/admin/v1/rooms",
    map: (r: Room) => ({
      ...r,
      id: r.room_id,
      alias: r.canonical_alias,
      members: r.joined_members,
      is_encrypted: !!r.encryption,
      federatable: !!r.federatable,
      public: !!r.public,
    }),
    data: "rooms",
    total: json => json.total_rooms,
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v2/rooms/${params.id}`,
      body: { block: false },
    }),
  },
  group_creation: {
    map: (payload: any) => {
      const roomId = payload?.data?.room_id;
      return {
        id: roomId,
        room_id: roomId,
        room_type: payload?.data?.room_type,
        isSuccess: payload?.isSuccess,
      };
    },
    create: (data: RaRecord) => {
      const currentUserId = storage.getItem("user_id");
      const invite = Array.isArray((data as any).invite)
        ? (data as any).invite.filter(Boolean)
        : [];
      const role_ids = Array.isArray((data as any).role_ids)
        ? (data as any).role_ids.filter((x: any) => x !== null && x !== undefined)
        : undefined;
      const admin_user_ids = Array.isArray((data as any).admin_user_ids)
        ? (data as any).admin_user_ids.filter(Boolean)
        : undefined;
      const resolved_admin_user_ids =
        admin_user_ids && admin_user_ids.length > 0
          ? admin_user_ids
          : currentUserId
            ? [currentUserId]
            : undefined;

      const defaultPayload: any = {
        preset: "private",
        visibility: "private",
        invite,
        history_visibility: "shared",
        disable_encryption: true,
        join_rules: "invite",
        guest_access: "forbidden",
        room_version: "11",
        creation_content: { "m.federate": true },
        power_level_content_override: {
          events_default: 0,
          state_default: 50,
          users_default: 0,
          users: currentUserId ? { [currentUserId]: 100 } : {},
        },
        initial_state: [
          {
            type: "m.room.encryption",
            state_key: "",
            content: { algorithm: "m.megolm.v1.aes-sha2" },
          },
        ],
      };

      return {
        endpoint: "/_messenger/client/room/create/group",
        body: {
          ...defaultPayload,
          ...(data as any),
          invite,
          ...(role_ids ? { role_ids } : {}),
          ...(resolved_admin_user_ids ? { admin_user_ids: resolved_admin_user_ids } : {}),
        },
        method: "POST",
      };
    },
  },
  channel_creation: {
    map: (payload: any) => {
      const roomId = payload?.data?.room_id;
      return {
        id: roomId,
        room_id: roomId,
        room_type: payload?.data?.room_type,
        isSuccess: payload?.isSuccess,
      };
    },
    create: (data: RaRecord) => {
      const currentUserId = storage.getItem("user_id");
      const invite = Array.isArray((data as any).invite)
        ? (data as any).invite.filter(Boolean)
        : [];
      const role_ids = Array.isArray((data as any).role_ids)
        ? (data as any).role_ids.filter((x: any) => x !== null && x !== undefined)
        : undefined;
      const admin_user_ids = Array.isArray((data as any).admin_user_ids)
        ? (data as any).admin_user_ids.filter(Boolean)
        : undefined;
      const resolved_admin_user_ids =
        admin_user_ids && admin_user_ids.length > 0
          ? admin_user_ids
          : currentUserId
            ? [currentUserId]
            : undefined;

      const defaultPayload: any = {
        preset: "public_chat",
        visibility: "public",
        invite,
        history_visibility: "world_readable",
        join_rules: "public",
        disable_encryption: true,
        guest_access: "can_join",
        room_version: "11",
        creation_content: { "m.federate": true },
        power_level_content_override: {
          events_default: 0,
          state_default: 50,
          users_default: 0,
          users: currentUserId ? { [currentUserId]: 100 } : {},
        },
        initial_state: [
          {
            type: "m.room.encryption",
            state_key: "",
            content: { algorithm: "m.megolm.v1.aes-sha2" },
          },
        ],
      };

      return {
        endpoint: "/_messenger/client/room/create/channel",
        body: {
          ...defaultPayload,
          ...(data as any),
          invite,
          ...(role_ids ? { role_ids } : {}),
          ...(resolved_admin_user_ids ? { admin_user_ids: resolved_admin_user_ids } : {}),
        },
        method: "POST",
      };
    },
  },
  reports: {
    path: "/_synapse/admin/v1/event_reports",
    map: (er: EventReport) => ({ ...er }),
    data: "event_reports",
    total: json => json.total,
  },
  devices: {
    map: (d: Device) => ({
      ...d,
      id: d.device_id,
    }),
    data: "devices",
    total: json => json.total,
    reference: (id: Identifier) => ({
      endpoint: `/_messenger/admin/phone/users/${encodeURIComponent(id)}/devices`,
    }),
    getOne: (params: GetOneParams) => ({
      endpoint: `/_messenger/admin/phone/users?user_id=${encodeURIComponent(params.id)}`,
      method: "GET",
    }),
    delete: (params: DeleteParams) => ({
      endpoint: `/_messenger/admin/phone/users/${encodeURIComponent(params.previousData.user_id)}/devices/${params.id}`,
    }),
  },
  connections: {
    path: "/_synapse/admin/v1/whois",
    map: (c: Whois) => ({
      ...c,
      id: c.user_id,
    }),
    data: "connections",
  },
  room_members: {
    map: (m: string) => ({
      id: m,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/rooms/${id}/members`,
    }),
    data: "members",
    total: json => json.total,
  },
  room_state: {
    map: (rs: RoomState) => ({
      ...rs,
      id: rs.event_id,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/rooms/${id}/state`,
    }),
    data: "state",
    total: json => json.state.length,
  },
  pushers: {
    map: (p: Pusher) => ({
      ...p,
      id: p.pushkey,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/users/${encodeURIComponent(id)}/pushers`,
    }),
    data: "pushers",
    total: json => json.total,
  },
  joined_rooms: {
    map: (jr: string) => ({
      id: jr,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/users/${encodeURIComponent(id)}/joined_rooms`,
    }),
    data: "joined_rooms",
    total: json => json.total,
  },
  users_media: {
    map: (um: UserMedia) => ({
      ...um,
      id: um.media_id,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/users/${encodeURIComponent(id)}/media`,
    }),
    data: "media",
    total: json => json.total,
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/media/${storage.getItem("home_server")}/${params.id}`,
    }),
  },
  protect_media: {
    map: (pm: UserMedia) => ({ id: pm.media_id }),
    create: (params: UserMedia) => ({
      endpoint: `/_synapse/admin/v1/media/protect/${params.media_id}`,
      method: "POST",
    }),
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/media/unprotect/${params.id}`,
      method: "POST",
    }),
  },
  quarantine_media: {
    map: (qm: UserMedia) => ({ id: qm.media_id }),
    create: (params: UserMedia) => ({
      endpoint: `/_synapse/admin/v1/media/quarantine/${storage.getItem("home_server")}/${params.media_id}`,
      method: "POST",
    }),
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/media/unquarantine/${storage.getItem("home_server")}/${params.id}`,
      method: "POST",
    }),
  },
  servernotices: {
    map: (n: { event_id: string }) => ({ id: n.event_id }),
    create: (data: RaServerNotice) => ({
      endpoint: "/_synapse/admin/v1/send_server_notice",
      body: {
        user_id: data.id,
        content: {
          msgtype: "m.text",
          body: data.body,
        },
      },
      method: "POST",
    }),
  },
  user_media_statistics: {
    path: "/_synapse/admin/v1/statistics/users/media",
    map: (usms: UserMediaStatistic) => ({
      ...usms,
      id: usms.user_id,
    }),
    data: "users",
    total: json => json.total,
  },
  forward_extremities: {
    map: (fe: ForwardExtremity) => ({
      ...fe,
      id: fe.event_id,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/rooms/${id}/forward_extremities`,
    }),
    data: "results",
    total: json => json.count,
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/rooms/${params.id}/forward_extremities`,
    }),
  },
  room_directory: {
    path: "/_matrix/client/r0/publicRooms",
    map: (rd: Room) => ({
      ...rd,
      id: rd.room_id,
      public: !!rd.public,
      guest_access: !!rd.guest_access,
      avatar_src: rd.avatar_url ? mxcUrlToHttp(rd.avatar_url) : undefined,
    }),
    data: "chunk",
    total: json => json.total_room_count_estimate,
    create: (params: RaRecord) => ({
      endpoint: `/_matrix/client/r0/directory/list/room/${params.id}`,
      body: { visibility: "public" },
      method: "PUT",
    }),
    delete: (params: DeleteParams) => ({
      endpoint: `/_matrix/client/r0/directory/list/room/${params.id}`,
      body: { visibility: "private" },
      method: "PUT",
    }),
  },
  destinations: {
    path: "/_synapse/admin/v1/federation/destinations",
    map: (dst: Destination) => ({
      ...dst,
      id: dst.destination,
    }),
    data: "destinations",
    total: json => json.total,
    delete: params => ({
      endpoint: `/_synapse/admin/v1/federation/destinations/${params.id}/reset_connection`,
      method: "POST",
    }),
  },
  destination_rooms: {
    map: (dstroom: DestinationRoom) => ({
      ...dstroom,
      id: dstroom.room_id,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/federation/destinations/${id}/rooms`,
    }),
    data: "rooms",
    total: json => json.total,
  },
  registration_tokens: {
    path: "/_synapse/admin/v1/registration_tokens",
    map: (rt: RegistrationToken) => ({
      ...rt,
      id: rt.token,
    }),
    data: "registration_tokens",
    total: json => json.registration_tokens.length,
    create: (params: RaRecord) => ({
      endpoint: "/_synapse/admin/v1/registration_tokens/new",
      body: params,
      method: "POST",
    }),
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/registration_tokens/${params.id}`,
    }),
  },
  // Upload Policy management
  upload_policy_default: {
    path: "/_messenger/admin/upload/policy/default",
    map: (policy: any) => ({
      ...policy,
      id: 'default',
    }),
    data: "policy",
    total: () => 1,
    getOne: (params: GetOneParams) => ({
      endpoint: "/_messenger/admin/upload/policy/default",
      method: "GET",
    }),
    update: (params: UpdateParams) => ({
      endpoint: "/_messenger/admin/upload/policy/default",
      body: params.data,
      method: "PUT",
    }),
  },
  upload_policy_user: {
    getOne: (params: GetOneParams) => ({
      endpoint: "/_messenger/admin/upload/policy/default",
      method: "GET",
    }),
    update: (params: UpdateParams) => ({
      endpoint: "/_messenger/admin/upload/policy/default",
      body: params.data,
      method: "PUT",
    }),
  },
  roles: {
    path: "/_messenger/admin/roles",
    map: (role: any) => ({
      ...role,
      id: role.role_id,
    }),
    data: "roles",
    total: json => json.roles?.length || json.length,
    create: (data: RaRecord) => ({
      endpoint: "/_messenger/admin/roles",
      body: data,
      method: "POST",
    }),
    update: (params: UpdateParams) => {
      // تبدیل id به role_id قبل از ارسال
      const data = params.data as any;
      const updateData = {
        ...data,
        role_id: data.id || data.role_id,
      };
      delete updateData.id; // حذف id اضافی
      
      return {
        endpoint: `/_messenger/admin/roles/${updateData.role_id}`,
        body: updateData,
        method: "PUT",
      };
    },
    delete: (params: any) => ({
      endpoint: "/_messenger/admin/roles",
      body: params.data || { 
        sysname: params.previousData?.sysname,
        replacement_sysname: "staff"
      },
      method: "DELETE",
    }),
    // برای ویرایش نیازی به getOne نداریم، از داده‌های موجود در لیست استفاده می‌کنیم
  },

  broadcast_send: {
    map: (payload: any) => ({
      ...payload,
      id: payload?.id ?? payload?.log_id ?? payload?.event_id ?? String(Date.now()),
    }),
    create: (data: RaRecord) => ({
      endpoint: "/_messenger/admin/broadcast/send",
      body: data,
      method: "POST",
    }),
  },

  broadcast_birthday_toggle: {
    map: (payload: any) => ({
      ...(payload?.data ?? payload),
      id: "broadcast_birthday_toggle",
    }),
    getOne: (_params: GetOneParams) => ({
      endpoint: "/_messenger/admin/broadcast/birthday/status",
      method: "GET",
    }),
    create: (data: RaRecord) => ({
      endpoint: "/_messenger/admin/broadcast/birthday/toggle",
      body: data,
      method: "POST",
    }),
  },

  broadcast_birthday_template: {
    map: (payload: any) => ({
      ...payload,
      id: "broadcast_birthday_template",
    }),
    create: (data: RaRecord) => ({
      endpoint: "/_messenger/admin/broadcast/birthday/template",
      body: data,
      method: "POST",
    }),
  },

  broadcast_birthday_today: {
    path: "/_messenger/admin/broadcast/birthday/today",
    map: (user: any) => ({
      ...user,
      id:
        user?.user_id ||
        user?.phone_number ||
        user?.national_code ||
        user?.personnel_number,
    }),
    data: "users",
    total: (json: any) => json?.data?.users?.length ?? json?.users?.length ?? json?.data?.length ?? 0,
  },

  broadcast_birthday_recipients: {
    path: "/_messenger/admin/broadcast/birthday/recipients",
    map: (recipient: any) => ({
      ...recipient,
      id:
        recipient?.id ||
        recipient?.user_id ||
        recipient?.phone_number ||
        recipient?.national_code ||
        recipient?.personnel_number,
    }),
    data: "recipients",
    total: (json: any) =>
      json?.recipients?.length ?? json?.data?.recipients?.length ?? json?.data?.length ?? 0,
  },

  broadcast_logs: {
    map: (log: any) => ({
      ...log,
      id: log?.id ?? log?.log_id ?? log?.event_id ?? String(Date.now()),
    }),
    data: "logs",
    total: (json: any) => json?.total ?? json?.count ?? json?.logs?.length ?? 0,
  },

  broadcast_stats: {
    map: (payload: any) => ({
      ...payload,
      id: "broadcast_stats",
    }),
    create: (_data: RaRecord) => ({
      endpoint: "/_messenger/admin/broadcast/stats",
      body: {},
      method: "POST",
    }),
  },
};

/* eslint-disable  @typescript-eslint/no-explicit-any */
function filterNullValues(key: string, value: any) {
  // Filtering out null properties
  // to reset user_type from user, it must be null
  if (value === null && key !== "user_type") {
    return undefined;
  }
  return value;
}

function getSearchOrder(order: "ASC" | "DESC") {
  if (order === "DESC") {
    return "b";
  } else {
    return "f";
  }
}

const dataProvider: SynapseDataProvider = {
  getList: async (resource, params) => {
    console.log("getList " + resource);
    const filter = (params as any)?.filter ?? {};
    const pagination = ((params as any)?.pagination ?? { page: 1, perPage: 25 }) as PaginationPayload;
    const sort = ((params as any)?.sort ?? { field: "id", order: "ASC" }) as SortPayload;

    const { user_id, name, guests, deactivated, locked, search_term, destination, valid } = filter;
    const { page, perPage } = pagination;
    const { field, order } = sort;
    const from = (page - 1) * perPage;
    
    // برای users از پارامترهای جدید استفاده کن
    if (resource === 'users') {
      const query: any = {
        limit: perPage,
        offset: from,
      };
      
      // اضافه کردن سرچ اگر وجود داشته باشد
      if (search_term) {
        query.search = search_term;
      }
      
      // اضافه کردن مرتب‌سازی اگر وجود داشته باشد
      if (field) {
        query.sort_by = field;
        query.order = order.toLowerCase();
      }
      
      const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
    if (!homeserver) throw Error("Homeserver not set");
      
      const { json } = await jsonClient(`${homeserver}/_messenger/admin/phone/users?${stringify(query)}`);
      
      return {
        data: json.users.map(resourceMap.users.map),
        total: json.total,
      };
    }

    if (resource === "broadcast_logs") {
      const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
      if (!homeserver) throw Error("Homeserver not set");

      const body = {
        limit: perPage,
        offset: from,
      };

      const { json } = await jsonClient(`${homeserver}/_messenger/admin/broadcast/logs`, {
        method: "POST",
        body: JSON.stringify(body, filterNullValues),
      });

      const logs = Array.isArray(json?.data?.logs)
        ? json.data.logs
        : Array.isArray(json?.logs)
          ? json.logs
          : Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json)
              ? json
              : [];

      const total =
        json?.data?.total ??
        json?.total ??
        json?.count ??
        json?.data?.count ??
        logs.length;

      return {
        data: logs.map(resourceMap.broadcast_logs.map),
        total,
      };
    }

    if (resource === "broadcast_birthday_today") {
      const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
      if (!homeserver) throw Error("Homeserver not set");

      const date = typeof params.filter?.date === "string" ? params.filter.date.trim() : undefined;
      const body = {
        ...(date ? { date } : {}),
      };

      const { json } = await jsonClient(`${homeserver}/_messenger/admin/broadcast/birthday/today`, {
        method: "POST",
        body: JSON.stringify(body, filterNullValues),
      });

      const users = Array.isArray(json?.data?.users)
        ? json.data.users
        : Array.isArray(json?.users)
          ? json.users
          : Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json)
              ? json
              : [];

      const mapped = users.map((user: any, index: number) => {
        const mappedUser = resourceMap.broadcast_birthday_today.map(user);
        return {
          ...mappedUser,
          id: mappedUser?.id ?? `birthday-${index + 1}`,
        };
      });

      return {
        data: mapped,
        total: mapped.length,
      };
    }

    if (resource === "broadcast_birthday_recipients") {
      const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
      if (!homeserver) throw Error("Homeserver not set");

      const date = typeof params.filter?.date === "string" ? params.filter.date.trim() : undefined;
      const successOnlyRaw =
        typeof params.filter?.success_only === "string" ? params.filter.success_only.trim() : undefined;

      const success_only =
        successOnlyRaw === "true" ? true : successOnlyRaw === "false" ? false : undefined;

      const body = {
        ...(date ? { date } : {}),
        ...(success_only !== undefined ? { success_only } : {}),
      };

      const { json } = await jsonClient(`${homeserver}/_messenger/admin/broadcast/birthday/recipients`, {
        method: "POST",
        body: JSON.stringify(body, filterNullValues),
      });

      const recipients = Array.isArray(json?.recipients)
        ? json.recipients
        : Array.isArray(json?.data?.recipients)
          ? json.data.recipients
          : Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json)
              ? json
              : [];

      const mapped = recipients.map((recipient: any, index: number) => {
        const mappedRecipient = resourceMap.broadcast_birthday_recipients.map(recipient);
        return {
          ...mappedRecipient,
          id: mappedRecipient?.id ?? `birthday-recipient-${index + 1}`,
        };
      });

      return {
        data: mapped,
        total: mapped.length,
      };
    }
    
    // برای بقیه resourceها از منطق قبلی استفاده کن
    const query = {
      from: from,
      limit: perPage,
      user_id: user_id,
      search_term: search_term,
      name: name,
      destination: destination,
      guests: guests,
      deactivated: deactivated,
      locked: locked,
      valid: valid,
      order_by: field,
      dir: getSearchOrder(order),
    };
    const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];

    const endpoint_url = homeserver + res.path;
    const url = `${endpoint_url}?${stringify(query)}`;

    const { json } = await jsonClient(url);
    
    // برای upload_policy_default، داده‌ها در json.policy هستند نه آرایه
    if (resource === 'upload_policy_default') {
      return {
        data: json[res.data] ? [res.map(json[res.data])] : [],
        total: 1,
      };
    }
    
    return {
      data: json[res.data].map(res.map),
      total: res.total(json, from, perPage),
    };
  },

  getOne: async (resource, params) => {
    console.log("getOne " + resource);
    
    // برای users، از endpoint جدید get by user_id استفاده کن
    if (resource === 'users') {
      const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
    if (!homeserver) throw Error("Homeserver not set");
      
      // درخواست کاربر مورد نظر بر اساس user_id
      const { json } = await jsonClient(`${homeserver}/_messenger/admin/phone/users?user_id=${encodeURIComponent(params.id)}`);
      
      // برای get by user_id، response مستقیم کاربر است (نه آرایه)
      if (!json || json.total !== undefined) {
        // این response لیست است، کاربر مورد نظر را پیدا کن
        if (json.users && json.users.length > 0) {
          const userMap = resourceMap.users.map;
          const mappedUser = userMap(json.users[0]);
          return { data: mappedUser };
        }
        throw new Error(`User with id ${params.id} not found`);
      } else {
        // این response مستقیم کاربر است
        const userMap = resourceMap.users.map;
        const mappedUser = userMap(json);
        return { data: mappedUser };
      }
    }
    
    // برای roles، از endpoint جدید get by id استفاده کن
    if (resource === 'roles') {
      const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
    if (!homeserver) throw Error("Homeserver not set");
      
      // درخواست نقش مورد نظر بر اساس id
      const { json } = await jsonClient(`${homeserver}/_messenger/admin/roles/${params.id}`);
      
      if (!json.role) {
        throw new Error(`Role with id ${params.id} not found`);
      }
      
      // mapping با همان منطق resourceMap
      const mappedRole = {
        ...json.role,
        id: json.role.role_id,
      };
      
      return { data: mappedRole };
    }
    
    const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];
    
    // اگر getOne سفارشی در resourceMap تعریف شده باشد، از آن استفاده کن
    if (res.getOne) {
      const { endpoint, method } = res.getOne(params);
      const { json } = await jsonClient(`${homeserver}${endpoint}`, { method });
      const payload =
        "data" in res && typeof res.data === "string" && json && json[res.data] !== undefined
          ? json[res.data]
          : json;
      return { data: res.map(payload) };
    }
    
    // در غیر این صورت از رفتار پیش‌فرض استفاده کن
    const endpoint_url = homeserver + res.path;
    const { json } = await jsonClient(`${endpoint_url}/${encodeURIComponent(params.id)}`);
    return { data: res.map(json) };
  },

  getMany: async (resource, params) => {
    console.log("getMany " + resource);
    const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
    if (!homeserver || !(resource in resourceMap)) throw Error("Homerserver not set");

    const res = resourceMap[resource];

    const endpoint_url = homeserver + res.path;
    const responses = await Promise.all(params.ids.map(id => jsonClient(`${endpoint_url}/${encodeURIComponent(id)}`)));
    return {
      data: responses.map(({ json }) => res.map(json)),
      total: responses.length,
    };
  },

  getManyReference: async (resource, params) => {
    console.log("getManyReference " + resource);
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const from = (page - 1) * perPage;
    const query = {
      from: from,
      limit: perPage,
      order_by: field,
      dir: getSearchOrder(order),
    };

    const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];

    const ref = res.reference(params.id);
    const endpoint_url = `${homeserver}${ref.endpoint}?${stringify(query)}`;

    const { json } = await jsonClient(endpoint_url);
    return {
      data: json[res.data].map(res.map),
      total: res.total(json, from, perPage),
    };
  },

  update: async (resource, params) => {
    console.log("update " + resource);
    const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];

    if (res.update) {
      const upd = res.update(params);
      const { json } = await jsonClient(`${homeserver}${upd.endpoint}`, {
        method: upd.method,
        body: JSON.stringify(upd.body, filterNullValues),
      });

      const payload =
        "data" in res && typeof res.data === "string" && json && json[res.data] !== undefined
          ? json[res.data]
          : json;
      return { data: res.map(payload) };
    }

    const endpoint_url = homeserver + res.path;
    const { json } = await jsonClient(`${endpoint_url}/${encodeURIComponent(params.id)}`, {
      method: "PUT",
      body: JSON.stringify(params.data, filterNullValues),
    });
    return { data: res.map(json) };
  },

  updateMany: async (resource, params) => {
    console.log("updateMany " + resource);
    const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];

    const endpoint_url = homeserver + res.path;
    const responses = await Promise.all(
      params.ids.map(id => jsonClient(`${endpoint_url}/${encodeURIComponent(id)}`), {
        method: "PUT",
        body: JSON.stringify(params.data, filterNullValues),
      })
    );
    return { data: responses.map(({ json }) => json) };
  },

  create: async (resource, params) => {
    console.log("create " + resource);
    const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];
    if (!("create" in res)) return Promise.reject();

    const create = res.create(params.data);
    const endpoint_url = homeserver + create.endpoint;
    const { json } = await jsonClient(endpoint_url, {
      method: create.method,
      body: JSON.stringify(create.body, filterNullValues),
    });
    
    // برای roles، response متفاوتی داریم که باید mapping شود
    if (resource === 'roles' && json.role) {
      return { data: res.map(json.role) };
    }
    
    return { data: res.map(json) };
  },

  createMany: async (resource: string, params: { ids: Identifier[]; data: RaRecord }) => {
    console.log("createMany " + resource);
    const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];
    if (!("create" in res)) throw Error(`Create ${resource} is not allowed`);

    const responses = await Promise.all(
      params.ids.map(id => {
        params.data.id = id;
        const cre = res.create(params.data);
        const endpoint_url = homeserver + cre.endpoint;
        return jsonClient(endpoint_url, {
          method: cre.method,
          body: JSON.stringify(cre.body, filterNullValues),
        });
      })
    );
    return { data: responses.map(({ json }) => json) };
  },

  delete: async (resource, params) => {
    console.log("delete " + resource);
    const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];

    if ("delete" in res) {
      const del = res.delete(params);
      const endpoint_url = homeserver + del.endpoint;
      const { json } = await jsonClient(endpoint_url, {
        method: "method" in del ? del.method : "DELETE",
        body: "body" in del ? JSON.stringify(del.body) : null,
      });
      return { data: json };
    } else {
      const endpoint_url = homeserver + res.path;
      const { json } = await jsonClient(`${endpoint_url}/${params.id}`, {
        method: "DELETE",
        body: JSON.stringify(params.previousData, filterNullValues),
      });
      return { data: json };
    }
  },

  deleteMany: async (resource, params) => {
    console.log("deleteMany " + resource);
    const homeserver = storage.getItem("base_url") || "http://192.168.179.41:8008";
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];

    if ("delete" in res) {
      const responses = await Promise.all(
        params.ids.map(id => {
          const del = res.delete({ ...params, id: id });
          const endpoint_url = homeserver + del.endpoint;
          return jsonClient(endpoint_url, {
            method: "method" in del ? del.method : "DELETE",
            body: "body" in del ? JSON.stringify(del.body) : null,
          });
        })
      );
      return {
        data: responses.map(({ json }) => json),
      };
    } else {
      const endpoint_url = homeserver + res.path;
      const responses = await Promise.all(
        params.ids.map(id =>
          jsonClient(`${endpoint_url}/${id}`, {
            method: "DELETE",
            // body: JSON.stringify(params.data, filterNullValues),  @FIXME
          })
        )
      );
      return { data: responses.map(({ json }) => json) };
    }
  },

  // Custom methods (https://marmelab.com/react-admin/DataProviders.html#adding-custom-methods)

  /**
   * Delete media by date or size
   *
   * @link https://matrix-org.github.io/synapse/latest/admin_api/media_admin_api.html#delete-local-media-by-date-or-size
   *
   * @param before_ts Unix timestamp in milliseconds. Files that were last used before this timestamp will be deleted. It is the timestamp of last access, not the timestamp when the file was created.
   * @param size_gt   Size of the media in bytes. Files that are larger will be deleted.
   * @param keep_profiles Switch to also delete files that are still used in image data (e.g user profile, room avatar). If false these files will be deleted.
   * @returns
   */
  deleteMedia: async ({ before_ts, size_gt = 0, keep_profiles = true }) => {
    const homeserver = storage.getItem("home_server"); // TODO only required for synapse < 1.78.0
    const endpoint = `/_synapse/admin/v1/media/${homeserver}/delete?before_ts=${before_ts}&size_gt=${size_gt}&keep_profiles=${keep_profiles}`;

    const base_url = storage.getItem("base_url") || "http://192.168.179.41:8008";
    const endpoint_url = base_url + endpoint;
    const { json } = await jsonClient(endpoint_url, { method: "POST" });
    return json as DeleteMediaResult;
  },
};

export default dataProvider;

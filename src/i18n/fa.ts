import farsiMessages from "ra-language-farsi";

import { SynapseTranslationMessages } from ".";

const fa: SynapseTranslationMessages = {
  ...farsiMessages,
  synapseadmin: {
    auth: {
      base_url: "آدرس هوم‌سرور",
      welcome: "به پنل مدیریت خوش آمدید",
      server_version: "نسخه سیناپس",
      supports_specs: "پشتیبانی از مشخصات ماتریکس",
      username_error: "لطفاً شناسه کاربری کامل را وارد کنید: '@user:domain'",
      protocol_error: "آدرس باید با 'http://' یا 'https://' شروع شود",
      url_error: "آدرس معتبر سرور ماتریکس نیست",
      sso_sign_in: "ورود با SSO",
    },
    users: {
      invalid_user_id: "بخش محلی شناسه کاربری ماتریکس بدون هوم‌سرور.",
      tabs: { sso: "SSO" },
    },
    rooms: {
      details: "جزئیات اتاق",
      tabs: {
        basic: "پایه",
        members: "اعضا",
        detail: "جزئیات",
        permission: "مجوزها",
      },
    },
    reports: { tabs: { basic: "پایه", detail: "جزئیات" } },
  },
  import_users: {
    error: {
      at_entry: "در ورودی %{entry}: %{message}",
      error: "خطا",
      required_field: "فیلد ضروری '%{field}' وجود ندارد",
      invalid_value: "مقدار نامعتبر در خط %{row}. فیلد '%{field}' فقط می‌تواند 'true' یا 'false' باشد",
      unreasonably_big: "از بارگذاری فایل بسیار بزرگ %{size} مگابایتی خودداری شد",
      already_in_progress: "یک فرآیند وارد کردن در حال انجام است",
      id_exits: "شناسه %{id} از قبل وجود دارد",
    },
    title: "وارد کردن کاربران از فایل CSV",
    goToPdf: "رفتن به PDF",
    cards: {
      importstats: {
        header: "وارد کردن کاربران",
        users_total: "%{smart_count} کاربر در فایل CSV |||| %{smart_count} کاربر در فایل CSV",
        guest_count: "%{smart_count} مهمان |||| %{smart_count} مهمان",
        admin_count: "%{smart_count} مدیر |||| %{smart_count} مدیر",
      },
      conflicts: {
        header: "استراتژی برخورد",
        mode: {
          stop: "توقف در صورت برخورد",
          skip: "نمایش خطا و رد کردن در صورت برخورد",
        },
      },
      ids: {
        header: "شناسه‌ها",
        all_ids_present: "شناسه در همه ورودی‌ها وجود دارد",
        count_ids_present: "%{smart_count} ورودی با شناسه |||| %{smart_count} ورودی با شناسه",
        mode: {
          ignore: "نادیده گرفتن شناسه‌های CSV و ایجاد شناسه‌های جدید",
          update: "به‌روزرسانی رکوردهای موجود",
        },
      },
      passwords: {
        header: "رمزهای عبور",
        all_passwords_present: "رمز عبور در همه ورودی‌ها وجود دارد",
        count_passwords_present: "%{smart_count} ورودی با رمز عبور |||| %{smart_count} ورودی با رمز عبور",
        use_passwords: "استفاده از رمزهای عبور موجود در CSV",
      },
      upload: {
        header: "فایل CSV ورودی",
        explanation:
          "در اینجا می‌توانید فایلی با مقادیر جدا شده با کاما آپلود کنید که برای ایجاد یا به‌روزرسانی کاربران پردازش می‌شود. فایل باید شامل فیلدهای 'id' و 'displayname' باشد. می‌توانید یک فایل نمونه را از اینجا دانلود و ویرایش کنید: ",
      },
      startImport: {
        simulate_only: "فقط شبیه‌سازی",
        run_import: "شروع وارد کردن",
      },
      results: {
        header: "نتایج وارد کردن",
        total: "در مجموع %{smart_count} ورودی |||| در مجموع %{smart_count} ورودی",
        successful: "%{smart_count} ورودی با موفقیت وارد شد",
        skipped: "%{smart_count} ورودی رد شد",
        download_skipped: "دانلود رکوردهای رد شده",
        with_error: "%{smart_count} ورودی با خطا |||| %{smart_count} ورودی با خطا",
        simulated_only: "فرآیند فقط شبیه‌سازی شد",
      },
    },
  },
  delete_media: {
    name: "رسانه",
    fields: {
      before_ts: "آخرین دسترسی قبل از",
      size_gt: "بزرگ‌تر از (به بایت)",
      keep_profiles: "نگه داشتن تصاویر پروفایل",
    },
    action: {
      send: "حذف رسانه",
      send_success: "درخواست با موفقیت ارسال شد.",
      send_failure: "خطایی رخ داد.",
    },
    helper: {
      send: "این API رسانه‌های محلی را از دیسک سرور شما حذف می‌کند. این شامل تمام تصاویر بندانگشتی محلی و کپی‌های رسانه دانلود شده است. این API بر رسانه‌هایی که به مخازن خارجی آپلود شده‌اند تأثیر نمی‌گذارد.",
    },
  },
  resources: {
    users: {
      name: "کاربر |||| کاربران",
      email: "ایمیل",
      msisdn: "تلفن",
      threepid: "ایمیل / تلفن",
      fields: {
        avatar: "آواتار",
        id: "شناسه کاربر",
        name: "نام",
        is_guest: "مهمان",
        admin: "مدیر سرور",
        locked: "قفل شده",
        deactivated: "غیرفعال شده",
        erased: "پاک شده (GDPR)",
        guests: "نمایش مهمان‌ها",
        show_deactivated: "نمایش کاربران غیرفعال",
        show_locked: "نمایش کاربران قفل شده",
        user_id: "جستجوی کاربر",
        displayname: "نام نمایشی",
        password: "رمز عبور",
        avatar_url: "آدرس آواتار",
        avatar_src: "آواتار",
        medium: "رسانه",
        threepids: "شناسه‌های سوم شخص",
        address: "آدرس",
        creation_ts_ms: "زمان ایجاد",
        consent_version: "نسخه رضایت",
        auth_provider: "ارائه‌دهنده احراز هویت",
        user_type: "نوع کاربر",
      },
      helper: {
        password: "تغییر رمز عبور، کاربر را از تمام جلسه‌ها خارج می‌کند.",
        deactivate: "برای فعال‌سازی مجدد حساب، باید رمز عبور وارد کنید.",
        erase: "کاربر را به عنوان پاک‌شده طبق GDPR علامت‌گذاری کنید",
      },
      action: {
        erase: "پاک کردن داده‌های کاربر",
      },
    },
    rooms: {
      name: "اتاق |||| اتاق‌ها",
      fields: {
        room_id: "شناسه اتاق",
        name: "نام",
        canonical_alias: "نام مستعار",
        joined_members: "اعضا",
        joined_local_members: "اعضای محلی",
        joined_local_devices: "دستگاه‌های محلی",
        state_events: "رویدادهای حالت / پیچیدگی",
        version: "نسخه",
        is_encrypted: "رمزنگاری شده",
        encryption: "رمزنگاری",
        federatable: "قابل فدراسیون",
        public: "قابل مشاهده در فهرست اتاق‌ها",
        creator: "سازنده",
        join_rules: "قوانین پیوستن",
        guest_access: "دسترسی مهمان",
        history_visibility: "قابلیت مشاهده تاریخچه",
        topic: "موضوع",
        avatar: "آواتار",
      },
      helper: {
        forward_extremities:
          "انتهای جلو (forward extremities) رویدادهای برگ در انتهای گراف جهت‌دار بدون چرخه (DAG) در یک اتاق هستند، یعنی رویدادهایی که فرزندی ندارند. هرچه تعداد بیشتری در یک اتاق وجود داشته باشد، سیناپس باید عملیات حل حالت بیشتری انجام دهد (نکته: عملیات گران‌قیمتی است). سیناپس کدهایی برای جلوگیری از ایجاد بیش از حد این موارد دارد، اما گاهی باگ‌ها باعث ایجاد مجدد آن‌ها می‌شوند. اگر اتاقی بیش از ۱۰ انتهای جلو داشته باشد، بهتر است اتاق مقصر را پیدا کنید و شاید با کوئری‌های SQL ذکر شده در #1760 آن‌ها را حذف کنید.",
      },
      enums: {
        join_rules: {
          public: "عمومی",
          knock: "درخواست پیوستن",
          invite: "دعوت‌نامه",
          private: "خصوصی",
        },
        guest_access: {
          can_join: "مهمان‌ها می‌توانند بپیوندند",
          forbidden: "مهمان‌ها نمی‌توانند بپیوندند",
        },
        history_visibility: {
          invited: "از زمان دعوت",
          joined: "از زمان پیوستن",
          shared: "از زمان اشتراک‌گذاری",
          world_readable: "همه افراد",
        },
        unencrypted: "رمزنگاری نشده",
      },
      action: {
        erase: {
          title: "حذف اتاق",
          content:
            "آیا مطمئن هستید که می‌خواهید اتاق را حذف کنید؟ این عمل قابل بازگشت نیست. تمام پیام‌ها و رسانه‌های اشتراک‌گذاری شده در اتاق از سرور حذف خواهند شد!",
        },
      },
    },
    reports: {
      name: "رویداد گزارش‌شده |||| رویدادهای گزارش‌شده",
      fields: {
        id: "شناسه",
        received_ts: "زمان گزارش",
        user_id: "گزارش‌دهنده",
        name: "نام اتاق",
        score: "امتیاز",
        reason: "دلیل",
        event_id: "شناسه رویداد",
        event_json: {
          origin: "سرور مبدأ",
          origin_server_ts: "زمان ارسال",
          type: "نوع رویداد",
          content: {
            msgtype: "نوع محتوا",
            body: "محتوا",
            format: "فرمت",
            formatted_body: "محتوای فرمت‌شده",
            algorithm: "الگوریتم",
            url: "آدرس",
            info: {
              mimetype: "نوع",
            },
          },
        },
      },
      action: {
        erase: {
          title: "حذف رویداد گزارش‌شده",
          content: "آیا مطمئن هستید که می‌خواهید رویداد گزارش‌شده را حذف کنید؟ این عمل قابل بازگشت نیست.",
        },
      },
    },
    connections: {
      name: "اتصال‌ها",
      fields: {
        last_seen: "تاریخ",
        ip: "آدرس IP",
        user_agent: "عامل کاربری",
      },
    },
    devices: {
      name: "دستگاه |||| دستگاه‌ها",
      fields: {
        device_id: "شناسه دستگاه",
        display_name: "نام دستگاه",
        last_seen_ts: "زمان",
        last_seen_ip: "آدرس IP",
      },
      action: {
        erase: {
          title: "حذف %{id}",
          content: 'آیا مطمئن هستید که می‌خواهید دستگاه "%{name}" را حذف کنید؟',
          success: "دستگاه با موفقیت حذف شد.",
          failure: "خطایی رخ داد.",
        },
      },
    },
    users_media: {
      name: "رسانه",
      fields: {
        media_id: "شناسه رسانه",
        media_length: "اندازه فایل (بایت)",
        media_type: "نوع",
        upload_name: "نام فایل",
        quarantined_by: "قرنطینه شده توسط",
        safe_from_quarantine: "محافظت شده از قرنطینه",
        created_ts: "ایجاد شده",
        last_access_ts: "آخرین دسترسی",
      },
      action: {
        open: "باز کردن فایل رسانه در پنجره جدید",
      },
    },
    protect_media: {
      action: {
        create: "محافظت نشده، ایجاد محافظت",
        delete: "محافظت شده، حذف محافظت",
        none: "در قرنطینه",
        send_success: "وضعیت محافظت با موفقیت تغییر کرد.",
        send_failure: "خطایی رخ داد.",
      },
    },
    quarantine_media: {
      action: {
        name: "قرنطینه",
        create: "اضافه کردن به قرنطینه",
        delete: "در قرنطینه، خارج کردن از قرنطینه",
        none: "محافظت شده از قرنطینه",
        send_success: "وضعیت قرنطینه با موفقیت تغییر کرد.",
        send_failure: "خطایی رخ داد.",
      },
    },
    pushers: {
      name: "پوشر |||| پوشرها",
      fields: {
        app: "اپلیکیشن",
        app_display_name: "نام نمایشی اپلیکیشن",
        app_id: "شناسه اپلیکیشن",
        device_display_name: "نام نمایشی دستگاه",
        kind: "نوع",
        lang: "زبان",
        profile_tag: "برچسب پروفایل",
        pushkey: "کلید پوش",
        data: { url: "آدرس" },
      },
    },
    servernotices: {
      name: "اعلان‌های سرور",
      send: "ارسال اعلان سرور",
      fields: {
        body: "پیام",
      },
      action: {
        send: "ارسال اعلان",
        send_success: "اعلان سرور با موفقیت ارسال شد.",
        send_failure: "خطایی رخ داد.",
      },
      helper: {
        send: 'ارسال اعلان سرور به کاربران انتخاب شده. ویژگی "اعلان‌های سرور" باید روی سرور فعال باشد.',
      },
    },
    user_media_statistics: {
      name: "رسانه کاربران",
      fields: {
        media_count: "تعداد رسانه",
        media_length: "حجم رسانه",
      },
    },
    forward_extremities: {
      name: "انتهای جلو",
      fields: {
        id: "شناسه رویداد",
        received_ts: "زمان",
        depth: "عمق",
        state_group: "گروه حالت",
      },
    },
    room_state: {
      name: "رویدادهای حالت",
      fields: {
        type: "نوع",
        content: "محتوا",
        origin_server_ts: "زمان ارسال",
        sender: "فرستنده",
      },
    },
    room_directory: {
      name: "فهرست اتاق‌ها",
      fields: {
        world_readable: "کاربران مهمان می‌توانند بدون پیوستن مشاهده کنند",
        guest_can_join: "کاربران مهمان می‌توانند بپیوندند",
      },
      action: {
        title: "حذف اتاق از فهرست |||| حذف %{smart_count} اتاق از فهرست",
        content:
          "آیا مطمئن هستید که می‌خواهید این اتاق را از فهرست حذف کنید؟ |||| آیا مطمئن هستید که می‌خواهید این %{smart_count} اتاق را از فهرست حذف کنید؟",
        erase: "حذف از فهرست اتاق‌ها",
        create: "انتشار در فهرست اتاق‌ها",
        send_success: "اتاق با موفقیت منتشر شد.",
        send_failure: "خطایی رخ داد.",
      },
    },
    destinations: {
      name: "فدراسیون",
      fields: {
        destination: "مقصد",
        failure_ts: "زمان خطا",
        retry_last_ts: "آخرین زمان تلاش مجدد",
        retry_interval: "فاصله تلاش مجدد",
        last_successful_stream_ordering: "آخرین استریم موفق",
        stream_ordering: "استریم",
      },
      action: { reconnect: "اتصال مجدد" },
    },
    registration_tokens: {
      name: "توکن‌های ثبت‌نام",
      fields: {
        token: "توکن",
        valid: "توکن معتبر",
        uses_allowed: "تعداد مجاز استفاده",
        pending: "در انتظار",
        completed: "تکمیل شده",
        expiry_time: "زمان انقضا",
        length: "طول",
      },
      helper: { length: "طول توکن در صورت عدم وارد کردن توکن." },
    },
  },
};
export default fa;
import BroadcastOnPersonalIcon from "@mui/icons-material/BroadcastOnPersonal";
import CakeIcon from "@mui/icons-material/Cake";
import SendIcon from "@mui/icons-material/Send";
import {
    Logout,
    Menu,
    MenuItemLink,
    useResourceDefinitions,
} from "react-admin";

const broadcastResourceNames = new Set([
    "broadcast_send",
    "broadcast_birthday_toggle",
    "broadcast_birthday_template",
    "broadcast_birthday_today",
    // "broadcast_birthday_recipients",
    "broadcast_logs",
    "broadcast_stats",
]);

const CustomMenu = () => {
    const resourceDefinitions = useResourceDefinitions();

    return (
        <Menu>
            <Menu.ResourceItem name="users" />

            {Object.keys(resourceDefinitions)
                .filter(name => !broadcastResourceNames.has(name) && name !== "users")
                .map(name => {
                    const def = resourceDefinitions[name];
                    if (!def.hasList) return null;
                    return <Menu.ResourceItem key={name} name={name} />;
                })}

            <MenuItemLink
                to="/broadcast_send/create"
                primaryText="ارسال پیام همگانی"
                leftIcon={<SendIcon />}
            />
            <MenuItemLink
                to="/broadcast_birthday_toggle/create"
                primaryText="تبریک تولد (روشن/خاموش)"
                leftIcon={<CakeIcon />}
            />
            <MenuItemLink
                to="/broadcast_birthday_template/create"
                primaryText="قالب تبریک تولد"
                leftIcon={<CakeIcon />}
            />
            <MenuItemLink
                to="/broadcast_birthday_today"
                primaryText="تولدهای امروز"
                leftIcon={<CakeIcon />}
            />
            {/* <MenuItemLink
                to="/broadcast_birthday_recipients"
                primaryText="مخاطبان پیام تولد"
                leftIcon={<CakeIcon />}
            /> */}
            <MenuItemLink
                to="/broadcast_logs"
                primaryText="لاگ پیام‌ها"
                leftIcon={<BroadcastOnPersonalIcon />}
            />
            <MenuItemLink
                to="/broadcast_stats/create"
                primaryText="آمار پیام‌ها"
                leftIcon={<BroadcastOnPersonalIcon />}
            />

            <Logout />
        </Menu>
    );
};

export default CustomMenu;

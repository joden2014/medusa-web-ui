// 初始化菜单数据
const menu = [
  {
    parent: "0",
    menuPath: "/digital",
    pathName: "digital",
    type: "dir",
    icon: "HomeOutlined",
    menuName: "系统中心",
    sort: 1,
    link: "",
    hidden: false,
    status: true,
    id: "1",
    childMenus: [
      {
        parent: "1",
        menuPath: "/digital/workspace",
        pathName: "digital-console",
        type: "menu",
        icon: "DashboardOutlined",
        menuName: "工作台",
        sort: 0,
        link: "",
        hidden: false,
        status: true,
        id: "1"
      },
      {
        parent: "1",
        menuPath: "/digital/appSystem",
        pathName: "appSystem",
        type: "menu",
        icon: "DashboardOutlined",
        menuName: "应用管理",
        sort: 0,
        link: "",
        hidden: false,
        status: true,
        id: "2"
      }
    ]
  }
];
export default menu;

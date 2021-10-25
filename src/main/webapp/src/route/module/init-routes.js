// 初始化菜单数据
const menu = [
  {
    "parent": "0",
    "menuPath": "/digital",
    "pathName": "digital",
    "type": "dir",
    "icon": "HomeOutlined",
    "menuName": "工作空间",
    "sort": 1,
    "link": "",
    "hidden": false,
    "status": true,
    "childMenus": [
      {
        "parent": "dashboard",
        "menuPath": "workspace",
        "pathName": "digital-console",
        "type": "menu",
        "icon": "DashboardOutlined",
        "menuName": "工作台",
        "sort": 0,
        "link": "",
        "hidden": false,
        "status": true
      },
      {
        "parent": "dashboard",
        "menuPath": "appSystem",
        "pathName": "appSystem",
        "type": "menu",
        "icon": "DashboardOutlined",
        "menuName": "应用管理",
        "sort": 0,
        "link": "",
        "hidden": false,
        "status": true
      }
    ]
  }
];
export default menu;

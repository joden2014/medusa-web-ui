# medusa-web-ui

数字化基建UI项目!

建立于2021年8月25日

# 🍚 功能概览

- [x] 用户管理: 用户是系统操作者，该功能主要完成系统用户配置。
- [x] 角色管理: 角色菜单权限分配、设置角色按机构进行数据范围权限划分。
- [x] 权限管理: 配置系统菜单，操作权限，按钮权限标识等。
- [x] 岗位管理: 配置系统用户所属担任职务。
- [x] 部门管理: 配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。
- [x] 数据字典: 对系统中经常使用的一些较为固定的数据进行维护。
- [x] 配置中心: 对系统动态配置常用参数。
- [x] 运行环境: 监视当前系统CPU、内存、磁盘、堆栈等相关信息。
- [x] 缓存监控: 对系统的缓存查询，删除、清空等操作。
- [x] 在线用户: 用户在线列表，用于系统在线用户监控。
- [x] 通知公告: 系统通知公告信息发布维护。
- [x] 定时任务: 在线（添加、修改、删除)任务调度包含执行结果日志。
- [x] 表单设计: 拖动表单元素生成相应的HTML代码。
- [x] 登录日志: 系统登录日志记录查询包含登录异常。
- [x] 操作日志: 系统正常操作日志记录和查询；系统异常信息日志记录和查询。
- [x] 邮件发送: 发送邮件功能。
- [x] 对象存储:  提供 本地 / 阿里云 Oss 对象存储。
- [x] 多数据源: 适用于多种场景 纯粹多库 读写分离 一主多从 混合模式。
- [x] 主题切换: 系统正常操作日志记录和查询；系统异常信息日志记录和查询。
- [x] 租户模式:  多租户模式，分库的方式 物理隔离数据。
- [x] 导入导出： 提供注解方式 Excel 导入与 Excel 导出。
- [x] 短信发送:  通过 阿里云 sms 向用户或其他终端直接发送文字或数字信息。
- [x] 个人中心:  当前用户基础信息显示，修改，重置密码。


# 🔨 项目结构

```
Pear Admin Pro
│
├─annex SQL 脚本
│
├─src 公共模块
│  │
│  └─main 
│      │
│      ├─java 源码文件
│      │   │
│      │   ├─common 公共代码
│      │   │   │
│      │   │   ├─aop 切面逻辑
│      │   │   │
│      │   │   ├─cache 缓存服务
│      │   │   │
│      │   │   ├─configure 集成配置
│      │   │   │
│      │   │   ├─constant 静态常量
│      │   │   │
│      │   │   ├─context 核心服务
│      │   │   │
│      │   │   ├─quartz 定时任务
│      │   │   │
│      │   │   ├─secure 安全实现
│      │   │   │
│      │   │   ├─tools 工具包
│      │   │   │
│      │   │   └─web 核心封装
│      │   │   
│      │   ├─modules 业务代码
│      │   │   │
│      │   │   ├─job 定时任务
│      │   │   │      │
│      │   │   │      ├─domain 实体
│      │   │   │      │
│      │   │   │      ├─params 参数
│      │   │   │      │
│      │   │   │      ├─repository ORM 操作
│      │   │   │      │
│      │   │   │      ├─rest 接口
│      │   │   │      │
│      │   │   │      └─service 服务
│      │   │   │        
│      │   │   │
│      │   │   └─sys 基础功能
│      │   │   
│      │   └─EntranceApplication 启动类
│      │   
│      └─resource 资源文件
│  
└─pom.xml  Maven 配置

```
# ⚡ 快速启动

前端启动 - webapp

```

安装依赖

npm install -g yarn

yarn install

启动项目

yarn run serve-dev

```

后端启动 - digital - (项目另见medusa-digital-parent)

```
修改配置

application-dev.yml

redis.*

datasource.*

启动项目

```

# 📖 帮助文档

👉前端文档：编写中

👉后台文档：编写中

👉接口文档：[查看](http://pro.pearadmin.com/swagger-ui.html)

# 🍎 预览界面

| 预览                 |                界面 |
|---------------------|---------------------|
| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/223456_0ae4c5ef_4835367.png "屏幕截图.png")  | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/223516_74b7d454_4835367.png "屏幕截图.png")  |
| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/223618_3bfffbaf_4835367.png "屏幕截图.png")  | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/223637_a152cc0c_4835367.png "屏幕截图.png")   |
| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/223659_657908ab_4835367.png "屏幕截图.png")  | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/223715_4b75622b_4835367.png "屏幕截图.png")  |
| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/223734_eb9f9b7f_4835367.png "屏幕截图.png")  | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/223755_7920c095_4835367.png "屏幕截图.png")   |
| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/223816_2b12d9f2_4835367.png "屏幕截图.png")  | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/223834_d34585b7_4835367.png "屏幕截图.png")   |
| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/223904_247d798f_4835367.png "屏幕截图.png")  | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/223918_b58717cb_4835367.png "屏幕截图.png")   |
| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/224003_19a6bcd9_4835367.png "屏幕截图.png")  | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/224025_9e476d59_4835367.png "屏幕截图.png")  |
| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/224050_98eda3a7_4835367.png "屏幕截图.png")  | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/224107_af6484ee_4835367.png "屏幕截图.png")  |
| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0505/224152_74aaa927_4835367.png "屏幕截图.png")  | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0506/060337_444d9fcf_4835367.png "屏幕截图.png")  |
| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0506/060218_aa430b85_4835367.png "屏幕截图.png")  | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0506/060447_0b579955_4835367.png "屏幕截图.png")  |
| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0519/100400_d030d63c_4835367.png "屏幕截图.png")  | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0519/100415_ab57979a_4835367.png "屏幕截图.png")  |
| ![输入图片说明](https://images.gitee.com/uploads/images/2021/0615/020125_945ca205_4835367.png "屏幕截图.png") | ![输入图片说明](https://images.gitee.com/uploads/images/2021/0615/020141_c7b33f29_4835367.png "屏幕截图.png")|

# 💐 特别鸣谢

- 👉 Vue Next：[https://github.com/vuejs/vue-next](https://github.com/vuejs/vue-next)
- 👉 Ant Design Vue：[https://gitee.com/ant-design-vue/ant-design-vue](https://gitee.com/ant-design-vue/ant-design-vue)
- 👉 Spring Boot：[https://github.com/spring-projects/spring-boot](https://github.com/spring-projects/spring-boot)
- 👉 MyBatis Plus：[https://gitee.com/baomidou/mybatis-plus](https://gitee.com/baomidou/mybatis-plus)

# 🍻 贡献代码

<p style="padding:10px;"  width="90%">

1. 欢迎提交 [pull request](https://gitee.com/pear-admin/pear-admin-pro/pulls)，注意对应提交对应 `develop` 分支

2. 欢迎提交 [issue](https://gitee.com/pear-admin/pear-admin-pro/issues)，请写清楚遇到问题的原因、开发环境、复显步骤。

</p>

感谢每一位贡献代码的朋友。

[![Giteye chart](https://chart.giteye.net/gitee/pear-admin/pear-admin-pro/3E4EEFDN.png)](https://giteye.net/chart/3E4EEFDN)

如果对您有帮助，您可以点右上角 💘Star💘支持



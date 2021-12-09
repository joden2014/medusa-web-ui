<template>
  <page-layout>
    <a-row :gutter="[10, 10]">
      <!-- 顶部区域 -->
      <a-col :span="24">
        <a-card>
          <!-- 查询参数 -->
          <pro-query :searchParam="searchParam" @on-search="search"></pro-query>
        </a-card>
      </a-col>
      <!-- 中心区域 -->
      <a-col :span="24">
        <a-card>
          <!-- 列表 -->
          <pro-table
            ref="tableRef"
            :fetch="fetch"
            :columns="columns"
            :toolbar="toolbar"
            :operate="operate"
            :param="state.param"
            :pagination="pagination"
            rowKey="roleId"
            :row-selection="{
              selectedRowKeys: state.selectedRowKeys,
              onChange: onSelectChange
            }"
          >
          </pro-table>
        </a-card>
      </a-col>
    </a-row>
    <!-- 新增、编辑 -->
    <save
      :visible="state.visibleSave"
      @close="closeSave"
      :isEdit="state.isEdit"
      v-if="state.visibleSave"
      :record="state.recordEdit"
    ></save>
    <!-- 设置权限 -->
    <give
      :visible="state.visibleGive"
      @close="closeGive"
      :record="state.recordGive"
      v-if="state.visibleGive"
    ></give>

    <role-view
      :visible="state.visibleView"
      @close="closeView"
      :record="state.recordView"
      v-if="state.visibleView"
    ></role-view>

    <users
      :visible="state.visibleUser"
      v-if="state.visibleUser"
      :record="state.recordUser"
      ref="users"
      @close="closeUser"
      @showUser="showUserList"
    />

    <users-list
      :visible="state.visibleUserList"
      v-if="state.visibleUserList"
      :record="state.recordUser"
      :setUsers="setUsersRole"
      @close="closeUserList"
    />
  </page-layout>
</template>
<script>
import save from "./modal/save";
import give from "./modal/give";
import roleView from "./modal/view";
import users from "./modal/user"; // 已选择用户的列表
import usersList from "./modal/userList"; // 选择用户列表
import { message, modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { list, remove, switchStatus, setUsers } from "@/api/module/role";
import { reactive, createVNode, ref, computed } from "vue";
import { useStore } from "vuex";
const removeKey = "remove";
const removeBatchKey = "removeBatch";

export default {
  components: {
    save,
    give,
    roleView,
    users,
    usersList
  },
  setup() {
    const users = ref();
    const tableRef = ref();
    const { getters } = useStore();
    const userInfo = computed(() => JSON.parse(getters.userInfo)); // 当前登录人信息
    const switchFormat = {
      yes: true,
      no: false,
      checkedStr: "是",
      unCheckedStr: "否",
      event: async function(value, record) {
        await switchStatus({
          roleId: record.roleId,
          status: !record.status
        });
        record.status = !record.status;
        return value;
      }
    };
    const converFormat = [
      { label: "是", value: true },
      { label: "否", value: false }
    ];
    const columns = [
      { dataIndex: "roleName", key: "roleName", title: "角色名称" },
      { dataIndex: "roleTypeDesc", key: "roleTypeDesc", title: "角色类型" },
      { dataIndex: "roleScopeDesc", key: "roleScopeDesc", title: "数据范围" },
      {
        dataIndex: "status",
        key: "status",
        title: "是否启用",
        switch: switchFormat
      },
      {
        dataIndex: "publicAttribute",
        key: "publicAttribute",
        title: "是否公有",
        conver: converFormat
      },
      { dataIndex: "userNum", key: "userNum", title: "拥有该角色的总人数" }
    ];

    /// 数据来源
    const fetch = async param => {
      var res = await list(param);
      const data = res.data || [];
      if (data) {
        data.map(res => {
          if (res.roleType) {
            res.roleTypeDesc = res.roleType.desc;
          }
          if (res.roleScope) {
            res.roleScopeDesc = res.roleScope.desc;
          }
        });
      }
      return {
        total: res.total,
        data
      };
    };

    /// 删除角色
    const removeMethod = record => {
      modal.confirm({
        title: "您是否确定要删除此角色?",
        icon: createVNode(ExclamationCircleOutlined),
        okText: "确定",
        cancelText: "取消",
        onOk() {
          message.loading({ content: "提交中...", key: removeKey });
          remove({ roleId: record.roleId }).then(response => {
            if (response.success) {
              message
                .success({ content: "删除成功", key: removeKey, duration: 1 })
                .then(() => tableRef.value.reload());
            } else {
              message.error({
                content: "删除失败",
                key: removeKey,
                duration: 1
              });
            }
          });
        }
      });
    };

    /// 工具栏
    const toolbar = [
      {
        label: "新增",
        event: function() {
          state.visibleSave = true;
          state.isEdit = false;
        }
      }
    ];

    /// 行操作
    const operate = [
      {
        label: "查看",
        event: function(record) {
          (state.visibleView = true), (state.recordView = record);
        }
      },
      {
        label: "修改",
        event: function(record) {
          state.isEdit = true;
          state.visibleSave = true;
          state.recordEdit = record;
        }
      },
      {
        label: "删除",
        event: function(record) {
          removeMethod(record);
        }
      },
      {
        label: "设置",
        children: [
          {
            label: "设置人员",
            event: function(e, record) {
              state.visibleUser = true;
              state.recordUser = record;
            }
          },
          {
            label: "设置权限",
            event: function(record) {
              (state.visibleGive = true), (state.recordGive = record);
            }
          }
        ]
      }
    ];

    /// 分页参数
    const pagination = { pageIndex: 1, pageSize: 10 };

    /// 外置参数
    const state = reactive({
      selectedRowKeys: [],
      param: { roleType: null, userId: userInfo.value.userId },
      visibleSave: false,
      visibleGive: false,
      visibleView: false,
      recordEdit: {},
      recordGive: {},
      recordView: {},
      isEdit: false,
      visibleUser: false,
      visibleUserList: false,
      recordUserList: {},
      recordUser: {}
    });

    /// 查询参数
    const searchParam = [
      {
        key: "roleType",
        type: "select",
        label: "角色类型",
        options: [
          { value: "S", text: "系统角色" },
          { value: "B", text: "业务角色" }
        ]
      }
    ];

    /// 查询操作
    const search = function(value) {
      for (const key in value) {
        if (!value[key]) {
          value[key] = null;
        }
      }
      value.userId = userInfo.value.userId;
      state.param = { ...value };
    };

    const closeSave = function() {
      state.visibleSave = false;
      tableRef.value.reload();
    };

    const closeUser = function() {
      state.visibleUser = false;
    };

    const closeEdit = function() {
      state.visibleEdit = false;
      tableRef.value.reload();
    };

    const closeGive = function() {
      state.visibleGive = false;
      tableRef.value.reload();
    };
    const showUserList = () => {
      state.visibleUserList = true;
    };

    const closeUserList = function() {
      state.visibleUserList = false;
    };

    const setUsersRole = async (roleId, userIds) => {
      await setUsers({ roleId, userIds });
      users.value.reload(); // 刷新用户列表
      message.success("设置用户成功！");
      closeUserList();
    };
    const closeView = function() {
      state.visibleView = false;
    };

    return {
      state,
      fetch,
      search,
      toolbar,
      columns,
      operate,
      pagination,
      searchParam,
      userInfo,
      closeSave,
      closeEdit,
      closeGive,
      closeView,
      setUsersRole,
      tableRef,
      closeUser,
      users,
      showUserList,
      closeUserList
    };
  }
};
</script>

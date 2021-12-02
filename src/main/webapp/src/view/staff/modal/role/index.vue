<template>
  <a-modal
    :visible="visible"
    title="权限列表"
    cancelText="取消"
    okText="提交"
    width="40%"
    @ok="submit"
    @cancel="cancel"
  >
    <page-layout>
      <a-row :gutter="[10, 10]">
        <!-- 顶部区域 -->
        <a-col :span="24">
          <!-- 查询参数 -->
          <pro-query :searchParam="searchParam" @on-search="search"></pro-query>
        </a-col>
        <!-- 中心区域 -->
        <a-col :span="24">
          <!-- 列表 -->
          <pro-table
            ref="tableRef"
            :fetch="fetch"
            :columns="columns"
            :param="state.param"
            :pagination="pagination"
            rowKey="roleId"
            :row-selection="{
              selectedRowKeys: state.selectedRowKeys,
              onChange: onSelectChange
            }"
          >
          </pro-table>
        </a-col>
      </a-row>
    </page-layout>
  </a-modal>
</template>
<script>
import { message } from "ant-design-vue";
import { page, getUserRoleList } from "@/api/module/role";
import { reactive, createVNode, ref } from "vue";

export default {
  props: {
    visible: {
      type: Boolean
    },
    record: {
      type: Object
    },
    setUserRole: {
      type: Function
    }
  },
  setup(props, context) {
    const tableRef = ref();

    const columns = [
      { dataIndex: "roleTypeDesc", key: "roleTypeDesc", title: "角色类型" },
      { dataIndex: "roleName", key: "roleName", title: "角色名称" }
    ];

    /// 数据来源
    const fetch = async param => {
      var response = await page(param);
      const data = response.data;
      data.map(res => {
        if (res.roleType) {
          res.roleTypeDesc = res.roleType.desc;
        }
      });
      return {
        total: response.data.total,
        data: response.data
      };
    };

    /// 分页参数
    const pagination = { pageIndex: 1, pageSize: 10 };

    /// 外置参数
    const state = reactive({
      selectedRowKeys: [],
      param: { userId: props.record.userId }
    });

    /// 查询参数
    const searchParam = [
      {
        key: "roleType",
        type: "select",
        label: "应用状态",
        options: [
          { value: "S", text: "系统角色" },
          { value: "B", text: "业务角色" }
        ]
      }
    ];

    /// 查询操作
    const search = function(value) {
      state.param = value;
      tableRef.value.reload();
    };

    const getRoleList = async () => {
      const userId = props.record.userId;
      const { data } = await getUserRoleList({ userId });
      const role = data.map(res => res.roleId);
      state.selectedRowKeys = role;
    };
    const onSelectChange = selectedRowKeys => {
      state.selectedRowKeys = selectedRowKeys;
    };

    const submit = e => {
      message.loading({ content: "提交中..." });
      props.setUserRole(props.record.userId, state.selectedRowKeys);
    };
    const cancel = e => {
      state.selectedRowKeys = [];
      context.emit("cancel", "role");
    };
    getRoleList();
    return {
      state,
      fetch,
      search,
      toolbar,
      columns,
      cancel,
      pagination,
      searchParam,
      onSelectChange,
      tableRef,
      submit,
      getRoleList
    };
  }
};
</script>

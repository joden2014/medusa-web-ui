<template>
  <a-modal
    :visible="visible"
    title="用户列表"
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
            rowKey="userId"
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
import { queryUserList } from "@/api/module/staff";
import { getRoleUserList } from "@/api/module/role";
import { message } from "ant-design-vue";
import { reactive, ref, computed } from "vue";
import { useStore } from "vuex";
export default {
  props: {
    visible: {
      type: Boolean
    },
    record: {
      type: Object
    },
    setUsers: {
      type: Function
    }
  },
  setup(props, context) {
    const tableRef = ref();
    const { getters } = useStore();
    const userInfo = computed(() => JSON.parse(getters.userInfo)); // 当前登录人信息
    const columns = [
      { dataIndex: "userTypeDesc", key: "roleTypeDesc", title: "用户类型" },
      { dataIndex: "userName", key: "userName", title: "用户名称" }
    ];

    /// 数据来源
    const fetch = async param => {
      var response = await queryUserList(param);
      const data = response.data;
      data.map(res => {
        if (res.userType) {
          res.userTypeDesc = res.userType.desc;
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
        key: "userName",
        type: "input",
        label: "用户名称"
      }
    ];

    /// 查询操作
    const search = function(value) {
      state.param = value;
    };

    const onSelectChange = selectedRowKeys => {
      state.selectedRowKeys = selectedRowKeys;
    };

    const submit = e => {
      const roleId = props.record.roleId;
      message.loading({ content: "提交中..." });
      props.setUsers(roleId, state.selectedRowKeys);
    };
    const cancel = e => {
      state.selectedRowKeys = [];
      context.emit("close");
    };

    const getRoleUserListData = async () => {
      const data = await getRoleUserList({
        ...pagination,
        roleId: props.record.roleId,
        userId: userInfo.value.userId
      });
      console.log(data);
    };

    getRoleUserListData();
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
      submit
    };
  }
};
</script>

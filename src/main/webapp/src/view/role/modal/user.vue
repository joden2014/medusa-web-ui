<template>
  <a-modal
    :visible="visible"
    title="已选择用户列表"
    cancelText="取消"
    okText="返回"
    width="40%"
    @ok="submit"
    @cancel="cancel"
  >
    <page-layout>
      <a-row :gutter="[10, 10]">
        <!-- 中心区域 -->
        <a-col :span="24">
          <!-- 列表 -->
          <pro-table
            ref="tableRef"
            :fetch="fetch"
            :toolbar="toolbar"
            :columns="columns"
            :param="state.param"
            :pagination="pagination"
            rowKey="userId"
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
    /// 工具栏
    const toolbar = [
      {
        label: "添加用户",
        event: function() {
          context.emit("showUser");
        }
      }
    ];
    /// 数据来源
    const fetch = async param => {
      var response = await getRoleUserList(param);
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
      visibleUser: false,
      param: { roleId: props.record.roleId, userId: userInfo.value.userId }
    });

    const submit = e => {
      context.emit("close");
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
    const reload = () => {
      tableRef.value.reload();
    };
    getRoleUserListData();
    return {
      state,
      fetch,
      toolbar,
      columns,
      cancel,
      pagination,
      tableRef,
      submit,
      reload
    };
  }
};
</script>

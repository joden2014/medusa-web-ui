<template>
  <page-layout>
    <a-row :gutter="[10, 10]">
      <!-- 查询表单 -->
      <a-col :span="24">
        <a-card>
          <pro-query :searchParam="searchParam" @on-search="search"></pro-query>
        </a-card>
      </a-col>
      <!-- 岗位列表 -->
      <a-col :span="24">
        <a-card>
          <pro-table
            ref="tableRef"
            :fetch="fetch"
            :columns="columns"
            :toolbar="toolbar"
            :operate="operate"
            :param="state.param"
            rowKey="applicationId"
            :pagination="pagination"
          >
          </pro-table>
        </a-card>
      </a-col>
    </a-row>
    <save
      :visible="state.visibleSave"
      @close="closeSave"
      @reload="reloadTable"
      :record="state.recordEdit"
      v-if="state.visibleSave"
    ></save>

    <!-- 菜单组件 -->
    <myMenu
      :visible="state.visibleMenu"
      @close="closeMenu"
      :record="state.recordMenu"
    ></myMenu>
  </page-layout>
</template>

<script>
import save from "./modal/save";
import menu from "./modal/menu.vue"; // 菜单创建修改
import { message, modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import {
  queryList,
  remove,
  getAppMenu,
  switchStatus
} from "@/api/module/application";
import { reactive, createVNode, ref } from "vue";

const removeKey = "remove";
const removeBatchKey = "removeBatch";

export default {
  components: {
    save,
    myMenu: menu
  },
  setup() {
    const tableRef = ref();
    const switchFormat = {
      yes: true,
      no: false,
      checkedStr: "开启",
      unCheckedStr: "禁用",
      event: async function(value, record) {
        await switchStatus({
          applicationId: record.applicationId,
          status: !record.status
        });
        record.status = !record.status;
        return value;
      }
    };
    /// 开关
    const converFormat = [
      { label: "生效", value: true },
      { label: "禁用", value: false }
    ];

    /// 列配置
    const columns = [
      { dataIndex: "sort", key: "sort", title: "排序" },
      {
        dataIndex: "applicationName",
        key: "applicationName",
        title: "应用名称"
      },
      { dataIndex: "description", key: "description", title: "描述" },
      {
        dataIndex: "applicationTypeDesc",
        key: "applicationTypeDesc",
        title: "应用系统类型"
      },
      {
        dataIndex: "status",
        key: "state",
        title: "状态",
        conver: converFormat,
        switch: switchFormat
      },
      { dataIndex: "startTime", key: "startTime", title: "生效时间" },
      { dataIndex: "endTime", key: "endTime", title: "截止时间" }
    ];

    /// 数据来源 [模拟]
    const fetch = async param => {
      const { total, data } = await queryList(param);
      const result = data ?? [];
      result.map(res => {
        res.applicationTypeDesc = res.applicationType.desc;
      });
      return {
        total,
        data: result
      };
    };

    /// 删除配置
    const removeMethod = record => {
      modal.confirm({
        title: "您是否确定要删除此应用?",
        icon: createVNode(ExclamationCircleOutlined),
        okText: "确定",
        cancelText: "取消",
        onOk() {
          message.loading({ content: "提交中...", key: removeKey });
          remove(record).then(response => {
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
          state.recordEdit = {};
          state.visibleSave = true;
        }
      }
    ];

    /// 行操作
    const operate = [
      {
        label: "修改",
        event: function(record) {
          (state.visibleSave = true), (state.recordEdit = record);
        }
      },
      {
        label: "菜单",
        event: record => {
          (state.visibleMenu = true), (state.recordMenu = record);
        }
      },
      {
        label: "删除",
        event: function(record) {
          removeMethod(record);
        }
      }
    ];

    /// 分页参数
    const pagination = {
      pageIndex: 1,
      pageSize: 10
    };

    const reloadTable = () => {
      tableRef.value.reload();
    };
    /// 外置参数 - 当参数改变时, 重新触发 fetch 函数
    const state = reactive({
      selectedRowKeys: [],
      param: {},
      visibleSave: false,
      visibleEdit: false,
      visibleMenu: false,
      recordEdit: {},
      recordMenu: {}
    });

    const searchParam = [
      { key: "applicationName", type: "input", label: "应用名称" },
      {
        key: "status",
        type: "select",
        label: "应用状态",
        options: [
          { value: null, text: "全部" },
          { value: true, text: "生效" },
          { value: false, text: "失效" }
        ]
      }
    ];

    const search = function(value) {
      state.param = value;
    };

    const closeSave = function() {
      state.visibleSave = false;
    };

    const closeEdit = function() {
      state.visibleEdit = false;
    };

    const closeMenu = function() {
      state.visibleMenu = false;
    };

    const onSelectChange = selectedRowKeys => {
      state.selectedRowKeys = selectedRowKeys;
    };
    return {
      state,
      fetch,
      toolbar,
      columns,
      operate,
      pagination,

      search,
      searchParam,

      closeSave,
      closeEdit,
      closeMenu,

      onSelectChange,
      tableRef,
      reloadTable
    };
  }
};
</script>

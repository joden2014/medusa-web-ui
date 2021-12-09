<template>
  <page-layout>
    <a-row type="flex" class="content">
      <a-col flex="1" class="left-content">
        <a-card :bordered="false">
          <a-input-search
            v-model:value="searchValue"
            style="margin-bottom: 8px"
            placeholder="筛选部门"
          />
          <div class="tree-content">
            <a-tree
              :tree-data="gData"
              v-if="gData.length"
              @select="onSelect"
              :replaceFields="replaceFields"
              v-model:selectedKeys="selectedKeys"
              defaultExpandAll
            ></a-tree>
          </div>
        </a-card>
      </a-col>
      <a-col flex="2" class="right-content">
        <a-card :bordered="false">
          <h3>当前部门：{{ state.departmentName }}</h3>
          <a-row type="flex" class="flex">
            <a-col :span="24">
              <pro-table
                ref="tableRef"
                :fetch="fetch"
                :columns="columns"
                :toolbar="toolbar"
                :operate="operate"
                :param="state.param"
                rowKey="userId"
                :pagination="pagination"
                v-if="Object.keys(state.param).length"
                :row-selection="{
                  selectedRowKeys: state.selectedRowKeys,
                  onChange: onSelectChange
                }"
              >
                >
              </pro-table>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <save
      :visible="state.visibleSave"
      @close="closeSave"
      @reload="reloadTable"
      :record="state.recordEdit"
      :isEdit="state.isEdit"
      :department="{
        departmentId: state.param.departmentId,
        departmentName: state.departmentName,
        organiseId: state.organiseId
      }"
      v-if="state.visibleSave"
    ></save>

    <user-view
      :visible="state.visibleView"
      @close="closeView"
      :record="state.recordView"
      @cancel="handleCancel"
      v-if="state.visibleView"
    ></user-view>
    <role
      :visible="state.visibleRole"
      v-if="state.visibleRole"
      :record="state.recordRole"
      :setUserRole="setUserRole"
      @cancel="handleCancel"
    />
  </page-layout>
</template>

<script>
import role from "./modal/role/index.vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import save from "./modal/save";
import userView from "./modal/view";
import { defineComponent, ref, watch, reactive, createVNode } from "vue";
import {
  queryUserList,
  deleteUser,
  batchDeleteUser,
  setRoles,
  switchStatus
} from "@/api/module/staff";
import { queryList } from "@/api/module/department";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default defineComponent({
  components: { save, userView, role },
  setup() {
    const tableRef = ref();
    const previewImage = ref("");
    const fileList = ref([]);
    const searchValue = ref("");
    const autoExpandParent = ref(true);
    const gData = ref([]);
    const selectedKeys = ref([100]); // 选中
    const converFormat = [
      { label: "启用", value: true },
      { label: "禁用", value: false }
    ];
    const switchFormat = {
      yes: true,
      no: false,
      checkedStr: "开启",
      unCheckedStr: "禁用",
      event: async function(value, record) {
        await switchStatus({
          userId: record.userId,
          status: !record.status
        });
        record.status = !record.status;
        return value;
      }
    };
    /// 列配置
    const columns = ref([
      {
        dataIndex: "userName",
        key: "userName",
        title: "用户名称"
      },
      {
        dataIndex: "status",
        key: "state",
        title: "是否启用",
        conver: converFormat,
        switch: switchFormat
      },
      { dataIndex: "userTypeDesc", key: "userTypeDesc", title: "用户类型" },
      { dataIndex: "phone", key: "phone", title: "联系电话" }
    ]);
    /// 行操作
    const operate = ref([
      {
        label: "详情",
        event: function(record) {
          const departmentName = state.departmentName;
          record.departmentName = departmentName;         
          state.visibleView = true;
          state.recordView = record;
        }
      },
      {
        label: "修改",
        event: record => {
          state.isEdit = true;
          state.visibleSave = true;
          state.recordEdit = record;
        }
      },
      {
        label: "设置角色",
        event: function(record) {
          state.visibleRole = true;
          state.recordRole = record;
        }
      },
      {
        label: "删除",
        event: function(record) {
          removeUser(record.userId);
        }
      }
    ]);
    /// 工具栏
    const toolbar = ref([
      {
        label: "新建用户",
        event: function(record) {
          state.visibleSave = true;
          state.isEdit = false;
        }
      },
      {
        label: "批量删除用户",
        event: function(record) {
          batchRemoveUser();
        }
      }
    ]);

    const batchRemoveUser = () => {
      const userIds = state.selectedRowKeys;
      Modal.confirm({
        title: "删除",
        icon: createVNode(ExclamationCircleOutlined),
        content: "你确定要删除吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: async () => {
          await batchDeleteUser({ userIds });
          message.success("删除成功！");
          reloadTable();
        }
      });
    };
    const removeUser = userId => {
      Modal.confirm({
        title: "删除",
        icon: createVNode(ExclamationCircleOutlined),
        content: "你确定要删除吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: async () => {
          await deleteUser({ userId });
          reloadTable();
        }
      });
    };
    /// 选择操作
    const onSelectChange = selectedRowKeys => {
      state.selectedRowKeys = selectedRowKeys;
    };
    const setUserRole = async (userId, roleIds) => {
      await setRoles({ userId, roleIds });
      message.success("设置角色成功！");
      state.visibleRole = false;
    };
    let replaceFields = reactive({
      title: "departmentName",
      key: "organiseId",
      children: "childDepartments"
    });

    const pagination = {
      pageIndex: 1,
      pageSize: 10
    };
    // 数据来源 [模拟]
    const fetch = async param => {
      const { total, data } = await queryUserList(param);
      const result = data ?? [];
      result.map(res => {
        res.userTypeDesc = res.userType.desc;
      });
      return {
        total,
        data: result
      };
    };

    const reloadTable = () => {
      tableRef.value.reload();
    };

    // 选中书节点触发
    const onSelect = (keys, data) => {
      selectedKeys.value = keys;
      state.param.departmentId = data.node.dataRef.departmentId;
      state.departmentName = data.node.dataRef.departmentName;
      state.organiseId = data.node.dataRef.organiseId;
    };

    watch(searchValue, value => {});

    const handleCancel = type => {
      if (type === "role") {
        state.visibleRole = false;
      } else {
        state.visibleView = false;
      }
    };

    const handleChange = ({ fileList: newFileList }) => {
      fileList.value = newFileList;
    };

    const queryTreeList = async () => {
      const data = await queryList({ departmentId: 100 });
      state.param.departmentId = 100;
      state.departmentName = data.data.departmentName;
      state.organiseId = data.data.organiseId;
      gData.value = [data.data];
    };

    const state = reactive({
      selectedRowKeys: [],
      param: {},
      visibleSave: false,
      recordEdit: {},
      recordView: {},
      recordRole: {},
      isEdit: false,
      visibleView: false,
      departmentName: null,
      organiseId: null,
      visibleRole: false
    });
    queryTreeList();

    const closeSave = function() {
      state.visibleSave = false;
    };

    return {
      searchValue,
      autoExpandParent,
      gData,
      onSelect,
      fileList,
      previewImage,
      handleCancel,
      handleChange,
      queryTreeList,
      replaceFields,
      state,
      selectedKeys,
      closeSave,
      columns,
      toolbar,
      operate,
      pagination,
      fetch,
      reloadTable,
      onSelectChange,
      tableRef,
      removeUser,
      batchRemoveUser,
      setUserRole,
      switchFormat
    };
  }
});
</script>

<style lang="less" scoped>
.tree-content {
  border-right: 1px solid #e8e8e8;
}
.btns {
  .ant-btn {
    margin: 0 6px;
  }
}
.upload-icon {
  margin-right: 6px;
  /deep/ .ant-upload.ant-upload-select-picture-card {
    height: 40px;
    width: 120px;
    margin: 0;
    .ant-upload-text {
      font-size: 12px;
    }
    .upload-file {
      display: flex;
      align-items: center;
    }
  }
  /deep/ .ant-upload-list-picture-card-container {
    height: 40px;
    width: 120px;
    margin: 0;
  }
  /deep/ .ant-upload-list-picture-card .ant-upload-list-item {
    height: 40px;
    width: 120px;
  }
}
.content {
  background: #fff;
  height: calc(100vh - 100px);
  overflow: auto;
}
.title {
  border-left: 3px solid #2d8cf0;
  padding-left: 10px;
  margin-top: 20px;
}
.flex {
  &.border {
    border-top: 1px solid #e8e8e8;
    margin-top: 20px;
  }
  .flex-item {
    margin-top: 20px;
    overflow: hidden;
  }
}
</style>

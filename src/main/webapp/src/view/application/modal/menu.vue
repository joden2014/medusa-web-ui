<template>
  <a-modal
    :visible="visible"
    :title="`编辑【${record.applicationName}】的菜单`"
    cancelText="取消"
    okText="确定"
    @ok="submit"
    @cancel="cancel"
  >
    <a-tree :tree-data="treeData" show-icon default-expand-all>
      <template #title="item">
        <span>{{ item.title }}</span>
        <!-- 删除节点 -->
        <span class="icon-wrap">
          <DeleteOutlined />
          <!-- 编辑节点 -->
          <FormOutlined />
          <!-- 新增节点 -->
          <PlusOutlined />
        </span>
      </template>
    </a-tree>
  </a-modal>
</template>
<script>
import {
  DeleteOutlined,
  PlusOutlined,
  FormOutlined
} from "@ant-design/icons-vue";
import { getAppMenu } from "@/api/module/application";
import { defineComponent, reactive, ref, watch } from "vue";
const treeData = [
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "leaf",
        key: "0-0-0"
      },
      {
        title: "leaf",
        key: "0-0-1"
      }
    ]
  }
];
export default defineComponent({
  props: {
    visible: {
      type: Boolean
    },
    record: {
      type: Object
    }
  },
  components: { DeleteOutlined, PlusOutlined, FormOutlined },
  emit: ["close"],
  setup(props, context) {
    const submit = e => {
      context.emit("close", false);
    };

    const cancel = e => {
      context.emit("close", false);
    };
    const getAPPMenuData = applicationId => {
      getAppMenu({ applicationId }).then(res => {
        console.log(res);
      });
    };
    getAPPMenuData(props.applicationId);
    return {
      submit,
      cancel,
      treeData,
      getAPPMenuData
    };
  },
  methods: {}
});
</script>

<style lang="less" scoped>
/deep/ .ant-tree-switcher.ant-tree-switcher_open {
  .ant-tree-switcher-icon {
    width: 100%;
    height: 100%;
    background-image: url("~@/assets/image/minus.png"); // 展开节点时的icon
  }
}
/deep/ .ant-tree-switcher.ant-tree-switcher_close {
  .ant-tree-switcher-icon {
    width: 100%;
    height: 100%;
    background-image: url("~@/assets/image/plus.png"); // 收起节点时的icon
  }
}
.icon-wrap {
  margin-left: 10px;
  .anticon {
    padding: 0 5px;
  }
}
</style>

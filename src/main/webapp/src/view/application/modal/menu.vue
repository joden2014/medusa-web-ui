<template>
  <a-modal
    :visible="visible"
    :title="`编辑【${record.applicationName}】的菜单`"
    cancelText="取消"
    okText="确定"
    @ok="submit"
    @cancel="cancel"
  >
    <div class="tree-box">
      <type-tree
        @onSelect="onSelect"
        :action="true"
        v-if="visible"
        :applicationId="record.applicationId"
        ref="treeData"
      />
    </div>
  </a-modal>
</template>
<script>
import typeTree from "./tree/index.vue";
import { defineComponent, reactive, ref, watch } from "vue";
export default defineComponent({
  components: { typeTree },
  props: {
    visible: {
      type: Boolean,
    },
    record: {
      type: Object,
    },
  },
  emit: ["close"],
  setup(props, context) {
    const treeData = ref(null);
    const submit = (e) => {
      console.log(treeData.value);
      context.emit("close", false);
    };

    const cancel = (e) => {
      context.emit("close", false);
    };

    return {
      submit,
      cancel,
      treeData,
    };
  },
  methods: {
    onSelect() {
      alert(111);
    },
  },
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

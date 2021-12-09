<template>
  <a-modal
    :visible="visible"
    title="角色详情"
    cancelText="取消"
    okText="提交"
    @ok="cancel"
    @cancel="cancel"
    width="40%"
  >
    <a-descriptions v-if="Object.keys(roleInfo).length">
      <a-descriptions-item label="角色名称">
        {{ roleInfo.roleName }}
      </a-descriptions-item>
      <a-descriptions-item label="角色类型">
        {{ roleInfo.roleType.desc }}
      </a-descriptions-item>
      <a-descriptions-item label="角色权限字符串">
        {{ roleInfo.roleKey }}
      </a-descriptions-item>
      <a-descriptions-item label="是否公共角色">
        {{ roleInfo.publicAttribute ? "是" : "否" }}
      </a-descriptions-item>
      <a-descriptions-item label="默认拥有该角色">
        {{ roleInfo.isFlag ? "是" : "否" }}
      </a-descriptions-item>
      <a-descriptions-item label="描述">
        {{ roleInfo.description }}
      </a-descriptions-item>
    </a-descriptions>
    <a-skeleton v-else active />
  </a-modal>
</template>
<script>
import { message } from "ant-design-vue";
import { getRoleInfo } from "@/api/module/role";
import { defineComponent, reactive, ref, toRaw } from "vue";
export default defineComponent({
  props: {
    visible: {
      type: Boolean
    },
    record: {
      type: Object
    }
  },
  emit: ["close"],
  setup(props, context) {
    const roleInfo = ref({});
    const cancel = e => {
      context.emit("close", false);
    };
    const getDetail = async () => {
      const _data = await getRoleInfo({
        roleId: props.record.roleId
      });
      roleInfo.value = _data.data;
    };
    getDetail();
    return {
      getDetail,
      roleInfo,
      cancel
    };
  }
});
</script>

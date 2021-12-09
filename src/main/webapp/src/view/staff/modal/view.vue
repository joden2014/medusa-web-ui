<template>
  <a-modal
    :visible="visible"
    title="用户详情"
    cancelText="取消"
    okText="返回"
    @ok="cancel"
    @cancel="cancel"
    width="50%"
  >
    <a-descriptions v-if="Object.keys(userInfo).length">
      <a-descriptions-item label="员工编号">-</a-descriptions-item>
      <a-descriptions-item label="员工名称">{{
        userInfo.userName
      }}</a-descriptions-item>
      <a-descriptions-item label="登录名">{{
        userInfo.loginName
      }}</a-descriptions-item>
      <a-descriptions-item label="所属部门">
        {{ record.departmentName }}
      </a-descriptions-item>
      <a-descriptions-item label="所属机构">
        {{ record.departmentName }}
      </a-descriptions-item>
      <a-descriptions-item label="岗位">
        -
      </a-descriptions-item>
      <a-descriptions-item label="联系电话">
        {{ userInfo.phone }}
      </a-descriptions-item>
      <a-descriptions-item label="邮箱">
        {{ userInfo.email }}
      </a-descriptions-item>
      <a-descriptions-item label="性别">
        {{ userInfo.sex.desc || "未知" }}
      </a-descriptions-item>
      <a-descriptions-item label="职称">
        -
      </a-descriptions-item>
      <a-descriptions-item label="是否启用">
        {{ userInfo.status ? "启用" : "禁用" }}
      </a-descriptions-item>
      <a-descriptions-item label="排序">
        -
      </a-descriptions-item>
      <a-descriptions-item label="出生年月日">
        -
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        -
      </a-descriptions-item>
      <a-descriptions-item label="更新时间">
        -
      </a-descriptions-item>
      <a-descriptions-item label="地址">
        {{ userInfo.address }}
      </a-descriptions-item>
    </a-descriptions>
    <a-skeleton v-else active />
  </a-modal>
</template>
<script>
import { message } from "ant-design-vue";
import { getUserInfo } from "@/api/module/staff";
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
    const userInfo = ref({});
    const getDetail = async () => {
      const _data = await getUserInfo({
        userId: props.record.userId
      });
      userInfo.value = _data.data;
    };
    getDetail();
    const cancel = e => {
      context.emit("cancel", false);
    };
    return {
      getDetail,
      userInfo,
      cancel
    };
  }
});
</script>

<template>
  <a-modal
    :visible="visible"
    title="用户详情"
    cancelText="取消"
    okText="提交"
    @ok="submit"
    @cancel="cancel"
    width="50%"
  >
    <a-descriptions>
      <a-descriptions-item label="员工编号">Zhou Maomao</a-descriptions-item>
      <a-descriptions-item label="员工名称">{{
        userInfo.userName
      }}</a-descriptions-item>
      <a-descriptions-item label="登录名">{{
        userInfo.loginName
      }}</a-descriptions-item>
      <a-descriptions-item label="所属部门">{{
        userInfo.departmentName
      }}</a-descriptions-item>
      <a-descriptions-item label="所属机构">
        {{ userInfo.departmentName }}
      </a-descriptions-item>
      <a-descriptions-item label="岗位">
        1111
      </a-descriptions-item>
      <a-descriptions-item label="联系电话">
        {{ userInfo.phone }}
      </a-descriptions-item>
      <a-descriptions-item label="邮箱">
        {{ userInfo.email }}
      </a-descriptions-item>
      <a-descriptions-item label="职称">
        1111
      </a-descriptions-item>
      <a-descriptions-item label="是否启用">
        {{ userInfo.status ? "启用" : "禁用" }}
      </a-descriptions-item>
      <a-descriptions-item label="排序">
        1111
      </a-descriptions-item>
      <a-descriptions-item label="出生年月日">
        1111
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        1111
      </a-descriptions-item>
      <a-descriptions-item label="更新时间">
        1111
      </a-descriptions-item>
      <a-descriptions-item label="地址">
        {{ userInfo.address }}
      </a-descriptions-item>
    </a-descriptions>
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
    return {
      getDetail,
      userInfo
    };
  }
});
</script>

<template>
  <a-modal
    :visible="visible"
    :title="isEdit ? '编辑用户' : '新增用户'"
    cancelText="取消"
    okText="提交"
    @ok="submit"
    @cancel="cancel"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="formRules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item ref="departmentName" label="所属部门">
        {{ department.departmentName }}
      </a-form-item>

      <a-form-item ref="userName" label="用户名称" name="userName">
        <a-input v-model:value="formState.userName" autocomplete="off" />
      </a-form-item>

      <a-form-item ref="loginName" label="登录名称" name="loginName">
        <a-input v-model:value="formState.loginName" autocomplete="off" />
      </a-form-item>

      <a-form-item
        ref="loginPassword"
        label="登录密码"
        name="loginPassword"
        v-if="!isEdit"
      >
        <a-input v-model:value="formState.loginPassword" autocomplete="off" />
      </a-form-item>

      <a-form-item ref="userType" label="用户类型" name="userType">
        <a-select
          style="min-width: 150px"
          v-model:value="formState.userType"
          class="pro-query-select"
        >
          <a-select-option
            :key="index"
            v-for="(item, index) in list"
            :value="item.value"
            >{{ item.text }}</a-select-option
          >
        </a-select>
      </a-form-item>

      <a-form-item label="权限部门" name="privilegeDepartmentId">
        <a-tree-select
          v-model:value="formState.privilegeDepartmentId"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="treeData"
          placeholder="请选择权限部门"
          :replaceFields="replaceFields"
          :disabled="!userInfo.isAdmin"
          tree-default-expand-all
        >
        </a-tree-select>
      </a-form-item>
      <a-form-item ref="phone" label="联系电话" name="phone">
        <a-input v-model:value="formState.phone" autocomplete="off" />
      </a-form-item>

      <a-form-item ref="address" label="地址" name="address">
        <a-input v-model:value="formState.address" autocomplete="off" />
      </a-form-item>

      <a-form-item ref="email" label="邮箱" name="email">
        <a-input v-model:value="formState.email" autocomplete="off" />
      </a-form-item>

      <a-form-item ref="leader" label="职称" name="leader">
        <a-input v-model:value="formState.leader" autocomplete="off" />
      </a-form-item>

      <a-form-item ref="status" label="是否启用" name="status">
        <a-switch
          v-model:checked="formState.status"
          checked-children="启用"
          un-checked-children="禁用"
        />
      </a-form-item>
      <a-form-item label="性别" name="sex">
        <a-radio-group v-model:value="formState.sex">
          <a-radio value="1">男</a-radio>
          <a-radio value="2">女</a-radio>
          <a-radio value="0">未知</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item ref="date" label="出生年月日" name="date">
        <a-date-picker
          v-model:value="formState.date"
          format="YYYY-MM-DD"
          type="date"
          placeholder="选择出生年月日"
        />
      </a-form-item>

      <a-form-item ref="description" label="描述" name="description">
        <a-textarea
          v-model:value="formState.description"
          autocomplete="off"
          showCount
          :maxlength="50"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import { saveUser, updateUser, getUserInfo } from "@/api/module/staff";
import { defineComponent, reactive, ref, toRaw, computed } from "vue";
import { queryList } from "@/api/module/department";
export default defineComponent({
  props: {
    visible: {
      type: Boolean
    },
    record: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    department: {
      type: Object
    }
  },
  emit: ["close"],
  setup(props, context) {
    const treeData = ref([]);
    const loading = ref(false);
    const formRef = ref();
    const saveKey = "save";
    let replaceFields = reactive({
      title: "departmentName",
      key: "organiseId",
      children: "childDepartments",
      value: "organiseId"
    });
    const { getters } = useStore();
    const userInfo = computed(() => JSON.parse(getters.userInfo)); // 当前登录人信息
    const list = [
      { text: "系统用户", value: 1 },
      { text: "普通用户", value: 2 },
      { text: "其他", value: 3 }
    ];
    const formRules = {
      loginName: [
        { required: true, message: "请输入登录名称", trigger: "blur" }
      ],
      loginPassword: [
        { required: true, message: "请输入登录密码", trigger: "blur" }
      ],
      phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
      userName: [
        { required: true, message: "请输入用户名称", trigger: "blur" }
      ],
      sex: [
        {
          required: true,
          message: "请选择性别",
          trigger: "change"
        }
      ],
      userType: [
        {
          required: true,
          message: "请选择用户类型",
          trigger: "change",
          type: "number"
        }
      ]
    };

    const formState = reactive({
      address: "",
      departmentId: props.department.departmentId, // 部门ID
      description: "",
      email: "",
      loginName: "",
      loginPassword: "123456",
      organiseId: props.department.organiseId, // 机构编码
      phone: "",
      privilegeDepartmentId: props.department.organiseId, // 权限部门编码
      sex: 0, // 性别
      status: true, // 用户状态
      userName: "", // 用户名称
      userType: 1 // 用户类型
    });
    const submit = e => {
      message.loading({ content: "提交中...", key: saveKey });
      formRef.value
        .validate()
        .then(() => {
          const params = JSON.parse(JSON.stringify(formState)); ///copy一下
          if (props.isEdit) {
            updateAppSubmit(params);
          } else {
            addAppSubmit(params);
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    };
    const queryTreeList = async () => {
      const data = await queryList({ departmentId: 100 });
      treeData.value = [data.data];
    };
    queryTreeList();
    const addAppSubmit = params => {
      saveUser(toRaw(params)).then(response => {
        if (response.success) {
          message
            .success({ content: "保存成功", key: saveKey, duration: 1 })
            .then(() => {
              context.emit("reload");
              cancel();
            });
        } else {
          message
            .success({ content: "保存失败", key: saveKey, duration: 1 })
            .then(() => {
              cancel();
            });
        }
      });
    };

    const updateAppSubmit = params => {
      updateUser(toRaw({ ...params, userId: props.record.userId })).then(
        response => {
          if (response.success) {
            message
              .success({ content: "保存成功", key: saveKey, duration: 1 })
              .then(() => {
                context.emit("reload");
                cancel();
              });
          } else {
            message
              .success({ content: "保存失败", key: saveKey, duration: 1 })
              .then(() => {
                cancel();
              });
          }
        }
      );
    };

    const getCurUserInfo = async userId => {
      const { data } = await getUserInfo({ userId });
      initForm(data);
    };

    // 初始化表单
    const initForm = data => {
      for (const key in formState) {
        const _data = data;
        if (key === "userType") {
          formState[key] = _data[key].value;
        } else if (key === "sex") {
          formState[key] = _data[key].value + '';
        } else {
          formState[key] = _data[key];
        }
      }
    };

    if (props.isEdit && props.record.userId) {
      getCurUserInfo(props.record.userId);
    }
    const cancel = e => {
      formRef.value.resetFields();
      context.emit("close", false);
    };

    return {
      submit,
      cancel,
      formRules,
      formRef,
      formState,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading,
      addAppSubmit,
      updateAppSubmit,
      initForm,
      list,
      userInfo,
      treeData,
      queryTreeList,
      replaceFields,
      getCurUserInfo
    };
  }
});
</script>

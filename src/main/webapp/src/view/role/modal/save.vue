<template>
  <a-modal
    :visible="visible"
    :title="isEdit ? '编辑角色' : '新增角色'"
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
      <a-form-item ref="roleName" label="角色名称" name="roleName">
        <a-input v-model:value="formState.roleName" />
      </a-form-item>
      <a-form-item ref="roleType" label="角色类型" name="roleType">
        <a-select
          style="min-width: 150px"
          v-model:value="formState.roleType"
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
      <a-form-item ref="roleKey" label="角色权限字符串" name="roleKey">
        <a-input
          v-model:value="formState.roleKey"
          placeholder="角色的英文单词"
        />
      </a-form-item>
      <a-form-item label="是否公共角色" name="publicAttribute">
        <a-switch v-model:checked="formState.publicAttribute" />
      </a-form-item>
      <a-form-item label="默认拥有该角色" name="isFlag">
        <a-switch v-model:checked="formState.isFlag" />
      </a-form-item>

      <a-form-item label="描述" name="description">
        <a-textarea v-model:value="formState.description" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { message } from "ant-design-vue";
import { save, edit, getRoleInfo } from "@/api/module/role";
import { defineComponent, reactive, ref, toRaw } from "vue";
const saveKey = "save";
export default defineComponent({
  props: {
    visible: {
      type: Boolean
    },
    record: {
      type: Object
    },
    isEdit: {
      type: Boolean
    }
  },
  emit: ["close"],
  setup(props, context) {
    const list = [
      { text: "系统角色", value: "S" },
      { text: "业务角色", value: "B" }
    ];
    const formRef = ref();
    const formState = reactive({
      publicAttribute: true,
      isFlag: false,
      roleName: "",
      roleKey: "",
      roleType: null,
      description: null
    });

    const formRules = {
      roleName: [
        { required: true, message: "请输入角色名称", trigger: "blur" }
      ],
      roleKey: [
        { required: true, message: "请输入角色权限字符串", trigger: "blur" }
      ],
      roleType: [
        {
          required: true,
          message: "请选择角色类型",
          trigger: "change"
        }
      ]
    };

    const submit = e => {
      formRef.value
        .validate()
        .then(() => {
          if (!props.isEdit) {
            save(toRaw(formState)).then(response => {
              if (response.success) {
                message
                  .success({ content: "保存成功", duration: 1 })
                  .then(() => {
                    cancel();
                  });
              } else {
                message
                  .success({ content: "保存失败", duration: 1 })
                  .then(() => {
                    cancel();
                  });
              }
            });
          } else {
            updateAppSubmit(toRaw(formState));
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    };

    // 初始化表单
    const initForm = data => {
      for (const key in formState) {
        const _data = data;
        if (key === "roleType") {
          formState[key] = _data[key].value;
        } else {
          formState[key] = _data[key];
        }
      }
    };

    const getCurRoleInfo = async () => {
      const { data } = await getRoleInfo({ roleId: props.record.roleId });
      initForm(data);
    };
    // 编辑时获取
    if (props.isEdit && props.record.roleId) {
      getCurRoleInfo();
    }
    const updateAppSubmit = params => {
      edit(toRaw({ ...params, roleId: props.record.roleId })).then(response => {
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
    const cancel = e => {
      formRef.value.resetFields();
      context.emit("close", false);
    };

    return {
      submit,
      cancel,
      formRef,
      formState,
      formRules,
      list,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      updateAppSubmit,
      initForm,
      getCurRoleInfo
    };
  }
});
</script>

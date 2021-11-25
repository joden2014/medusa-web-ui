<template>
  <a-modal
    :visible="visible"
    :title="isEdit ? '编辑部门' : '新增部门'"
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
      <a-form-item
        ref="departmentFullName"
        label="部门全称"
        name="departmentFullName"
      >
        <a-input
          v-model:value="formState.departmentFullName"
          autocomplete="off"
        />
      </a-form-item>

      <a-form-item ref="departmentName" label="部门简称" name="departmentName">
        <a-input v-model:value="formState.departmentName" autocomplete="off" />
      </a-form-item>

      <a-form-item ref="isOrganise" label="是否为机构" name="isOrganise">
        <a-switch
          v-model:checked="formState.isOrganise"
          checked-children="是"
          un-checked-children="否"
        />
      </a-form-item>

      <a-form-item
        ref="parentDepartmentId"
        label="上级部门编码"
        name="parentDepartmentId"
      >
        <a-input
          v-model:value="formState.parentDepartmentId"
          autocomplete="off"
          disabled
        />
      </a-form-item>
      <a-form-item ref="leader" label="负责人" name="leader">
        <a-input v-model:value="formState.leader" autocomplete="off"/>
      </a-form-item>

      <a-form-item ref="email" label="邮箱" name="email">
        <a-input v-model:value="formState.email" autocomplete="off"/>
      </a-form-item>

      <a-form-item ref="sort" label="排序" name="sort">
        <a-input v-model:value="formState.sort" autocomplete="off" />
      </a-form-item>

      <a-form-item ref="phone" label="联系电话" name="phone">
        <a-input v-model:value="formState.phone" autocomplete="off" />
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
import { message } from "ant-design-vue";
import { saveDep, updateDep } from "@/api/module/department";
import { defineComponent, reactive, ref, toRaw } from "vue";
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
    }
  },
  emit: ["close"],
  setup(props, context) {
    const loading = ref(false);
    const formRef = ref();
    const saveKey = "save";
    const formRules = {
      departmentFullName: [
        { required: true, message: "请输入部门全称", trigger: "blur" }
      ],
      departmentName: [
        { required: true, message: "请输入部门简称", trigger: "blur" }
      ],
      isOrganise: [
        {
          required: true,
          message: "请选择机构类型",
          trigger: "change",
          type: "boolean"
        }
      ],
      parentDepartmentId: [
        {
          required: true,
          message: "请输入上级部门编码",
          trigger: "blur",
          type: "number"
        }
      ]
    };

    const formState = reactive({
      departmentFullName: "",
      departmentName: "",
      description: "",
      email: "",
      isOrganise: false,
      leader: "",
      parentDepartmentId: props.record.departmentId,
      phone: "",
      sort: 0
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

    const addAppSubmit = params => {
      saveDep(toRaw(params)).then(response => {
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
      updateDep(
        toRaw({ ...params, departmentId: props.record.departmentId })
      ).then(response => {
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
    // 初始化表单
    const initForm = () => {
      for (const key in formState) {
        const _data = props.record;
        formState[key] = _data[key];
      }
    };
    if (props.isEdit) {
      initForm();
    }
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
      initForm
    };
  }
});
</script>

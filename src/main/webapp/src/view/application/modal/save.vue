<template>
  <a-modal
    :visible="visible"
    title="新增应用"
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
      <a-form-item ref="applicationName" label="应用名称" name="applicationName">
        <a-input v-model:value="formState.applicationName" />
      </a-form-item>
      <a-form-item ref="description" label="应用描述" name="description">
        <a-textarea v-model:value="formState.description" />
      </a-form-item>
      <a-form-item ref="applicationType" label="应用类型" name="applicationType">
        <a-select style="min-width:150px" v-model:value="formState.applicationType" class="pro-query-select">
            <a-select-option :key="index" v-for="(item, index) in list" :value="item.value">{{item.text}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item ref="sort" label="排序" name="sort">
        <a-input v-model:value="formState.sort" />
      </a-form-item>
      <a-form-item ref="date" label="生效时间" name="date" required>
        <a-range-picker v-model:value="formState.date" :placeholder="['开始时间', '结束时间']" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { message } from 'ant-design-vue';
import { addApp } from "@/api/module/application";
import { defineComponent, reactive, ref, toRaw } from "vue";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
    },
  },
  emit: ["close"],
  setup(props, context) {
    const formRef = ref();
    const that = this
    const saveKey = "save";
    const formRules = {
      applicationName: [ { required: true, message: '请输入应用名称', trigger: 'blur'} ],
      description: [ { required: true, message: '请输入应用描述', trigger: 'blur'} ],
      applicationType: [ { required: true, message: '请输入应用类型', trigger: 'change'} ],
      // date: [ { required: true, message: '请输入日期', trigger: 'change', type: 'object',} ],
      sort: [ { required: true, message: '请输入排序', trigger: 'blur'} ]
    };
    const formState = reactive({
      applicationName1: '',
      description: '',
      applicationType: '1',
      sort: null,
      date: null
    })
    const list = [{ text: '项目级', value: '1' }, { text: '公司级', value: '2' }, { text: '集团级', value: '3' }]
    const submit = (e) => {
      message.loading({ content: '提交中...', key: saveKey });
      formRef.value
        .validate()
        .then(() => {
          addApp(toRaw(formState)).then((response)=>{
              if(response.success){
                message.success({ content: '保存成功', key: saveKey, duration: 1 }).then(()=>{
                  cancel();
                });
              }else{
                message.success({ content: '保存失败', key: saveKey, duration: 1 }).then(()=>{
                  cancel();
                });
              }
          });
        })
        .catch(error => {
          console.log('error', error);
        });
    };

    const cancel = (e) => {
      formRef.value.resetFields();
      context.emit("close", false);
    };
    return {
      submit,
      cancel,
      formRules,
      formRef,
      formState,
      list,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
  },
});
</script>
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
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item ref="applicationName" label="应用名称" name="applicationName">
        <a-input v-model:value="formState.applicationName" />
      </a-form-item>
      <a-form-item ref="description" label="应用描述" name="description">
        <a-textarea v-model:value="formState.description" />
      </a-form-item>
    <a-form-item label="应用类型" name="applicationType">
      <a-select v-model:value="formState.applicationType" placeholder="选择应用类型">
        <a-select-option value="shanghai">Zone one</a-select-option>
        <a-select-option value="beijing">Zone two</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="排序" name="sort1">
        <a-input-number v-model:value="formState.sort1" :min="1" />
      </a-form-item>
      <a-form-item label="生效时间" name="date">
        <a-range-picker :placeholder="['开始时间', '结束时间']" v-model:value="formState.date"/>
      </a-form-item>
    <a-form-item label="Activity time" required name="date1">
      <a-date-picker
        v-model:value="formState.date1"
        show-time
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
      />
    </a-form-item>
    <a-form-item label="Instant delivery" name="delivery">
      <a-switch v-model:checked="formState.delivery" />
    </a-form-item>
    <a-form-item label="Activity type" name="type">
      <a-checkbox-group v-model:value="formState.type">
        <a-checkbox value="1" name="type">Online</a-checkbox>
        <a-checkbox value="2" name="type">Promotion</a-checkbox>
        <a-checkbox value="3" name="type">Offline</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item label="Resources" name="resource">
      <a-radio-group v-model:value="formState.resource">
        <a-radio value="1">Sponsor</a-radio>
        <a-radio value="2">Venue</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">Create</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
    </a-form-item>
  </a-form>
  </a-modal>
</template>

<script>
import { message } from 'ant-design-vue';
import { save } from "@/api/module/announce";
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
    const list = [{ text: '项目级', value: 1 }, { text: '公司级', value:2 }, { text: '集团级', value: 3 }]
    const formState = reactive({
    applicationName: '',
      description: '',
      applicationType: undefined,
      date1: undefined,
      date: undefined,
      sort1: 1,
      delivery: false,
      type: [],
      resource: '',
      desc: '',
    });
    const rules = {
      name: [
        {
          required: true,
          message: 'Please input Activity name',
          trigger: 'blur',
        },
        {
          min: 3,
          max: 5,
          message: 'Length should be 3 to 5',
          trigger: 'blur',
        },
      ],
      applicationType: [
        {
          required: true,
          message: 'Please select Activity zone',
          trigger: 'change',
        },
      ],
      date1: [
        {
          required: true,
          message: 'Please pick a date',
          trigger: 'change',
          type: 'object',
        },
      ],
      date: [
        {
          required: true,
          message: 'Please pick a date',
          trigger: 'change',
          type: 'object',
        },
      ],
      type: [
        {
          type: 'array',
          required: true,
          message: 'Please select at least one activity type',
          trigger: 'change',
        },
      ],
      resource: [
        {
          required: true,
          message: 'Please select activity resource',
          trigger: 'change',
        },
      ],
      sort: [
        {
          required: true,
          message: 'Please input activity form',
          trigger: 'blur',
        },
      ],
    };

    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          console.log('values', formState, toRaw(formState));
        })
        .catch(error => {
          console.log('error', error);
        });
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    return {
      formRef,
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
      other: '',
      formState,
      rules,
      onSubmit,
      resetForm,
      list
    };
  },
});
</script>
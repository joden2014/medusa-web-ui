<template>
  <a-modal
    :visible="visible"
    :title="Object.keys(record).length ? '编辑应用' : '新增应用'"
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
        ref="applicationCode"
        label="应用编码"
        name="applicationCode"
      >
        <a-input v-model:value="formState.applicationCode" autocomplete="off" />
      </a-form-item>

      <a-form-item
        ref="applicationName"
        label="应用名称"
        name="applicationName"
      >
        <a-input v-model:value="formState.applicationName" autocomplete="off" />
      </a-form-item>

      <a-form-item ref="description" label="应用描述" name="description">
        <a-textarea v-model:value="formState.description" />
      </a-form-item>

      <a-form-item
        ref="applicationType"
        label="应用类型"
        name="applicationType"
      >
        <a-select
          style="min-width: 150px"
          v-model:value="formState.applicationType"
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
      <a-form-item label="状态" name="status">
        <a-switch
          v-model:checked="formState.status"
          checked-children="开启"
          un-checked-children="禁用"
        />
      </a-form-item>
      <a-form-item ref="sort" label="排序" name="sort">
        <a-input v-model:value="formState.sort" autocomplete="off" />
      </a-form-item>

      <a-form-item ref="date" label="生效时间" name="date">
        <a-range-picker
          v-model:value="formState.date"
          :show-time="{ format: 'HH:mm:ss' }"
          format="YYYY-MM-DD HH:mm:ss"
          :placeholder="['开始时间', '结束时间']"
        />
      </a-form-item>

      <a-form-item ref="linkUrl" label="应用链接" name="linkUrl">
        <a-input v-model:value="formState.linkUrl" autocomplete="off" />
      </a-form-item>

      <!-- <a-form-item label="应用logo">
        <a-upload
          v-model:file-list="fileList"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">上传ICO</div>
          </div>
        </a-upload>
      </a-form-item> -->
    </a-form>
  </a-modal>
</template>
<script>
import { message } from "ant-design-vue";
import { addApp, getAppById, updateApp } from "@/api/module/application";
import { defineComponent, reactive, ref, toRaw } from "vue";
import moment from "moment";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

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
    const fileList = ref([]);
    const loading = ref(false);
    const imageUrl = ref("");
    const handleChange = info => {
      if (info.file.status === "uploading") {
        loading.value = true;
        return;
      }

      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, base64Url => {
          imageUrl.value = base64Url;
          loading.value = false;
        });
      }

      if (info.file.status === "error") {
        loading.value = false;
        message.error("上传失败");
      }
    };

    const beforeUpload = file => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";

      if (!isJpgOrPng) {
        message.error("只能上传JPG格式!");
      }

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        message.error("不能超过2MB!");
      }

      return isJpgOrPng && isLt2M;
    };

    const formRef = ref();
    const that = this;
    const saveKey = "save";
    const formRules = {
      applicationName: [
        { required: true, message: "请输入应用名称", trigger: "blur" }
      ],
      description: [
        { required: true, message: "请输入应用描述", trigger: "blur" }
      ],
      applicationType: [
        { required: true, message: "请输入应用类型", trigger: "change" }
      ],
      sort: [{ required: true, message: "请输入排序", trigger: "blur" }]
    };

    const formState = reactive({
      applicationName: "",
      description: "",
      applicationType: "1",
      sort: null,
      startTime: null,
      endTime: null,
      linkUrl: null,
      status: false,
      applicationCode: null // 应用编码
    });
    const list = [
      { text: "项目级", value: "1" },
      { text: "公司级", value: "2" },
      { text: "集团级", value: "3" }
    ];
    const submit = e => {
      message.loading({ content: "提交中...", key: saveKey });
      formRef.value
        .validate()
        .then(() => {
          if (formState.date && formState.date.length) {
            const [startTime, endTime] = formState.date;
            formState.startTime = moment(startTime).format(
              "YYYY-MM-DD hh:mm:ss"
            );
            formState.endTime = moment(endTime).format("YYYY-MM-DD hh:mm:ss");
          }
          const params = JSON.parse(JSON.stringify(formState)); ///copy一下
          delete params.date;
          if (props.record.applicationId) {
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
      addApp(toRaw(params)).then(response => {
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
      updateApp(
        toRaw({ ...params, applicationId: props.record.applicationId })
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

    const getDetail = async () => {
      const _data = await getAppById({
        applicationId: props.record.applicationId
      });
      for (const key in formState) {
        if (key === "applicationType") {
          formState[key] = _data.data[key].value + "";
        } else if (
          key === "startTime" &&
          _data.data["startTime"] &&
          _data.data["endTime"]
        ) {
          formState.date = [
            moment(_data.data["startTime"]),
            moment(_data.data["endTime"])
          ];
        } else if (key === "sort") {
          formState[key] = _data.data[key] + "";
        } else {
          formState[key] = _data.data[key];
        }
      }
    };

    if (props.record.applicationId) {
      getDetail();
    }
    return {
      submit,
      cancel,
      formRules,
      formRef,
      formState,
      list,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      handleChange,
      beforeUpload,
      fileList,
      loading,
      imageUrl,
      getDetail,
      addAppSubmit,
      updateAppSubmit
    };
  }
});
</script>

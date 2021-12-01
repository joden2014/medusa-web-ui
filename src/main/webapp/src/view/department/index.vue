<template>
  <page-layout>
    <a-row type="flex" class="content">
      <a-col flex="1" class="left-content">
        <a-card :bordered="false">
          <a-input-search
            v-model:value="searchValue"
            style="margin-bottom: 8px"
            placeholder="筛选部门"
          />
          <div class="tree-content">
            <a-tree
              :tree-data="gData"
              v-if="gData.length"
              @select="onSelect"
              :replaceFields="replaceFields"
              v-model:selectedKeys="selectedKeys"
              defaultExpandAll
            ></a-tree>
          </div>
        </a-card>
      </a-col>
      <a-col flex="2" class="right-content">
        <a-card :bordered="false">
          <a-row type="flex">
            <a-col :span="12">
              <a-button type="primary" size="large" @click="add(false)">
                <template #icon>
                  <PlusOutlined />
                </template>
                新建
              </a-button>
            </a-col>
            <a-col :span="12">
              <a-row type="flex" justify="end">
                <a-col v-if="state.recordEdit.isOrganise">
                  <div class="upload-icon">
                    <a-upload
                      :action="uploadLogoUrl"
                      list-type="picture-card"
                      v-model:file-list="fileList"
                      :data="{
                        departmentId: state.recordEdit.departmentId
                      }"
                      :headers="headers"
                      @preview="handlePreview"
                    >
                      <div v-if="fileList.length < 1" class="upload-file">
                        <plus-outlined />
                        <div class="ant-upload-text">上传LOGO图片</div>
                      </div>
                    </a-upload>
                    <a-modal
                      :visible="previewVisible"
                      :footer="null"
                      @cancel="handleCancel"
                    >
                      <img
                        alt="example"
                        style="width: 100%"
                        :src="previewImage"
                      />
                    </a-modal>
                  </div>
                </a-col>
                <a-col class="btns">
                  <a-button type="primary" size="large" @click="add(true)">
                    修改
                  </a-button>
                  <a-button
                    size="large"
                    @click="remove(state.recordEdit.departmentId)"
                  >
                    删除
                  </a-button>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row type="flex" class="flex" wrap>
            <a-col :span="8" class="flex-item"
              >部门编码：{{ state.recordEdit.organiseId }}</a-col
            >
            <a-col :span="8" class="flex-item"
              >部门名称：{{ state.recordEdit.departmentName }}</a-col
            >
            <a-col :span="8" class="flex-item"
              >部门全称：{{ state.recordEdit.departmentFullName }}</a-col
            >
            <a-col :span="8" class="flex-item"
              >部门上级名称：{{ state.recordEdit.departmentFullName }}</a-col
            >
            <a-col :span="8" class="flex-item"
              >是否启用：{{ state.recordEdit.status ? "是" : "否" }}</a-col
            >
            <a-col :span="8" class="flex-item"
              >是否机构：{{ state.recordEdit.isOrganise ? "是" : "否" }}</a-col
            >
            <a-col :span="8" class="flex-item"
              >负责人：{{ state.recordEdit.leader }}</a-col
            >
            <!-- <a-col :span="8" class="flex-item">更新时间：2021-10-23</a-col> -->
            <a-col :span="8" class="flex-item"
              >排序：{{ state.recordEdit.sort }}</a-col
            >
            <a-col :span="8" class="flex-item"
              >部门层级：{{ state.recordEdit.level }}</a-col
            >
            <!-- <a-col :span="8" class="flex-item">是否虚拟部门：是</a-col> -->
          </a-row>
          <a-row type="flex" class="flex border">
            <a-col :span="24" class="flex-item"
              >描述：{{ state.recordEdit.description }}</a-col
            >
          </a-row>
          <h3 class="title">基础信息配置</h3>
          <a-row type="flex" class="flex" wrap>
            <a-col :span="8" class="flex-item">企业邮箱：-</a-col>
            <a-col :span="16" class="flex-item">备案号：-</a-col>
            <a-col :span="8" class="flex-item">客服电话：-</a-col>
            <a-col :span="16" class="flex-item">企业网站：-</a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <save
      :visible="state.visibleSave"
      @close="closeSave"
      @reload="reload"
      :record="state.recordEdit"
      :isEdit="state.isEdit"
      v-if="state.visibleSave"
    ></save>
  </page-layout>
</template>

<script>
import { message, Modal } from "ant-design-vue";
import save from "./modal/save";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref, watch, reactive, createVNode } from "vue";
import {
  queryList,
  getDepById,
  deleteDep,
  uploadLogo
} from "@/api/module/department";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default defineComponent({
  components: { PlusOutlined, save },
  setup() {
    const uploadLogoUrl = ref(uploadLogo);
    const previewVisible = ref(false);
    const previewImage = ref("");
    const fileList = ref([]);
    const searchValue = ref("");
    const autoExpandParent = ref(true);
    const gData = ref([]);
    const selectedKeys = ref(["100"]); // 选中
    const token = localStorage.getItem("token");
    const headers = ref({
      Authorization: `Bearer ${token}`
    });
    let replaceFields = reactive({
      title: "departmentName",
      key: "departmentId",
      children: "childDepartments"
    });
    // 选中书节点触发
    const onSelect = (keys, { node }) => {
      selectedKeys.value = keys;
      getDepDetail(node.dataRef.departmentId);
    };

    watch(searchValue, value => {});

    const handleCancel = () => {
      previewVisible.value = false;
    };

    const handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
    };

    const handleChange = ({ fileList: newFileList }) => {
      fileList.value = newFileList;
    };
    function initTree(list) {
      const loop = _list => {
        _list.map(v => {
          v.departmentId = v.departmentId + ""; // 转成字符串
          if (v.childDepartments && v.childDepartments.length) {
            loop(v.childDepartments);
          }
        });
      };
      loop(list);
      return list;
    }
    const queryTreeList = async () => {
      const data = await queryList({ departmentId: 100 });
      const list = [data.data];
      gData.value = initTree(list);
    };

    const state = reactive({
      selectedRowKeys: [],
      param: {},
      visibleSave: false,
      recordEdit: {},
      isEdit: false
    });
    queryTreeList();
    const reload = () => {
      getDepDetail(selectedKeys.value[0]);
      queryTreeList();
    };
    // 获取详情
    const getDepDetail = async departmentId => {
      const { data } = await getDepById({ departmentId });
      state.recordEdit = data;
    };
    getDepDetail(selectedKeys.value[0]);

    const add = type => {
      state.isEdit = type;
      state.visibleSave = true;
    };

    const remove = async departmentId => {
      Modal.confirm({
        title: "删除部门",
        icon: createVNode(ExclamationCircleOutlined),
        content: "你确定要删除吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: async () => {
          await deleteDep({ departmentId });
          selectedKeys.value = ["100"];
          getDepDetail(selectedKeys.value[0]);
          queryTreeList();
        }
      });
    };
    const closeSave = function() {
      state.visibleSave = false;
    };
    return {
      searchValue,
      autoExpandParent,
      gData,
      onSelect,
      fileList,
      previewVisible,
      previewImage,
      handleCancel,
      handlePreview,
      handleChange,
      queryTreeList,
      replaceFields,
      state,
      getDepDetail,
      selectedKeys,
      add,
      closeSave,
      remove,
      reload,
      uploadLogoUrl,
      headers
    };
  }
});
</script>

<style lang="less" scoped>
.tree-content {
  border-right: 1px solid #e8e8e8;
}
.btns {
  .ant-btn {
    margin: 0 6px;
  }
}
.upload-icon {
  margin-right: 6px;
  /deep/ .ant-upload.ant-upload-select-picture-card {
    height: 40px;
    width: 120px;
    margin: 0;
    .ant-upload-text {
      font-size: 12px;
    }
    .upload-file {
      display: flex;
      align-items: center;
    }
  }
  /deep/ .ant-upload-list-picture-card-container {
    height: 40px;
    width: 120px;
    margin: 0;
  }
  /deep/ .ant-upload-list-picture-card .ant-upload-list-item {
    height: 40px;
    width: 120px;
  }
}
.content {
  background: #fff;
  height: calc(100vh - 100px);
  overflow: auto;
}
.title {
  border-left: 3px solid #2d8cf0;
  padding-left: 10px;
  margin-top: 20px;
}
.flex {
  &.border {
    border-top: 1px solid #e8e8e8;
    margin-top: 20px;
  }
  .flex-item {
    margin-top: 20px;
    overflow: hidden;
  }
}
</style>

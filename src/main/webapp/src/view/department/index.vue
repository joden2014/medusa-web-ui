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
            <a-tree :tree-data="gData" @expand="onExpand" defaultExpandAll>
              <template #title="{ title }">
                <span v-if="title.indexOf(searchValue) > -1">
                  {{ title.substr(0, title.indexOf(searchValue)) }}
                  <span style="color: #f50">{{ searchValue }}</span>
                  {{
                    title.substr(
                      title.indexOf(searchValue) + searchValue.length
                    )
                  }}
                </span>
                <span v-else>{{ title }}</span>
              </template>
            </a-tree>
          </div>
        </a-card>
      </a-col>
      <a-col flex="2" class="right-content">
        <a-card :bordered="false">
          <a-row type="flex">
            <a-col :span="12">
              <a-button type="primary" size="large">
                <template #icon>
                  <PlusOutlined />
                </template>
                新建
              </a-button>
            </a-col>
            <a-col :span="12">
              <a-row type="flex" justify="end">
                <a-col>
                  <div class="upload-icon">
                    <a-upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      list-type="picture-card"
                      v-model:file-list="fileList"
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
                  <a-button type="primary" size="large"> 修改 </a-button>
                  <a-button size="large"> 删除 </a-button>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row type="flex" class="flex" wrap>
            <a-col :span="8" class="flex-item">部门编码：111</a-col>
            <a-col :span="8" class="flex-item">部门名称：顶顶顶</a-col>
            <a-col :span="8" class="flex-item">部门全称：2222</a-col>
            <a-col :span="8" class="flex-item">部门上级名称：顶顶顶顶顶1</a-col>
            <a-col :span="8" class="flex-item">是否启用：是</a-col>
            <a-col :span="8" class="flex-item">是否机构：是</a-col>
            <a-col :span="8" class="flex-item">创建时间：2021-09-22</a-col>
            <a-col :span="8" class="flex-item">更新时间：2021-10-23</a-col>
            <a-col :span="8" class="flex-item">排序：1</a-col>
            <a-col :span="8" class="flex-item">部门层级：2</a-col>
            <a-col :span="8" class="flex-item">是否虚拟部门：是</a-col>
          </a-row>
          <a-row type="flex" class="flex border">
            <a-col :span="24" class="flex-item">描述：111</a-col>
          </a-row>
          <h3 class="title">基础信息配置</h3>
          <a-row type="flex" class="flex" wrap>
            <a-col :span="8" class="flex-item">企业邮箱：xxx@aa.com</a-col>
            <a-col :span="16" class="flex-item">备案号：皖ICP备xxx-号</a-col>
            <a-col :span="8" class="flex-item">客服电话：12229999</a-col>
            <a-col :span="16" class="flex-item">企业网站：www.baidu.coom</a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </page-layout>
</template>

<script>
import { PlusOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref, watch } from "vue";
import { queryList } from "@/api/module/department";
const x = 3;
const y = 2;
const z = 1;
const genData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || "0";
  const tns = _tns || genData;
  const children = [];

  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({
      title: key,
      key,
    });

    if (i < y) {
      children.push(key);
    }
  }

  if (_level < 0) {
    return tns;
  }

  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};

generateData(z);
const dataList = [];

const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({
      key,
      title: key,
    });

    if (node.children) {
      generateList(node.children);
    }
  }
};

generateList(genData);

const getParentKey = (key, tree) => {
  let parentKey;

  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];

    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }

  return parentKey;
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });
}

export default defineComponent({
  components: { PlusOutlined },
  setup() {
    const previewVisible = ref(false);
    const previewImage = ref("");
    const fileList = ref([]);
    const expandedKeys = ref([]);
    const searchValue = ref("");
    const autoExpandParent = ref(true);
    const gData = ref(genData);

    const onExpand = (keys) => {
      expandedKeys.value = keys;
      autoExpandParent.value = false;
    };

    watch(searchValue, (value) => {
      const expanded = dataList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData.value);
          }

          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      expandedKeys.value = expanded;
      searchValue.value = value;
      autoExpandParent.value = true;
    });

    const handleCancel = () => {
      previewVisible.value = false;
    };

    const handlePreview = async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
    };

    const handleChange = ({ fileList: newFileList }) => {
      fileList.value = newFileList;
    };

    const queryTreeList = async () => {
      const data = await queryList({ departmentId: 100 });
      console.log(data);
    };
    queryTreeList()
    return {
      expandedKeys,
      searchValue,
      autoExpandParent,
      gData,
      onExpand,
      fileList,
      previewVisible,
      previewImage,
      handleCancel,
      handlePreview,
      handleChange,
      queryTreeList,
    };
  },
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

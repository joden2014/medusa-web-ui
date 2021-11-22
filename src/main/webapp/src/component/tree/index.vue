<template>
  <div class="tree">
    <a-tree
      show-line
      :treeData="treeData"
      :defaultExpandAll="true"
      @select.self="onSelect"
      v-if="treeData.length && treeData[0].childMenus.length"
      :replaceFields="replaceFields"
      v-model:selectedKeys="selectedKeys"
    >
      <template v-slot:title="nodeData">
        <span>{{ nodeData.menuName }}</span>
        <a-button-group class="editBox" v-if="action">
          <a-button
            type="link"
            size="small"
            @click.stop="slotAdd(nodeData)"
            v-if="nodeData.menuLevel < 2"
            title="添加"
          >
            <template #icon><PlusOutlined /></template>
          </a-button>
          <a-button
            type="link"
            size="small"
            @click.stop="slotEdit(nodeData)"
            v-if="nodeData.menuId !== 'root'"
            title="修改"
          >
            <template #icon><EditOutlined /></template>
          </a-button>
          <a-button
            type="link"
            size="small"
            @click.stop="slotDelete(nodeData)"
            v-if="nodeData.menuId !== 'root'"
            title="删除"
          >
            <template #icon><DeleteTwoTone twoToneColor="#eb2f96" /></template>
          </a-button>
        </a-button-group>
      </template>
    </a-tree>
    <a-result title="该应用暂无配置菜单" v-else>
      <template #icon>
        <FrownOutlined />
      </template>
      <template #extra>
        <a-button type="primary" @click="addMenu">配置菜单</a-button>
      </template>
    </a-result>
    <!-- 菜单数据配置弹窗 -->
    <menuOption
      :visible="state.visibleMenu"
      @close="closeMenu"
      :record="state.recordMenu"
      :menuType="editOperation"
      v-if="state.visibleMenu"
      @handle="handle"
    ></menuOption>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  nextTick,
  createVNode,
} from "vue";
import { getAppMenu, deleteMenu } from "@/api/module/application";
import { message, Modal } from "ant-design-vue";
import {
  PlusOutlined,
  EditOutlined,
  DeleteTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import menuOption from "./menuOption";
export default defineComponent({
  props: {
    action: {
      type: Boolean,
      required: false,
    },
    applicationId: {
      type: String,
      required: true,
    },
  },
  components: {
    PlusOutlined,
    EditOutlined,
    DeleteTwoTone,
    menuOption,
  },
  setup(props, { emit }) {
    const state = reactive({
      visibleMenu: false,
      recordMenu: {},
    });
    // 替换 treeNode 中 title,key,children 字段为 treeData 中对应的字段
    let replaceFields = reactive({
      title: "menuName",
      key: "menuId",
      children: "childMenus",
    });
    // 用于点击添加时总是让第一个输入框获取焦点
    let childId = ref(0);
    // tree的数据
    let treeData = ref([]);
    // 定义ref值
    let inputVal = ref(null);
    let inputTest = ref("inoputTest");
    // 输入框内容
    let inputTypeName = ref("新建类型");
    // 刷新组件
    let flag = ref(true);
    // 用于判断是点击添加还是编辑
    let editOperation = ref("");
    onMounted(() => {
      getTreeData();
    });
    const closeMenu = function () {
      const id = state.recordMenu.menuId;
      removeMenuItem(id);
      state.visibleMenu = false;
    };
    function onSelect(selectedKeys) {
      emit("onSelect", selectedKeys);
    }
    // 获取树列表
    async function getTreeData() {
      let res = await getAppMenu({ applicationId: props.applicationId });
      const data = [
        {
          menuId: "root",
          menuName: "根菜单",
          parentMenuId: 0,
          childMenus: [...res.data?.childMenus],
          menuLevel: 0,
        },
      ];
      treeData.value = data;
    }
    function getChildren(node, dataList) {
      for (let item of dataList) {
        if (!item.childMenus) {
          item.childMenus = [];
        }
        if (item.parentMenuId === node.menuId) {
          node.childMenus.push(item);
        }
      }
      if (node.childMenus === []) {
        return;
      }
      for (let child of node.childMenus) {
        getChildren(child, dataList);
      }
    }
    // 点击添加按钮
    function slotAdd(nodeItem) {
      editOperation.value = "add";
      let len = nodeItem.childMenus.length || 0;
      childId.value = len;
      const data = {
        len,
        menuId: null,
        isEdit: true,
        key: new Date().getTime(),
        parentMenuId: nodeItem.menuId === "root" ? "1" : nodeItem.menuId,
        childMenus: [],
        applicationId: props.applicationId,
        menuLevel: nodeItem.menuLevel ? nodeItem.menuLevel + 1 : 1,
        parentMenuName: nodeItem.menuName, // 新增的
      };
      //  上面这里你看下
      nodeItem.childMenus.unshift(data);
      state.recordMenu = data;
      state.visibleMenu = true;
    }

    // 点击编辑
    async function slotEdit(nodeItem) {
      editOperation.value = "edit";
      state.recordMenu = nodeItem;
      state.visibleMenu = true;
      console.log("nodeItem", nodeItem); //这是传点那个树的分支 传过来的树的属性
    }
    // 点击删除
    function slotDelete({ menuId, isNew }) {
      let params = {
        menuId,
      };
      Modal.confirm({
        title: "删除",
        icon: createVNode(ExclamationCircleOutlined),
        content: "你确定要删除吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: async () => {
          await deleteMenu(params);
          getTreeData();
        },
      });
    }
    function handle({ type, data }) {
      //   const _treeData = treeData.value;
      //   const { menuId } = state.recordMenu;
      //   function loop(list) {
      //     for (let i = 0; i < list.length; i++) {
      //       const item = list[i];
      //       if (item.menuId === menuId) {
      //         list[i] = { ...item, ...data };
      //         break;
      //       }
      //       if (list[i].childMenus && list[i].childMenus.length) {
      //         loop(list[i].childMenus);
      //       }
      //     }
      //   }
      //   if (type === "add") {
      //     loop(_treeData);
      //   }
      getTreeData();
      //   console.log(treeData.value);
    }

    function removeMenuItem(menuId, type) {
      const _treeData = treeData.value;
      function loop(list) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (
            (item.menuId === menuId && !item.menuName) ||
            (item.menuId === menuId && type)
          ) {
            list.splice(i, 1);
            break;
          }
          if (list[i].childMenus && list[i].childMenus.length) {
            loop(list[i].childMenus);
          }
        }
      }
      loop(_treeData);
    }

    function addMenu() {
      treeData.value = [
        {
          menuId: "root",
          menuName: "根菜单",
          childMenus: [],
          menuLevel: 0,
        },
      ];
      slotAdd(treeData.value[0]);
    }
    return {
      onSelect,
      treeData,
      replaceFields,
      slotAdd,
      slotEdit,
      slotDelete,
      childId,
      inputVal,
      inputTest,
      inputTypeName,
      flag,
      editOperation,
      addMenu,
      state,
      closeMenu,
      handle,
      removeMenuItem,
    };
  },
});
</script>
<style lang="less" scoped>
.editBox {
  margin-left: 7px;
}
</style>

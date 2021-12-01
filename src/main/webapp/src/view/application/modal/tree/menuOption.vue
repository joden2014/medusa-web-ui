<!--菜单相关配置-->
<template>
  <a-modal
    :visible="visible"
    :title="`${menuType === 'add' ? '新增菜单' : '编辑菜单'}`"
    cancelText="取消"
    okText="提交"
    @ok="submit"
    @cancel="cancel"
  >
    <h3>上级菜单：{{ record.parentMenuName }}</h3>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="formRules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item ref="sort" label="排序" name="sort">
        <a-input
          v-model:value="formState.sort"
          type="number"
          autocomplete="off"
        />
      </a-form-item>

      <a-form-item ref="menuName" label="菜单名称" name="menuName">
        <a-input v-model:value="formState.menuName" autocomplete="off" />
      </a-form-item>

      <a-form-item ref="menuPath" label="菜单路径" name="menuPath">
        <a-input
          v-model:value="formState.menuPath"
          autocomplete="off"
          placeholder="前端路由文件名，列如：user"
        />
      </a-form-item>

      <a-form-item ref="menuUrl" label="菜单URL" name="menuUrl">
        <a-input
          v-model:value="formState.menuUrl"
          autocomplete="off"
          placeholder="前端路由路径，列如：/user"
        />
      </a-form-item>

      <a-form-item label="是否显示" name="display">
        <a-switch
          v-model:checked="formState.display"
          checked-children="隐藏"
          un-checked-children="显示"
        />
      </a-form-item>

      <a-form-item label="图标" name="icon">
        <p-icon-picker v-model:value="formState.icon"></p-icon-picker>
      </a-form-item>

      <a-form-item ref="_perms" label="权限标识" name="_perms">
        <a-select
          v-model:value="formState._perms"
          mode="multiple"
          placeholder="请选择权限标识"
          :options="roles"
        >
        </a-select>
      </a-form-item>

      <a-form-item
        label="菜单类型"
        ref="menuType"
        name="menuType"
        v-if="menuType === 'add'"
      >
        <a-select
          style="min-width: 150px"
          v-model:value="formState.menuType"
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
    </a-form>
  </a-modal>
</template>
<script>
import { defineComponent, reactive, ref, toRaw } from "vue";
import { addMenu, getMenuById, updateMenu } from "@/api/module/application";
import { message } from "ant-design-vue";
export default defineComponent({
  props: {
    visible: {
      type: Boolean
    },
    menuType: {
      type: String,
      default: "add"
    },
    record: {
      type: Object,
      default: () => {}
    }
  },
  emit: ["close"],
  setup(props, context) {
    const formRef = ref();
    const saveKey = "save";
    const roles = ref([
      { text: "query", value: "query" },
      { text: "add", value: "add" },
      { text: "edit", value: "edit" },
      { text: "del", value: "del" }
    ]);

    const formRules = {
      menuName: [
        { required: true, message: "请输入菜单名称", trigger: "blur" }
      ],
      menuPath: [
        { required: true, message: "请输入菜单路径", trigger: "blur" }
      ],
      menuUrl: [{ required: true, message: "请输入菜单URL", trigger: "blur" }],
      menuType: [
        {
          required: props.menuType === "add",
          message: "请选择菜单类型",
          trigger: "change"
        }
      ],
      _perms: [
        {
          required: true,
          message: "请选择权限标识",
          trigger: "change",
          type: "array"
        }
      ]
    };

    const formState = reactive({
      sort: null,
      menuName: "",
      menuPath: "",
      menuUrl: "",
      menuType: null,
      perms: "",
      display: false,
      icon: null
    });
    const list = ref([
      { text: "系统菜单", value: "1" },
      { text: "业务菜单", value: "2" },
      { text: "目录", value: "3" },
      { text: "按钮", value: "4" }
    ]);
    const submit = e => {
      formRef.value
        .validate()
        .then(async () => {
          formState.perms = formState._perms.join(",");
          if (props.record.menuId) {
            await updateMenuHttp();
          } else {
            await addMenu({ ...formState, ...props.record });
          }
          context.emit("handle", {
            type: props.menuType,
            data: formState
          });
          cancel();
        })
        .catch(error => {
          console.log("error", error);
        });
    };

    const cancel = e => {
      formRef.value.resetFields();
      context.emit("close", false);
    };

    const getDetail = async () => {
      const _data = await getMenuById({
        menuId: props.record.menuId
      });
      for (const key in formState) {
        if (key === "perms") {
          formState["_" + key] = _data.data[key].split(",");
        } else {
          formState[key] = _data.data[key];
        }
      }
    };
    // 如果有menuId则是修改
    if (props.record.menuId) {
      getDetail();
    }

    const updateMenuHttp = async () => {
      const { menuId, applicationId, parentMenuId } = props.record;
      await updateMenu({ ...formState, menuId, applicationId, parentMenuId });
      message.success({ content: "更新成功" });
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
      roles,
      getDetail,
      updateMenuHttp
    };
  }
});
</script>

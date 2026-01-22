<template>
    <div class="add-goout-page" style="background: #f5f5f5; min-height: 100vh;">
        <!-- 新增表单 -->
        <el-card style="max-width: 100%; margin: 0 auto;">
            <el-form ref="goOutFormRef" :model="form" label-width="140px" :rules="rules" style="padding: 10px;">
                <!-- 老人信息（回显，不可编辑） -->
                <el-form-item label="外出老人" prop="elderlyName" style="max-width: 460px">
                    <el-input v-model="form.elderlyName" disabled readonly placeholder="请选择外出老人" />
                </el-form-item>

                <!-- 外出时间范围 -->
                <el-form-item label="外出时间" prop="outTime" style="max-width: 460px">
                    <el-date-picker type="datetimerange" start-placeholder="开始时间"
                        end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
                        style="width: 100%;" @change="handleDate" v-model="value1" />
                </el-form-item>

                <!-- 新增：陪同人员类型下拉框 -->
                <el-form-item label="陪同人员类型" prop="accompanyType" style="max-width: 460px">
                    <el-select v-model="form.accompanyType" placeholder="请选择">
                        <el-option label="母女" value="0" />
                        <el-option label="兄弟" value="1" />
                        <el-option label="姐妹" value="2" />
                        <el-option label="朋友" value="3" />
                        <el-option label="其他" value="4" />
                        <el-option label="本人" value="5" />
                        <el-option label="护理人员" value="6" />
                    </el-select>
                </el-form-item>

                <!-- 陪同人员姓名 -->
                <el-form-item label="陪同人员姓名" prop="name" style="max-width: 460px">
                    <el-input v-model="form.name" placeholder="请输入" />
                </el-form-item>

                <!-- 陪同人员手机号 -->
                <el-form-item label="陪同人员电话" prop="mobile" style="max-width: 460px">
                    <el-input placeholder="请输入" v-model="form.mobile" />
                </el-form-item>

                <!-- 陪同人员地址 -->
                <el-form-item label="陪同人员地址" prop="address" style="max-width: 460px">
                    <el-input placeholder="请输入" v-model="form.address" />
                </el-form-item>

                <!-- 外出原因 -->
                <el-form-item label="外出原因" prop="content" style="max-width: 460px">
                    <el-input type="textarea" placeholder="请输入" v-model="form.content" />
                </el-form-item>


            </el-form>
            <div>
                <!-- 提交按钮 -->
                <el-form-item style="text-align: center; margin-top: 10px;">
                    <el-button type="primary" size="large" @click="Submit">保存</el-button>
                    <el-button size="large" style="margin-left: 20px;" @click="cancel">取消</el-button>
                </el-form-item>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { dayjs, ElForm, ElMessage } from 'element-plus';
import type { ElderlyDetail } from '../../api/OutboundRegistration/ResidentDetail';
import { getAdd, getOldManDetail, getUpdate } from '../../api/OutboundRegistration/Outbound';
import router from '../../router';


const value1 = ref<any[]>([]);

// 路由实例
const route = useRoute();

// 表单引用
const byId = ref<number | null>(null);
const isEdit = ref(false);

onMounted(() => {
    const id = route.query.id as string | null;
    const editFlag = route.query.isEdit as string | null;
    console.log("ddd", id);
    
    if (id) {
        byId.value = Number(id);
        isEdit.value = editFlag === 'true';
        if (isEdit.value) {
            // 如果是编辑模式，需要获取外出记录详情
            getOutingDetail();
        } else {
            // 如果是新增模式，获取老人详情
            elderlyDetail();
        }
    }
    console.log("byId.value", byId.value);
});

const formData = reactive<ElderlyDetail>({
    name: '',
})

// 老人详情接口
const elderlyDetail = async () => {
    console.log("byId.value", byId.value);

    if (!byId.value) return
    const res = await getOldManDetail(byId.value);
    console.log("详情", res);
    formData.name = res.data.name
    form.elderlyName = res.data.name
    form.elderlyId = byId.value
}

// 外出记录详情接口
const getOutingDetail = async () => {
    console.log("byId.value", byId.value);

    if (!byId.value) return
    const res = await getOldManDetail(byId.value);
    console.log("外出记录详情", res);
    formData.name = res.data.name
    form.elderlyName = res.data.name
    form.elderlyId = byId.value
    // 这里需要根据实际返回的字段进行赋值
    // form.startTime = res.data.startTime;
    // form.endTime = res.data.endTime;
    // form.accompanyType = res.data.accompanyType;
    // form.name = res.data.name;
    // form.mobile = res.data.mobile;
    // form.address = res.data.address;
    // form.content = res.data.content;
    // 如果有外出记录的时间，需要设置日期选择器的值
    // if (res.data.startTime && res.data.endTime) {
    //     value1.value = [res.data.startTime, res.data.endTime];
    // }
}


// 表单数据
const form = reactive<any>({
    id: null, // 记录ID，用于编辑
    elderlyId: '', // 老人ID（提交用）
    elderlyName: '', // 老人姓名（回显）
    startTime: "",    // 开始时间 (格式: YYYY-MM-DD HH:mm:ss)
    endTime: "",      // 结束时间 (格式: YYYY-MM-DD HH:mm:ss)
    mobile: "",       // 联系电话
    address: "",      // 目的地地址
    content: "",      // 外出理由/内容
    relation: "",     // 关系
    name: "",        // 外出人员姓名
    accompanyType: "" // 陪同人员类型

});

// 表单校验规则
const rules = reactive({
    elderlyName: [{ required: true, message: '请先选择外出老人', trigger: 'blur' }],
    name: [{ required: true, message: '请输入陪同人员姓名', trigger: 'blur' }],
    mobile: [
        { required: true, message: '请输入陪同人员手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
    ],
    address: [{ required: true, message: '请输入陪同人员地址', trigger: 'blur' }],
    content: [{ required: true, message: '请输入外出原因', trigger: 'blur' }]
});

// 表单引用
const goOutFormRef = ref<InstanceType<typeof ElForm>>();

// 定义tableRef
const tableRef = ref();

// 保存按钮
const Submit = async () => {
    if (!goOutFormRef.value) return;
    
    // 表单验证
    const isValid = await goOutFormRef.value.validate();
    if (!isValid) return;

    form.elderlyId = byId.value;
    try {
        let res;
        if (isEdit.value) {
            // 编辑模式
            res = await getUpdate(form);
            ElMessage.success('更新成功');
        } else {
            // 新增模式
            res = await getAdd(form);
            ElMessage.success('添加成功');
        }
        console.log("444", res);
        router.push({
            path: "/care/GoOut",
        });
    } catch (error) {
        ElMessage.error(isEdit.value ? '更新失败' : '添加失败');
        console.error('保存失败:', error);
    }
}

// 取消按钮
const cancel = () => {
    router.push({
        path: "/care/GoOut",
    });
}

// 日期处理 // 时间处理
const handleDate = (e: any) => {
  if (e && e.length > 1) {
    form.startTime = e[0] ? dayjs(e[0]).format('YYYY-MM-DD HH:mm:ss') : "";
    form.endTime = e[1] ? dayjs(e[1]).format('YYYY-MM-DD HH:mm:ss') : "";
  } else {
    form.startTime = "";
    form.endTime = "";
  }
};

</script>

<style scoped>
.add-goout-page {
    box-sizing: border-box;
}

.el-card {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
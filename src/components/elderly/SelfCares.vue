<template>
    <div>
        <div class="Nowiln">
            <div class="left"></div>
            <div class="title">老人自理情况</div>
        </div>
        <el-table border :data="list" style="width: 100%">
            <el-table-column prop="id" label="序号" />
            <el-table-column prop="name" label="维度" />
            <el-table-column prop="address" label="操作">
                <template #default="scope">
                    <el-radio-group @change="changeHandle" v-model="scope.row.val">
                        <el-radio value="正常" size="large">正常</el-radio>
                        <el-radio value="轻度依赖" size="large">轻度依赖</el-radio>
                        <el-radio value="重度依赖" size="large">重度依赖</el-radio>
                    </el-radio-group>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { ElderlySelfCare, IllnessItem } from '../../api/market/elderlyType';
import { SelfcareList } from '../../api/market/elderly';

// 1. 定义双向绑定值，默认空字符串
const values = defineModel<ElderlySelfCare[]>({ default: [] })



const list = ref<IllnessItem[]>([])
const getSelfCares = async () => {

    const res = await SelfcareList();
    list.value = res.data.list;

}
getSelfCares();

const changeHandle = () => {
    console.log("list", list);
    values.value = list.value.filter(item => item.val).map(item => ({ name: item.name, val: item.val })) as ElderlySelfCare[];
}
</script>

<style scoped lang="less">
.Nowiln {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 20px;

    .left {
        width: 8px;
        height: 16px;
        background-color: #529bfd;
        margin-right: 10px;
    }

    .title {
        font-size: 16px;
        font-weight: bold;
    }
}

/deep/.el-checkbox-group {
    margin-bottom: 20px;
}
</style>
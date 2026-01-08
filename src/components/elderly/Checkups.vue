<template>
    <div>
        <div class="Nowiln">
            <div class="left"></div>
            <div class="title">体检报告</div>
        </div>
        <el-table border :data="list" style="width: 100%">
            <el-table-column prop="name" label="体检项目" />
            <el-table-column prop="picture" label="资料" />
            <el-table-column prop="address" label="操作">
                <template #default="">
                    <button class="button">上传图片</button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { Checkup, IllnessItem } from '../../api/market/elderlyType';
import { CheckupitemsList } from '../../api/market/elderly';

// 1. 定义双向绑定值，默认空字符串
const values = defineModel<Checkup[]>({ default: [] })

const list = ref<IllnessItem[]>([])
const getSelfCares = async () => {
    const res = await CheckupitemsList();
    list.value = res.data.list;
    console.log('体检项目',res);
}
getSelfCares();

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
.button{
    background-color: #529bfd;
    border: none;
    color: #fff;
}
</style>
<template>
    <div>
        <el-dialog title="请选择老人" v-model="dialogVisibleSelectOld" width="800">
            <Table :pageSizes="[5, 15, 50, 100]" :columns="columns" ref="tableRef" :init-params="params"
                :fetch-data="getElderlyList">
                <template #search>
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="名称">
                            <el-input v-model="params.name" placeholder="请输入姓名" clearable />
                        </el-form-item>

                        <el-form-item label="身份证号">
                            <el-input v-model="params.idCard" placeholder="请输入身份证号" clearable />
                        </el-form-item>

                        <el-form-item>
                            <el-button @click="query" type="primary" :icon="Search">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button :icon="Refresh" @click="reset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </template>
                <template #operate="{ row }"><el-button type="primary" @click="selectById(row)"> 选择</el-button>
                </template>
            </Table>

        </el-dialog>
    </div>
</template>
<script setup lang='ts'>
import { ref } from 'vue';
import Table from '../table.vue';
import { Refresh, Search } from '@element-plus/icons-vue';
import type { TableColumn } from '../table.vue';
import type { elderlyParams } from '../../api/selsecOld/type';
import { getElderlyList } from '../../api/selsecOld/selectOld';

const tableRef = ref<any>(null)
//请求参数
const params = ref<elderlyParams>({})

const columns: TableColumn[] = [

    {
        label: "姓名",
        prop: "name",
    }, {
        label: "头像",
        image: "photo",



    }, {
        label: "身份证号",
        prop: "idCard",

    },
    {
        label: "操作",
        slot: "operate",
        width: 180,
        fixed: "right",
    }

]

//接受父组件传来的参数
const dialogVisibleSelectOld = defineModel()
//点击查询
const query = () => {
    tableRef.value.refresh()
}

//点击重置
const reset = () => {
    //清空表单数据  有点问题
    Object.assign(params.value, {
        name: '',
        idCard: undefined
    })

    tableRef.value.refresh()
}



//向父组件传入一个选中的老人的id信息
const emit = defineEmits(['selectOldId'])
//点击选择的老人id
const selectById = (row: any) => {
    //关闭对胡框的显示
    dialogVisibleSelectOld.value = false
    emit('selectOldId', row)
}




</script>
<style lang='less' scoped></style>

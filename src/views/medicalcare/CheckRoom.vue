<template>
    <div>
        <!-- <Table ref="Refresh" :columns="columns" :fetch-data="getBloodList" :init-params="searchForm"></Table> -->
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import Table from '../../components/table.vue'

const tableRef = ref<any>(null);

//刷新页面
const Refresh = () => {
    tableRef.value.refresh()
}

</script>

<style scoped lang='less'></style>

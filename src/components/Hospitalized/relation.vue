<template>
    <div class="relation-info">
        <div class="relation-header">
            <h3 class="section-title">家属信息：</h3>
            <div class="header-items">
                <div class="header-item">家属姓名</div>
                <div class="header-item">与老人关系</div>
                <div class="header-item">联系方式</div>
            </div>
        </div>

        <div class="relation-body">
            <template v-if="relations.length > 0">
                <div v-for="(relation, index) in relations" :key="index" class="relation-row">
                    <div class="row-item">{{ relation.name }}</div>
                    <div class="row-item">{{ relation.relation }}</div>
                    <div class="row-item">{{ relation.contact }}</div>
                </div>
            </template>
            <template v-else>
                <div class="empty-data">暂无数据</div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 家属关系数据
interface Relation {
    name: string;
    relation: string;
    contact: string;
}

const relations = ref<Relation[]>([]);
</script>

<style scoped lang="less">
.relation-info {
    width: 400px;
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
}

.relation-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;

    .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin-right: 20px;
        margin-bottom: 0;
    }

    .header-items {
        display: flex;
        flex: 1;

        .header-item {
            flex: 1;
            font-size: 14px;
            color: #909399;
            text-align: center;
        }
    }
}

.relation-body {
    height: 100px;

    .relation-row {
        display: flex;
        padding: 10px 0;
        border-bottom: 1px solid #f5f7fa;

        .row-item {
            flex: 1;
            font-size: 14px;
            color: #606266;
            text-align: center;
        }
    }

    .empty-data {
        text-align: center;
        padding: 40px 20px;
        color: #909399;
        font-size: 14px;
    }
}
</style>
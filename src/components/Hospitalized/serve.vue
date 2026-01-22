<template>
  <div class="service-manager">
    <div class="service-header">
      <el-button type="primary" @click="handleAddService">添加服务</el-button>
    </div>
    
    <div class="service-table">
      <div class="table-header">
        <div class="header-item">服务名称</div>
        <div class="header-item">服务描述</div>
        <div class="header-item">合计</div>
      </div>
      
      <div class="table-body">
        <template v-if="services.length > 0">
          <div v-for="(service, index) in services" :key="index" class="table-row">
            <div class="row-item">{{ service.name }}</div>
            <div class="row-item">{{ service.description }}</div>
            <div class="row-item">{{ service.total }}</div>
          </div>
        </template>
        <template v-else>
          <div class="empty-data">暂无数据</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElButton } from 'element-plus';

interface Service {
  name: string;
  description: string;
  total: number;
}

const services = ref<Service[]>([]);

const handleAddService = () => {
  // 这里可以添加打开添加服务对话框的逻辑
  console.log('添加服务');
};
</script>

<style scoped lang="less">
.service-manager {
  width: 100%;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.service-header {
  margin-bottom: 20px;
}

.service-table {
  width: 400px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.table-header {
  display: flex;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 20px;
  font-weight: 600;
  color: #374151;
}

.header-item {
  flex: 1;
}

.table-body {
  min-height: 100px;
}

.table-row {
  display: flex;
  padding: 12px 20px;
  border-bottom: 1px solid #e5e7eb;
  &:last-child {
    border-bottom: none;
  }
}

.row-item {
  flex: 1;
  color: #4b5563;
}

.empty-data {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 14px;
}
</style>
<template>
    <div>
        <el-dialog v-model="props.open" title="增加院内活动" :before-close="props.close" width="900px">

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="props.close">取消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">
                        提交
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { ElMessageBox } from 'element-plus'

const props = defineProps<{
    open: boolean
    close: () => void
}>()

const dialogVisible = ref(false)

const handleClose = (done: () => void) => {
    ElMessageBox.confirm('Are you sure to close this dialog?')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}
</script>

<style scoped lang='less'></style>
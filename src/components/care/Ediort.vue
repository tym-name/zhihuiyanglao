<template>
    <div>
        <div style="border: 1px solid #ccc">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                :mode="mode" />
            <Editor :style="style" v-model="valueHtml" :defaultConfig="editorConfig" :mode=mode
                @onCreated="handleCreated" />
        </div>
    </div>
</template>
<script setup lang='ts'>
import { computed, reactive, ref, shallowRef, watch, watchEffect } from 'vue';
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar, InsertFnType } from '@wangeditor/editor-for-vue'  // 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

const toolbarConfig = {}
const mode = 'default' // 或 'simple'

// 内容 HTML
const valueHtml = defineModel<string>()
//接受默认值
const props = withDefaults(defineProps<{
    height: number | string
}>(), {
    height: 300
})
const style = {
    overflowY: 'hidden',
    height: `${props.height}px`

}



const editorConfig = {
    placeholder: '请输入内容...',
    // 上传图片的配置
    MENU_CONF: {
        uploadImage: {
            fieldName: 'file',
            //请求地址
            server: `${import.meta.env.VITE_BASE_URL}upload/add`,

            //请求头 获取token令牌
            headers() { //改为函数形式，确保每次请求都能获取最新 Token
                return {
                    Authorization: sessionStorage.getItem("token") || '',
                    'Content-Type': 'multipart/form-data'
                }
            },
            customInsert(res: any, insertFn: InsertFnType) {
                // console.log(res,"图片文件")
                if (res.errCode === 10000) {
                    const url = `${import.meta.env.VITE_IMG_URL}${res.data}`;
                    insertFn(url, "", "")
                }
                // TS 语法
                // customInsert(res, insertFn) {                  // JS 语法
                // res 即服务端的返回结果

                // 从 res 中找到 url alt href ，然后插入图片
                // insertFn(url, alt, href)
            },
        }
    }
}


const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

</script>
<style lang='less' scoped></style>

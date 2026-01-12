<template>
    <div>
        <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="QRCode" />
    </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, watch } from 'vue';
import QRCode from 'qrcode';
import { debounce } from 'lodash';
const qrCodeUrl = defineModel({ default: '' })

const props = defineProps({
    url: {
        type: String,
        required: true
    }
});

watch(() => props.url, debounce(async () => {
    qrCodeUrl.value = await QRCode.toDataURL(props.url, {
        width: 115,
        margin: 1
    });

}, 500))

</script>
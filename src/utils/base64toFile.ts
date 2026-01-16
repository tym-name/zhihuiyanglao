export const base64Data = (base64Data: string, filename: string, filetype: any) => {
    // 分离Base64元数据和实际数据
    const arr = base64Data.split(',');
    // if(arr.length<2) return null
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: filetype || mime });
};
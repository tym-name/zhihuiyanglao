import request from "./request";

interface UploadResponse {
  url: string
}
function base64ToBlob(base64Data:string) {
    let contentType = '';
    let base64String = '';
  
    // 检查是否有前缀
    if (base64Data.includes(';base64,')) {
      const parts = base64Data.split(';base64,');
      contentType = parts[0].split(':')[1];
      base64String = parts[1];
    } else {
      // 如果没有前缀，假设为PNG图片，或者你可以根据实际情况处理
      contentType = 'image/png';
      base64String = base64Data;
    }
  
    const raw = window.atob(base64String);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
  
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
  
    return new Blob([uInt8Array], { type: contentType });
  }

 

export function uploadBase64(base64Data:string) {

    let fileName=new Date().getTime()+'.png';
  // 将Base64转换为Blob
  const blob = base64ToBlob(base64Data);
  // 将Blob转换为File对象
  const file = new File([blob], fileName, { type: blob.type });

  // 创建FormData
  const formData = new FormData();
  formData.append('file', file); // 字段名根据后端接口调整

 return request.post<UploadResponse>('/api/upload/add', formData)

 
}
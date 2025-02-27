import { request } from '@umijs/max';

export async function postImage(formData: FormData): Promise<string> {
  return request('/Files/uploadImage', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

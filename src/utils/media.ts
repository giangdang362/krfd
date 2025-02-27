export const convertFileToBinaryString = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const binaryString = e.target?.result;
      resolve(binaryString);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsBinaryString(file);
  });
};

export const getUrlImage = (x: string) => {
  return `${API_URL}/Files/image/${x}`;
};

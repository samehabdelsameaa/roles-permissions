import apiInstance from 'src/utils/api';

export const uploadPhoto = async (formData) => {
  try {
    const response = await apiInstance.post('/upload', formData, {
      headers: {
        'Content-Type': `multipart/form-data;boundary=${formData._boundary}`
      }
    });
    if (response) {
      return response.data.data;
    }
  } catch (error) {
    console.log(error);
  }
};

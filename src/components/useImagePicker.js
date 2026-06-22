import {useState} from 'react';
import * as ImagePicker from 'react-native-image-picker';

const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Data, setBase64Data] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    console.log('Opening image picker...');
    setLoading(true);

    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
        selectionLimit: 1,
        includeExtra: false,
      });

      if (!result.didCancel && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const imageUri = asset.uri;
        const base64 = asset.base64;

        console.log('Image selected:', imageUri);

        setSelectedImage(imageUri);
        setBase64Data(base64);
      } else {
        console.log('Image picker cancelled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPicker = () => {
    setSelectedImage(null);
    setBase64Data(null);
    setLoading(false);
  };

  return {
    pickImage,
    selectedImage,
    base64Data,
    loading,
    resetPicker,
  };
};

export default useImagePicker;

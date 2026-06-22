import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import commonStyles from '../commonstyles/commonstyles';

const { width, height } = Dimensions.get('window');

const CustomModal = ({
  visible,
  onClose,
  title,
  content,
  onConfirm,
  confirmText,
  cancelText,
  showCancelButton = true,
  customButtonStyles = {},
}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose} // Android back button
    >
      <View style={styles.modalOverlay}>
        {/* Transparent area dismiss */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={[commonStyles.row, { justifyContent: 'space-between' }]}>
            {title && (
              <Text
                style={[
                  commonStyles.text2,
                  { lineHeight: 21, flex: 1, color: '#000' },
                ]}
              >
                {title}
              </Text>
            )}
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={16} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={{ marginTop: 24 }}>
            <Text style={[commonStyles.text4, { fontWeight: '400' ,alignSelf:"center",textAlign:"center"}]}>
              {content}
            </Text>
          </View>

          {/* Buttons */}
          <View
            style={[
              commonStyles.row,
              {
                marginTop: 24,
                justifyContent: 'center',
                gap: 8,
              },
            ]}
          >
            {showCancelButton && cancelText && (
              <TouchableOpacity
                style={[commonStyles.smallbutton]}
                onPress={onClose}
              >
                <Text style={commonStyles.text4}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[commonStyles.smallgreenbutton, customButtonStyles]}
              onPress={onConfirm}
            >
              <Text style={commonStyles.smallgreenbuttontext}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    height,
    width,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
});

export default CustomModal;

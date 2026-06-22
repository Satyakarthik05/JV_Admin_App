// QRScannerModal.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';

const { height } = Dimensions.get('window');

const QRScannerModal = ({ visible, onClose, navigation }) => {
  const insets = useSafeAreaInsets();

  // Calculate bottom padding to account for tab bar
  const tabBarHeight = Platform.OS === 'ios' ? 85 : 65;
  const bottomPadding = tabBarHeight + insets.bottom;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.modalContainer,
            { paddingBottom: bottomPadding  }
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.dragHandle} />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/cafefg1.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Feather name="info" size={16} color="#002161" />
            <Text style={styles.infoText}>
              Scan this QR at the counter to redeem.
            </Text>
          </View>

          {/* QR Code Container */}
          <View style={styles.qrContainer}>
            <Image
              source={require('../assets/qr-code.png')}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>

          {/* User ID */}
          <Text style={styles.userId}>YUSBEHNDHJSYUJAH</Text>

          {/* Warning Text */}
          <Text style={styles.warningText}>
            Once this QR is scanned, it will no longer be valid for reuse.
          </Text>

          {/* Enter Manually Button */}
          <TouchableOpacity
            style={styles.manualButton}
            onPress={() => {
              onClose();
              navigation.navigate('RegisterManuallyScreen');
            }}
          >
            <Text style={styles.manualButtonText}>Enter Manually</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: height * 0.85,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D0D0D0',
    borderRadius: 2,
    marginBottom: 12,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#002161',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#002161',
    fontWeight: '500',
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 4,
    // marginBottom: 16,
    // borderWidth: 1,
    // borderColor: '#E0E0E0',
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  userId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  warningText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  manualButton: {
    borderWidth: 1,
    borderColor: '#002161',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  manualButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#002161',
  },
});

export default QRScannerModal;

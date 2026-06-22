import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  PermissionsAndroid,
  Platform,
  StatusBar,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Feather from "react-native-vector-icons/Feather"
import { colors } from '../../config/theme';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
const expenseTypes = [
  { label: 'Petrol', value: 'petrol' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Food', value: 'food' },
  { label: 'Travel', value: 'travel' },
];
const SaleAddExpense = () => {
  const navigation = useNavigation();
  const [expenseType, setExpenseType] = useState('petrol');
  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');
  const [billImage, setBillImage] = useState(null);
  const [proofMedia, setProofMedia] = useState(null); // string URI for both image and video
  const [notes, setNotes] = useState('');

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white)
      StatusBar.setBarStyle("dark-content")
    }, [])
  )

  const isFuel = expenseType === 'petrol' || expenseType === 'diesel';

  // Request Camera Permission (Android)
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera to record video',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert('Permission Denied', 'Camera permission is required to record video.');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Request Storage/Gallery Permission (Android)
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to select images',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Record Video (Fuel)
  const recordVideo = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    launchCamera(
      {
        mediaType: 'video',
        videoQuality: 'high',
        durationLimit: 30,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled video recording');
        } else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to record video');
        } else if (response.assets && response.assets.length > 0) {
          setProofMedia(response.assets[0].uri);
        }
      }
    );
  };

  // Pick Image (Gallery)
  const pickImage = async (setter) => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        } else if (response.assets && response.assets.length > 0) {
          setter(response.assets[0].uri);
        }
      }
    );
  };
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Feather name="arrow-left" size={22} color={colors.simpleblack} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Expense</Text>
        </View>

        {/* Expense Type */}
        <Text style={styles.label}>Expense Type</Text>
        <View style={styles.inputBox}>
          <Dropdown
            style={styles.dropdown}
            data={expenseTypes}
            labelField="label"
            valueField="value"
            value={expenseType}
            onChange={(item) => {
              setExpenseType(item.value);
              setBillImage(null);
              setProofMedia(null);
            }}
            placeholder="Select type"
            placeholderStyle={styles.dropdownPlaceholder}
            selectedTextStyle={styles.dropdownSelectedText}
            itemTextStyle={styles.dropdownItemText}
            containerStyle={styles.dropdownContainer}
          />
        </View>

        {/* Amount & Vendor */}
        <Text style={styles.label}>Amount</Text>
        <View style={styles.inputBox}>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="₹ Amount"
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>Vendor</Text>
        <View style={styles.inputBox}>
          <TextInput
            value={vendor}
            onChangeText={setVendor}
            placeholder="Vendor name"
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>

        {/* Proof Section */}
        <Text style={styles.label}>
          {isFuel ? 'Record Video' : 'Upload Proof Image'} <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.mediaBox}
          onPress={isFuel ? recordVideo : () => pickImage(setProofMedia)}
        >
          {proofMedia ? (
            <>
              {/* This works for both images and local videos! */}
              <Image source={{ uri: proofMedia }} style={styles.previewImage} />

              {/* Play icon overlay only for videos (fuel) */}
              {isFuel && (
                <View style={styles.videoIconOverlay}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              )}

              <Text style={styles.successText}>
                {isFuel ? 'Video recorded' : 'Image uploaded'} ✓
              </Text>
            </>
          ) : (
            <Text style={styles.placeholderText}>
              {isFuel ? 'Tap to record video' : 'Tap to upload image'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Attach Bill */}
        <Text style={styles.label}>
          Attach Bill {!isFuel && <Text style={styles.required}>*</Text>}
        </Text>
        <TouchableOpacity style={styles.billBox} onPress={() => pickImage(setBillImage)}>
          {billImage ? (
            <>
              <Image source={{ uri: billImage }} style={styles.billImage} />
              <Text style={styles.billUploaded}>Bill uploaded ✓</Text>
            </>
          ) : (
            <Text style={styles.billPlaceholder}>
              {isFuel ? 'Upload bill image (optional)' : 'Upload bill image (required)'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Notes */}
        <Text style={styles.label}>Notes (Optional)</Text>
        <View style={styles.notesBox}>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes..."
            multiline
            style={styles.notesInput}
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert('Saved', 'Expense saved!')}>
        <Text style={styles.saveText}>Save Expense</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  back: {
    fontSize: 28,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    color: '#000',
  },
  required: {
    color: 'red',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  dropdown: {
    height: 48,
  },
  input: {
    height: 48,
    fontSize: 14,
    color: '#000',
  },
  mediaBox: {
    height: 120,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#FAFAFA',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  successText: {
    color: 'green',
    fontWeight: '600',
    fontSize: 15,
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoIconOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 36,
    color: '#fff',
    marginLeft: 5, // Slight offset to center the triangle properly
  },
  billBox: {
    height: 140,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  billImage: {
    width: '100%',
    height: '100%',
  },
  billPlaceholder: {
    color: '#999',
  },
  billUploaded: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'green',
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 4,
  },
  notesBox: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    height: 80,
  },
  notesInput: {
    padding: 10,
    fontSize: 14,
  },
  saveBtn: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    height: 50,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownPlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  dropdownSelectedText: {
    color: '#000',
    fontSize: 14,
  },
  dropdownItemText: {
    color: '#000',
    fontSize: 14,
  },
  dropdownContainer: {
    borderRadius: 8,
  },
});
export default SaleAddExpense;
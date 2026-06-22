import React, {useCallback, useEffect, useState} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../../config/theme';
import {useFocusEffect} from '@react-navigation/native';
import commonstyles from '../../commonstyles/commonstyles';
import Entypo from 'react-native-vector-icons/Entypo';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import api from '../../utils/api';
import {endpoints} from '../../config/config';

const expenseTypes = [
  {label: 'Petrol', value: 'petrol'},
  {label: 'Diesel', value: 'diesel'},
  {label: 'Food', value: 'food'},
  {label: 'Travel', value: 'travel'},
];

const formatYmd = d => {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

export default function AddExpenseScreen({navigation}) {
  const [expenseType, setExpenseType] = useState('petrol');
  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');
  /** Same shape as Payment.jsx `image` — asset from react-native-image-picker */
  const [billImage, setBillImage] = useState(null);
  const [proofMedia, setProofMedia] = useState(null); // string URI for both image and video
  const [notes, setNotes] = useState('');
  const [expenseDate, setExpenseDate] = useState(() => formatYmd(new Date()));
  const [showDate, setShowDate] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFuel = expenseType === 'petrol' || expenseType === 'diesel';

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        if (stored) {
          setUserData(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('AddExpenseScreen load userData', e);
      }
    };
    loadUser();
  }, []);

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
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert(
            'Permission Denied',
            'Camera permission is required to record video.',
          );
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
        },
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
      response => {
        if (response.didCancel) {
          console.log('User cancelled video recording');
        } else if (response.errorCode) {
          Alert.alert(
            'Error',
            response.errorMessage || 'Failed to record video',
          );
        } else if (response.assets && response.assets.length > 0) {
          setProofMedia(response.assets[0].uri);
        }
      },
    );
  };

  // Pick Image (Gallery) — returns URI only (e.g. proof / generic)
  const pickImage = async setter => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        } else if (response.assets && response.assets.length > 0) {
          const a = response.assets[0];
          setter(a.uri);
        }
      },
    );
  };

  const openBillImagePicker = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to pick image');
          return;
        }
        if (response?.assets?.length > 0) {
          setBillImage(response.assets[0]);
        }
      },
    );
  };

  const onDateChange = (event, selected) => {
    setShowDate(false);
    if (selected) {
      setExpenseDate(formatYmd(selected));
    }
  };

  const SaveExpense = async () => {
    if (isSubmitting) {
      return;
    }
    if (!userData?.id || !userData?.empCode) {
      Alert.alert(
        'Login required',
        'Employee details were not found. Please log in again.',
      );
      return;
    }
    if (!expenseDate) {
      Alert.alert('Validation', 'Please select expense date.');
      return;
    }
    const trimmedVendor = vendor.trim();
    if (!trimmedVendor) {
      Alert.alert('Validation', 'Please enter vendor name.');
      return;
    }
    const amt = Number(String(amount).replace(/,/g, ''));
    if (!amount || Number.isNaN(amt) || amt <= 0) {
      Alert.alert('Validation', 'Please enter a valid amount greater than 0.');
      return;
    }
    if (!isFuel && !billImage?.base64) {
      Alert.alert(
        'Validation',
        'Please upload a bill image for this expense type.',
      );
      return;
    }

    const typeRow = expenseTypes.find(t => t.value === expenseType);
    const expenseTypeLabel = typeRow?.label || 'Other';

    setIsSubmitting(true);
    try {
      const payload = {
        employeeId: userData.id,
        empCode: userData.empCode,
        expenseType: expenseTypeLabel,
        requestType: 'EXPENSE',
        amount: amt,
        expenseDate,
        vendor: trimmedVendor,
        reason: notes.trim() || 'Driver expense',
        expenseSource: 'DRIVER',
        image: billImage?.base64 || null,
        receiptImageMimeType: billImage?.type || null,
        receiptImageFileName: billImage?.fileName || null,
      };
      console.log(payload,">>>>>>>>>>>>>>>>>")

      const body = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== undefined && v !== ''),
      );

      await api.post(endpoints.REQ_EXPENSE, body, {timeout: 120000});

      Alert.alert('Success', 'Expense submitted successfully.', [
        {text: 'OK', onPress: () => navigation?.goBack()},
      ]);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to submit expense.';
      Alert.alert('Error', String(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white);
      StatusBar.setBarStyle('dark-content');
    }, []),
  );

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
        <View style={styles.gap}>
          <Text style={styles.label}>Expense Type</Text>
          <View style={[commonstyles.for_border_dropdown, {zIndex: 1000}]}>
            <Dropdown
              style={commonstyles.dropdown}
              placeholderStyle={commonstyles.placeholderStyle}
              selectedTextStyle={commonstyles.placeholderStyle}
              itemTextStyle={commonstyles.placeholderStyle}
              showsVerticalScrollIndicator={false}
              data={expenseTypes}
              labelField="label"
              valueField="value"
              placeholder="Expense Type"
              value={expenseType}
              onChange={item => {
                setExpenseType(item.value);
              }}
              renderRightIcon={() => (
                <Entypo
                  name="chevron-small-down"
                  size={18}
                  color="#82889A"
                  style={commonstyles.calender_icon}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.gap}>
          <Text style={styles.label}>
            Expense date <Text style={styles.required}>*</Text>
          </Text>
          <View style={commonstyles.for_border}>
            <TextInput
              value={expenseDate}
              editable={false}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999"
              style={commonstyles.inputfield}
            />
            <TouchableOpacity onPress={() => setShowDate(true)}>
              <Ionicons
                name="calendar-clear-outline"
                size={18}
                color="#82889A"
                style={commonstyles.calender_icon}
              />
            </TouchableOpacity>
          </View>
          {showDate && (
            <DateTimePicker
              value={new Date(expenseDate + 'T12:00:00')}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Amount & Vendor */}
        <View style={styles.gap}>
          <Text style={styles.label}>Amount</Text>
          <View style={commonstyles.for_border}>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="₹ Amount"
              placeholderTextColor="#999"
              style={commonstyles.inputfield}
            />
          </View>
        </View>

        <View style={styles.gap}>
          <Text style={styles.label}>Vendor</Text>
          <View style={commonstyles.for_border}>
            <TextInput
              value={vendor}
              onChangeText={setVendor}
              placeholder="Vendor name"
              placeholderTextColor="#999"
              style={commonstyles.inputfield}
            />
          </View>
        </View>

        {/* Proof Section */}
        {/* <View style={styles.gap} >
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
        {/* <Image source={{ uri: proofMedia }} style={styles.previewImage} /> */}

        {/* Play icon overlay only for videos (fuel) */}
        {/* {isFuel && (
                  <View style={styles.videoIconOverlay}>
                    <Text style={styles.playIcon}>▶</Text>
                  </View>
                )} */}

        {/* <Text style={styles.successText}>
                  {isFuel ? 'Video recorded' : 'Image uploaded'} ✓
                </Text>
              </>
            ) : (
              <Text style={styles.placeholderText}>
                {isFuel ? 'Tap to record video' : 'Tap to upload image'}
              </Text>
            )}
          </TouchableOpacity>
        </View> */}

        {/* Attach Bill */}
        <View>
          <Text style={styles.label}>
            Attach Bill {!isFuel && <Text style={styles.required}>*</Text>}
          </Text>
          <TouchableOpacity
            style={styles.billBox}
            onPress={openBillImagePicker}>
            {billImage?.uri ? (
              <>
                <Image source={{uri: billImage.uri}} style={styles.billImage} />
                <Text style={styles.billUploaded}>Bill uploaded ✓</Text>
              </>
            ) : (
              <Text style={styles.billPlaceholder}>
                {isFuel
                  ? 'Upload bill image (optional)'
                  : 'Upload bill image (required)'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View>
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
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, isSubmitting && styles.saveBtnDisabled]}
          onPress={SaveExpense}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Save Expense</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    paddingTop: 17,
  },
  gap: {
    paddingBottom: responsiveHeight(2),
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
    fontSize: 14,
    fontWeight: '800',
    paddingBottom: 5,
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
    borderColor: colors.inputfieldborder,
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
    transform: [{translateX: -30}, {translateY: -30}],
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
    borderColor: colors.inputfieldborder,
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
    borderColor: colors.inputfieldborder,
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
  saveBtnDisabled: {
    opacity: 0.7,
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

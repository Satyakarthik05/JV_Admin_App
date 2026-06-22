// RegisterManuallyScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import DatePicker from 'react-native-date-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomModal from '../components/CustomModal';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resetOtpState } from '../redux/reducers/auth'; // Adjust path if needed

const RegisterManuallyScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { loading, message } = useSelector((state) => state.Auth);

  // Form States
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [stateName, setStateName] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [profileImageUri, setProfileImageUri] = useState(null);

  // UI States
  const [errors, setErrors] = useState({});
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state on mount
  useEffect(() => {
    dispatch(resetOtpState());
  }, [dispatch]);


  useEffect(() => {
  dispatch(resetOtpState()); // Already there — good!
  
  // Also clear any old message
  dispatch({ type: 'auth/clearMessage' }); // We'll create this
}, [dispatch]);
  // Watch for registration result
// Watch ONLY for registration result (not old messages)
useEffect(() => {
  // Wait until registration is done (loading = false) and we have a fresh message
  if (loading) return; // Don't show anything while loading

  if (!message) return; // No message → do nothing

  // Only react to messages that come from registration
  if (message.includes('Successfully') || message.toLowerCase().includes('registered')) {
    setModalTitle('Success');
    setModalContent('User Registered Successfully!');
    setIsSuccess(true);
    setModalVisible(true);
  } else if (message && message !== 'New User - Register First') {
    // Only show error if it's NOT the old "New User" message
    setModalTitle('Registration Failed');
    setModalContent(message);
    setIsSuccess(false);
    setModalVisible(true);
  }
}, [message, loading]);

  // Open Gallery
  const handleGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to pick image');
          return;
        }
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          setProfileImageUri({ uri: asset.uri });
          setImageBase64(asset.base64 ? `data:${asset.type};base64,${asset.base64}` : '');
        }
      }
    );
  };

  // Format DOB to YYYY-MM-DD
  const formatDOB = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // "1998-08-12"
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!mobileNumber.match(/^\d{10}$/)) newErrors.mobileNumber = 'Enter valid 10-digit mobile';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Enter valid email';
    if (!gender) newErrors.gender = 'Select gender';
    if (!dateOfBirth) newErrors.dateOfBirth = 'Select date of birth';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!pincode.match(/^\d{6}$/)) newErrors.pincode = 'Enter valid 6-digit pincode';
    if (!stateName.trim()) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Registration
  const handleSubmit = () => {
    if (!validateForm()) {
      setModalTitle('Validation Error');
      setModalContent('Please fill all fields correctly');
      setIsSuccess(false);
      setModalVisible(true);
      return;
    }

    const payload = {
      name: fullName.trim(),
      mobile: mobileNumber,
      email: email.trim().toLowerCase(),
      gender,
      dob: formatDOB(dateOfBirth),
      address: address.trim(),
      city: city.trim(),
      pincode,
      state: stateName.trim(),
      image: imageBase64 || '',
    };

    console.log('Register Payload →', payload);
    dispatch(registerUser(payload));
  };

  const handleModalConfirm = () => {
    setModalVisible(false);
    if (isSuccess) {
      navigation.replace('LoginScreen'); // or 'Login' depending on your route name
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <Image
          source={require('../assets/icon2.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Profile Image */}
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={handleGallery}>
            <Image
              source={profileImageUri || require('../assets/profile1.png')}
              style={styles.profileImage}
            />
            <View style={styles.cameraIcon}>
              <Feather name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.formTitle}>User Registration</Text>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Harsha Kumar"
            placeholderTextColor="#000"
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
        </View>

        {/* Mobile */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="number-pad"
            maxLength={10}
            placeholder="9876543210"
            placeholderTextColor="#000"
          />
          {errors.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber}</Text>}
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="harsha.kumar@gmail.com"
            placeholderTextColor="#000"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Gender & DOB Row */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity
              style={styles.dropdownInput}
              onPress={() => setShowGenderDropdown(!showGenderDropdown)}
            >
              <Text style={{ color: gender ? '#000' : '#000' }}>
                {gender || 'Select Gender'}
              </Text>
              <Feather name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {showGenderDropdown && (
              <View style={styles.dropdownMenu}>
                {['Male', 'Female', 'Other'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setGender(g);
                      setShowGenderDropdown(false);
                      setErrors({ ...errors, gender: null });
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </View>

          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: dateOfBirth ? '#000' : '#999' }}>
                {dateOfBirth ? formatDOB(dateOfBirth) : 'YYYY-MM-DD'}
              </Text>
              <Feather name="calendar" size={20} color="#666" />
            </TouchableOpacity>
            {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
          </View>
        </View>

        {/* Address */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address / Street Name</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="45-2-16, Near Pushkar Ghat Road"
            placeholderTextColor="#000"
          />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
        </View>

        {/* City */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Rajahmundry"
            placeholderTextColor="#000"
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        </View>

        {/* Pincode & State Row */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              style={styles.input}
              value={pincode}
              onChangeText={setPincode}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="533101"
              placeholderTextColor="#000"
            />
            {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={stateName}
              onChangeText={setStateName}
              placeholder="Andhra Pradesh"
              placeholderTextColor="#000"
            />
            {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker */}
      <DatePicker
        modal
        open={showDatePicker}
        date={dateOfBirth || new Date()}
        mode="date"
        maximumDate={new Date()}
        onConfirm={(date) => {
          setShowDatePicker(false);
          setDateOfBirth(date);
          setErrors({ ...errors, dateOfBirth: null });
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      {/* Modal */}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        content={modalContent}
        onConfirm={handleModalConfirm}
        confirmText="OK"
        showCancelButton={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: { width: 160, height: 100, alignSelf: 'center', marginVertical: 10 },
  profileContainer: { alignItems: 'center', marginVertical: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#ddd' },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#001D4A',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  formTitle: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 20, color: '#000' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 8, color: '#333', fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', marginBottom: 16 },
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
    zIndex: 10,
  },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownItemText: { fontSize: 16 },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: { color: 'red', fontSize: 12, marginTop: 4 },
  submitButton: {
    backgroundColor: '#001D4A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});

export default RegisterManuallyScreen;
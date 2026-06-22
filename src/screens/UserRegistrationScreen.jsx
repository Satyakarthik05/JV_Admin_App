import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import Ionicons from "react-native-vector-icons/Ionicons";

const UserRegistrationScreen = () => {
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.mobile || !formData.email) {
      setModalMessage("Please fill all required fields");
      setModalVisible(true);
      return;
    }
    // ✅ Navigate to Home or next step here
    console.log("Registration success:", formData);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <Image
          source={require("../assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Profile Image */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/120" }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.sectionTitle}>User Registration</Text>

        {/* User Info */}
        <View style={styles.formGroup}>
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={formData.fullName}
            onChangeText={(val) => handleInputChange("fullName", val)}
          />
          <TextInput
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            style={styles.input}
            value={formData.mobile}
            onChangeText={(val) => handleInputChange("mobile", val)}
          />
          <TextInput
            placeholder="Email Address"
            keyboardType="email-address"
            style={styles.input}
            value={formData.email}
            onChangeText={(val) => handleInputChange("email", val)}
          />

          {/* Gender & DOB */}
          <View style={styles.row}>
            <TextInput
              placeholder="Gender"
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              value={formData.gender}
              onChangeText={(val) => handleInputChange("gender", val)}
            />
            <TextInput
              placeholder="Date of Birth"
              style={[styles.input, { flex: 1 }]}
              value={formData.dob}
              onChangeText={(val) => handleInputChange("dob", val)}
            />
          </View>
        </View>

        {/* Address Section */}
        <Text style={styles.sectionTitle}>Address & Location</Text>

        <View style={styles.formGroup}>
          <TextInput
            placeholder="Address / Street Name"
            style={styles.input}
            value={formData.address}
            onChangeText={(val) => handleInputChange("address", val)}
          />
          <TextInput
            placeholder="City"
            style={styles.input}
            value={formData.city}
            onChangeText={(val) => handleInputChange("city", val)}
          />
          <TextInput
            placeholder="Pincode"
            keyboardType="numeric"
            style={styles.input}
            value={formData.pincode}
            onChangeText={(val) => handleInputChange("pincode", val)}
          />
          <TextInput
            placeholder="State"
            style={styles.input}
            value={formData.state}
            onChangeText={(val) => handleInputChange("state", val)}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for Validation */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserRegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: responsiveWidth(5),
  },
  logo: {
    width: responsiveWidth(50),
    height: responsiveHeight(8),
    alignSelf: "center",
    marginBottom: responsiveHeight(2),
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: responsiveHeight(2),
  },
  profileImage: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: responsiveWidth(12.5),
    borderWidth: 2,
    borderColor: "#ddd",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: responsiveWidth(35),
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 6,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: "600",
    marginBottom: responsiveHeight(1),
    color: "#000",
  },
  formGroup: {
    marginBottom: responsiveHeight(2),
  },
  input: {
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 10,
    padding: responsiveHeight(1.5),
    marginBottom: responsiveHeight(1.5),
    fontSize: responsiveFontSize(1.8),
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: responsiveHeight(1.8),
    alignItems: "center",
    marginBottom: responsiveHeight(5),
  },
  submitText: {
    color: "#fff",
    fontSize: responsiveFontSize(2),
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "80%",
    padding: 20,
    alignItems: "center",
  },
  modalMessage: {
    fontSize: responsiveFontSize(2),
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: responsiveFontSize(1.8),
  },
});

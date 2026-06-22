import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { verifyLoginOtp, requestLoginOtp, resetOtpState } from "../redux/reducers/auth";

const OtpVerificationScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const mobile = route.params?.mobile || "9999999999";
  const { loading, message } = useSelector((state) => state.Auth);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Resend Timer
  const [seconds, setSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // Countdown Timer
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [seconds]);

  const handleResendOtp = async () => {
    if (!canResend) return;

    const resultAction = await dispatch(requestLoginOtp(mobile));

    if (requestLoginOtp.fulfilled.match(resultAction)) {
      setModalMessage("New OTP sent successfully!");
      setModalVisible(true);
      setSeconds(30);        // Reset timer
      setCanResend(false);   // Disable until countdown ends
      setOtp(["", "", "", ""]); // Clear OTP input
      inputRefs.current[0]?.focus();
    } else {
      const errMsg = resultAction.payload || "Failed to resend OTP";
      setModalMessage(errMsg);
      setModalVisible(true);
    }
  };

  const handleOtpChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
      if (!value && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 4) {
      setModalMessage("Please enter a valid 4-digit code");
      setModalVisible(true);
      return;
    }

    const resultAction = await dispatch(
      verifyLoginOtp({ mobile, otp: enteredOtp })
    );

    if (verifyLoginOtp.fulfilled.match(resultAction)) {
      Alert.alert("Success", "Login successful!", [
        {
          text: "OK",
          onPress: () => {
            navigation.replace("TabNavigator");
          },
        },
      ]);
    } else {
      const errorMsg = resultAction.payload || "Invalid or expired OTP";
      setModalMessage(errorMsg);
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <Image source={require("../assets/icon2.png")} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Enter verification code</Text>
      <Text style={styles.subtitle}>
        A code has been sent to <Text style={styles.phone}>+91 {mobile}</Text>
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            editable={!loading}
          />
        ))}
      </View>

      {/* Resend Section with Timer */}
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn’t receive code? </Text>
        {canResend ? (
          <TouchableOpacity onPress={handleResendOtp}>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.resendTimer}>
            Resend in {seconds}s
          </Text>
        )}
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
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

      {/* Verify Button */}
      <TouchableOpacity
        style={[styles.verifyButton, loading && { backgroundColor: "#666" }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.verifyText}>Verify</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OtpVerificationScreen;

// Styles remain exactly the same as you provided
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: responsiveWidth(50),
    height: responsiveHeight(15),
  },
  title: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: "600",
    color: "#000",
    marginBottom: responsiveHeight(1),
  },
  subtitle: {
    fontSize: responsiveFontSize(1.8),
    color: "#555",
    marginBottom: responsiveHeight(4),
  },
  phone: {
    fontWeight: "600",
    color: "#000",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: responsiveWidth(60),
    marginBottom: responsiveHeight(3),
  },
  otpInput: {
    width: responsiveWidth(12),
    height: responsiveHeight(6.5),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: responsiveFontSize(2.3),
    color: "#000",
    backgroundColor: "#fafafa",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: responsiveHeight(2),
  },
  resendText: {
    fontSize: responsiveFontSize(1.8),
    color: "#000",
  },
  resendLink: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: "600",
    color: "#001D4A",
  },
  verifyButton: {
    backgroundColor: "#001D4A",
    marginTop: responsiveHeight(5),
    width: responsiveWidth(50),
    height: responsiveHeight(6),
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyText: {
    color: "#fff",
    fontSize: responsiveFontSize(2),
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    width: responsiveWidth(70),
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: responsiveHeight(3),
    paddingHorizontal: responsiveWidth(5),
    alignItems: "center",
  },
  modalMessage: {
    fontSize: responsiveFontSize(2),
    color: "#000",
    marginBottom: responsiveHeight(2),
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#001D4A",
    borderRadius: 25,
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(10),
  },
  modalButtonText: {
    color: "#fff",
    fontSize: responsiveFontSize(1.9),
    fontWeight: "600",
  },
  resendTimer: {
  fontSize: responsiveFontSize(1.8),
  color: "#888",
  fontWeight: "600",
},
});
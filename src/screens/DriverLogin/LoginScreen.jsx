import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Pressable,
  Keyboard,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SignIn({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
      <View style={styles.main}>
        <StatusBar backgroundColor="#EF3D3B" barStyle="light-content" />

        {/* Top Red Section */}
        <View style={styles.topRed}>
          <Image
            source={require('../../assets/signin_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.signInWrapper}>
            <Text style={styles.signInText}>Sign In</Text>
          </View>
        </View>

        {/* Bottom White Section with Curved Top */}
        <View style={styles.bottomContainer}>
          <Text style={styles.subText}>
            Enter your phone number and password to sign in
          </Text>

          {/* Phone Number Field */}
          <View style={{ marginTop: responsiveHeight(2) }}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={10}
            />
          </View>



          {/* Password Field */}
          <View style={{ marginTop: responsiveHeight(2) }}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0 }]}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}>
                <Icon
                  name={showPassword ? 'eye-outline': 'eye-off-outline'}
                  size={22}
                  color="#EF3D3B"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Static Button (no action) */}
          <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate("BottomTabNav") }}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topRed: {
    height: responsiveHeight(28),
    width: responsiveWidth(100),
    backgroundColor: '#EF3D3B',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: responsiveHeight(4),
    paddingBottom: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(5),
    //borderBottomLeftRadius: 30,
    //borderBottomRightRadius: 30,
  },
  logo: {
    width: 220,
    height: 100,
  },
  signInWrapper: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: responsiveHeight(10),
  },
  signInText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom:10,

  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#fff',
    transform: [{ translateY: -responsiveHeight(2.0) }],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(3),
  },
  subText: {
    color: '#3D3D3D',
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#919191',
    color: '#000',
    paddingLeft: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#919191',
    paddingRight: 10,
  },
  eyeIcon: {
    paddingHorizontal: 4,
  },
  button: {
    marginTop: 60,
    backgroundColor: '#EF3D3B',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
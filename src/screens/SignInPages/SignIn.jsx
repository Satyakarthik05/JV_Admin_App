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
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fonts } from '../../config/theme';
import { useDispatch, useSelector } from 'react-redux';
import { requestLogin } from '../../redux/reducers/HRLogin/Login';
import { Roles } from '../../redux/reducers/HRLogin/Roles';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SignIn({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [valinationerror, setValidationError] = useState({});
  const passwordref = useRef();
  const [security, setSecurity] = useState(true);




  const validationLogin = () => {
    let newerror = {};
    const validatePhone = () => {
      const phoneRegex = /^[6-9][0-9]{9}$/;
      if (!phoneNumber) {
        newerror.phoneNumber = "Enter valid phone number";
        return false;
      } else if (!phoneRegex.test(phoneNumber)) {
        newerror.phoneNumber = "Enter valid 10-digit phone number starting with 6-9";
        return false;
      }
    };

    // const validatePassword = () => {
    //   const regex =
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
    //   if (!password) {
    //     newerror.password = "Enter password";
    //     return false;
    //   } else if (!regex.test(password)) {
    //     newerror.password = "Password must be 8+ chars with uppercase, lowercase, number & special char";
    //     return false;
    //   }
    // };

    const validatePassword = () => {
      if (!password) {
        newerror.password = "Enter password";
        return false;
      }

      return true;
    };




    validatePhone();
    validatePassword();

    setValidationError(newerror);
    return Object.keys(newerror).length === 0;
  }


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Roles());
  }, [])




  //Home  MasterData  Telecallerhome
  const handleLogin = () => {
    const isValid = validationLogin();

    if (!isValid) return;  //stop if validationfailes
    dispatch(
      requestLogin({
        mobileNumber: phoneNumber,
        password: password,
      })
    );

  }

  const { roleId, data, error, } = useSelector((state) => state.Login); // when we login here it will dispaly all the details abount that phone number and it id
  console.log("*************************Role From Login Redux code to My UI Page**************************", roleId);//role ID

  useEffect(() => {
    if (roleId === null || !data) return;

    const saveUserAndNavigate = async () => {
      try {
        //save complete userData to AsyncStorege
        await AsyncStorage.setItem("userData", JSON.stringify(data));

        const check = await AsyncStorage.getItem("userData");
        console.log("Stored Async Data: logended User Data------------->", JSON.parse(check));
       

        let routeName = "";
        

        if (roleId === 1) routeName = "adminhome";
        else if (roleId === 2) routeName = "hrlogin";
        else if (roleId === 3) routeName = "master";
        else if (roleId === 4) routeName = "telecaller";
        else if (roleId === 5) routeName = "production";
        else if (roleId === 6) routeName = "Accounts";
        else if (roleId === 7) routeName = "sales";
        else if (roleId === 8) routeName = "driver";

        if(routeName){
          navigation.dispatch(
            CommonActions.reset({
              index:0,
              routes:[{name:routeName}],
            })
          );
        }
        else{
          Alert.alert("Invalid details", "Please enter valid details");
        }

        setPhoneNumber("");
        setPassword("");
      }
      catch(error){
        console.log("Error saving user:", error);
      }
    }
    saveUserAndNavigate();
  },[roleId,data]);


  // for alert
  useEffect(() => {
    if (error) {
      Alert.alert("Login Failed", error);
    }
  }, [error]);//new for alert

  // const { roleId } = useSelector((state) => state.Login);
  // console.log("*************************Role From Login Redux code to My UI Page**************************", roleId);

  const { error: rolesError, loading, rolesData } = useSelector((state) => state.AllRoles);//we are showing roles in dropdown that data is here rolesData
  console.log("Roles in Login Screen ---------------------->", rolesData);


  console.log("Logined User Data in SignPage_________________________________________________________", data);//userData total logesData




  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
        <ScrollView style={styles.main} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
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
                style={[styles.input, valinationerror.phoneNumber ? styles.error_border : null]}
                placeholder="Phone Number"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={phoneNumber}
                // onChangeText={setPhoneNumber}
                onChangeText={(text)=>{
                  setPhoneNumber(text);
                  setValidationError((prev)=>({
                     ...prev,
                     phoneNumber: null, // ✅ clear error instantly
                  }))
                }}
                maxLength={10}
              />
            </View>
            {valinationerror.phoneNumber ? (
              <Text style={styles.error_text}>{valinationerror.phoneNumber}</Text>
            ) : null}

            {/* Password */}
            <View>
              <Text style={styles.label} >Password</Text>
              <TouchableOpacity
                style={[
                  styles.inputfield,
                  valinationerror.password ? styles.error_border : null,
                ]}
                onPress={() => passwordref.current?.focus()}
                activeOpacity={1}
              >
                <TextInput
                  style={[{ flex: 1 }, styles.inputfild_Text]}
                  placeholder="Enter Password"
                  placeholderTextColor="#888"
                  ref={passwordref}
                  value={password}
                  // onChangeText={setPassword}
                  onChangeText={(text)=>{
                  setPassword(text);
                  setValidationError((prev)=>({
                     ...prev,
                    password: null, // ✅ clear error instantly
                  }))
                }}
                  secureTextEntry={security}
                />
                <TouchableOpacity onPress={() => setSecurity(!security)}>
                  <Ionicons name={security ? "eye-off-outline" : "eye-outline"} size={22} color="#EF3D3B" style={styles.icon} />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>

            {valinationerror.password ? (
              <Text style={styles.error_text}>{valinationerror.password}</Text>
            ) : null}

            {/* Static Button (no action)  onPress={()=>{navigation.navigate("Home")}}*/}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  error_text: {
    color: colors.error,
    fontSize: 13,
    marginTop: 4,
    fontFamily: fonts.sfmedium,
  },
  error_border: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.error,
  },
  topRed: {
    height: responsiveHeight(28),
    width: responsiveWidth(100),
    backgroundColor: colors.commoncolor,
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
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
    fontFamily: fonts.sfbold,

  },
  bottomContainer: {
    flex: 1,
    backgroundColor: colors.white,
    transform: [{ translateY: -responsiveHeight(2.0) }],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(3),
  },
  subText: {
    color: colors.simpleblack,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: fonts.sfmedium,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    fontFamily: fonts.sfregular,
  },
  input: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    color: colors.black,
    fontFamily: fonts.sfmedium,
    paddingLeft: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 12,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    color: colors.inputfieldcolor,
    paddingRight: 10,
  },
  eyeIcon: {
    paddingHorizontal: 4,
  },
  button: {
    marginTop: 60,
    backgroundColor: colors.commoncolor,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    fontFamily: fonts.sfbold,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },


  inputfield: {
    //marginTop: 8,
    flexDirection: "row",
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 1.5,
  },
  inputfild_Text: {
    color: colors.black,
    fontFamily: fonts.sfmedium,
  },
});
















{/* Password Field */ }
{/* <View style={{ marginTop: responsiveHeight(2) }}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0 }, valinationerror.password ? styles.error_border : null]}
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
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color="#EF3D3B"
                />
              </TouchableOpacity>
              
            </View>
          </View> */}









// // for RoleName Based
// const role = data?.roleName?.toUpperCase();

// if (role === "ADMIN") routeName = "adminhome";
// else if (role === "HR") routeName = "hrlogin";
// else if (role === "MASTER") routeName = "master";
// else if (role === "TELECALLER") routeName = "telecaller";
// else if (role === "PRODUCTION") routeName = "production";
// else if (role === "ACCOUNTS") routeName = "Accounts";
// else if (role === "SALES") routeName = "sales";
// else if (role === "DRIVER") routeName = "driver";

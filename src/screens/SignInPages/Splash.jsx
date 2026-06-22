// src/screens/SplashScreen.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, ImageBackground, Image, StyleSheet, StatusBar, Text } from 'react-native';
import { useSelector } from 'react-redux';

const Splash = ({ navigation }) => {


  useEffect(()=>{
    const checkUserAndNavigate=async()=>{
      const storedUser=await AsyncStorage.getItem("userData");
     // console.log("logined user data in splash screen ------------->",userData || "not coming");
      

      setTimeout(()=>{
        if(storedUser){
          const user=JSON.parse(storedUser);
          //const role = user.roleName?.toUpperCase() || ""; // convert to uppercase  roleId roleName
           console.log("✅ Parsed User Data (Splash):****************Logned User Data storage in Splash Screen ", user);

          switch(user.roleId){
            case 1:
            navigation.replace("adminhome");
            break;
            case 2:
            navigation.replace("hrlogin");
            break;
          case 3:
            navigation.replace("master");
            break;
          case 4:
            navigation.replace("telecaller");
            break;
          case 5:
            navigation.replace("production");
            break;
          case 6:
            navigation.replace("Accounts");
            break;
          case 7:
            navigation.replace("sales");
            break;
          case 8:
            navigation.replace("driver");
            break;
          default:
            navigation.replace("Signin");
          }
        }
        else{
          navigation.replace("Signin");
        }
      },1000)//splash delay //HR MASTER  TELECALLER  PRODUCTION ACCOUNTS SALES DRIVER
    };
    checkUserAndNavigate();
  },[]);

  return (
    <ImageBackground
      source={require('../../assets/splash_bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content" // Change to "light-content" if background is dark
      />
      <View style={styles.content}>
        <Image
          source={require('../../assets/spalsh_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        {/* <Text style={styles.title}>Driver System</Text>
        <Text style={styles.tagline}>Smart Delivery. Smart Tracking.</Text> */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    // backgroundColor:"green",
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,   // Adjust size as needed
    height: 250,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000', // Change color if needed for visibility on background
    textAlign: 'center',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#333333', // Adjust for contrast
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Splash;


























// if client  role name based 
// const role = user.roleName?.toUpperCase(); // 👈 TAKE FROM HERE
// switch (role) {
//   case "ADMIN":
//     navigation.replace("adminhome");
//     break;
//   case "HR":
//     navigation.replace("hrlogin");
//     break;
//   case "MASTER":
//     navigation.replace("master");
//     break;
//   case "TELECALLER":
//     navigation.replace("telecaller");
//     break;
//   case "PRODUCTION":
//     navigation.replace("production");
//     break;
//   case "ACCOUNTS":
//     navigation.replace("Accounts");
//     break;
//   case "SALES":
//     navigation.replace("sales");
//     break;
//   case "DRIVER":
//     navigation.replace("driver");
//     break;
//   default:
//     navigation.replace("Signin");
// }
// src/screens/SplashScreen.js

import React, { useEffect } from 'react';
import { View, ImageBackground, Image, StyleSheet, StatusBar, Text } from 'react-native';
import { useSelector } from 'react-redux';

const Splash = ({ navigation }) => {
  const userId = useSelector((state) => state.Auth?.userId);

  console.log('SplashScreen → userId:', userId, '| Type:', typeof userId);

  useEffect(() => {
    const checkUserAndNavigate = () => {
      console.log('Deciding navigation... userId is:', userId);

      if (userId) {
        navigation.replace('TabNavigator');
      } else {
        // navigation.replace('LoginScreen');
        navigation.replace('Signin');
      }
    };

    const timer = setTimeout(checkUserAndNavigate, 2000);
    return () => clearTimeout(timer);
  }, [navigation, userId]);

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
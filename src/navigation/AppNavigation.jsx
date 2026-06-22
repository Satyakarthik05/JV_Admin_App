import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Image, Pressable, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SplashScreen from "../screens/DriverLogin/SplashScreen";
import MyCoupons from "../screens/DriverLogin/Customers";
import LoginScreen from "../screens/DriverLogin/LoginScreen";
// import OtpVerificationScreen from "../screens/OtpVerificationScreen";
// import UserRegistrationScreen from "../screens/UserRegistrationScreen";
// import RestaurantsListScreen from "../screens/RestaurantsListScreen";
// import CoffeeOfferScreen from "../screens/CoffeeOfferScreen";
// import CouponsListScreen from "../screens/CouponsListScreen";
import MyCouponHistory from "../screens/DriverLogin/ExpensesScreen";
// import RegisterManuallyScreen from "../screens/RegisterManuallyScreen";
import Rewards from "../screens/DriverLogin/ReturnsSummaryScreen";
import Home from "../screens/DriverLogin/Home";
// import QRScannerScreen from "../screens/QRScannerScreen";
import MyDelivery_Routes from "../screens/DriverLogin/MyDelivery_Routes";
import Profile from "../screens/Profile";
import AddExpenseScreen from "../screens/DriverLogin/AddExpenseScreen";
import Vehicle_Reading from "../screens/DriverLogin/Vehicle_Reading";
import CustomerList from "../screens/DriverLogin/CustomerList";
import CustomerDetails from "../screens/DriverLogin/CustomerDetails";
import CreateSale from "../screens/DriverLogin/Createsale";
import PaymentScreen from "../screens/DriverLogin/Payment";
import SaleCompleted from "../screens/DriverLogin/SaleCompleted";
import AddCustomerScreen from "../screens/DriverLogin/AddcustomerScreen";
import AddReturnScreen from "../screens/DriverLogin/AddReturnScreen";
import DailyReports from "../screens/DriverLogin/DailyClosingReport";
import PaymentDetails from "../screens/DriverLogin/PaymentDetails";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Dummy component for Scan tab
const ScanPlaceholder = () => null;

// Bottom Tab Navigator Component
const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarPressColor: "transparent",
        tabBarPressOpacity: 1,
        tabBarIcon: ({ color, focused }) => {
          if (route.name === "Home") {
            return (
              <View style={styles.tabIconContainer}>
                {focused && <View style={styles.activeTabLine} />}
                <Image
                  source={
                    focused
                      ? require('../assets/homefill.png')
                      : require('../assets/homeoutline.png')
                  }
                  style={styles.tabIcon}
                />
              </View>
            );
          }

          if (route.name === "MyCoupons") {
            return (
              <View style={styles.tabIconContainer}>
                {focused && <View style={styles.activeTabLine} />}
                <Image
                  source={
                    focused
                      ? require('../assets/couponfill.png')
                      : require('../assets/couponoutline.png')
                  }
                  style={styles.tabIcon}
                />
              </View>
            );
          }

          if (route.name === "Scan") {
            return null;
          }

          if (route.name === "History") {
            return (
              <View style={styles.tabIconContainer}>
                {focused && <View style={styles.activeTabLine} />}
                <Image
                  source={
                    focused
                      ? require('../assets/historyfill.png')
                      : require('../assets/historyoutline.png')
                  }
                  style={styles.tabIcon}
                />
              </View>
            );
          }

          if (route.name === "Rewards") {
            return (
              <View style={styles.tabIconContainer}>
                {focused && <View style={styles.activeTabLine} />}
                <Image
                  source={
                    focused
                      ? require('../assets/rewardfill.png')
                      : require('../assets/rewardoutline.png')
                  }
                  style={styles.tabIcon}
                />
              </View>
            );
          }

          return null;
        },
        tabBarActiveTintColor: "#002161",
        tabBarInactiveTintColor: "#6D6D6D",
        tabBarStyle: {
          height: (Platform.OS === 'ios' ? 85 : 65) + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
          paddingTop: 8,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0e8e8',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="MyCoupons"
        component={MyCoupons}
        options={{
          tabBarLabel: "Customers",
        }}
      />
      <Tab.Screen
        name="History"
        component={MyCouponHistory}
        options={{
          tabBarLabel: "Expenses",
        }}
      />
      <Tab.Screen
        name="Rewards"
        component={Rewards}
        options={{
          tabBarLabel: "Returns",
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigation
const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        {/* Main App with Bottom Tabs */}
        {/* <Stack.Screen name="MainApp" component={TabNavigator} /> */}
        {/* Additional Screens outside tabs */}
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="MyDelivery_Routes" component={MyDelivery_Routes} />
        <Stack.Screen name="AddExpenseScreen" component={AddExpenseScreen} />
        <Stack.Screen name="Vehicle_Reading" component={Vehicle_Reading} />
        <Stack.Screen name="CustomerList" component={CustomerList} />
        <Stack.Screen name="CustomerDetails" component={CustomerDetails} />
        <Stack.Screen name="CreateSale" component={CreateSale} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="SaleCompleted" component={SaleCompleted} />
        <Stack.Screen name="AddCustomerScreen" component={AddCustomerScreen} />
        <Stack.Screen name="AddReturnScreen" component={AddReturnScreen} />
        <Stack.Screen name="DailyReports" component={DailyReports} />
        <Stack.Screen name="PaymentDetails" component={PaymentDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabLine: {
    position: 'absolute',
    top: -15,
    width: 30,
    height: 3,
    backgroundColor: '#002161',
    borderRadius: 2,
  },
  tabIcon: {
    width: 22,
    height: 22,
  },
  centerTabButton: {
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCircleOuter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  centerCircle: {
    width: 50,
    height: 50,
    borderRadius: 31,
    backgroundColor: '#002161',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerIcon: {
    width: 25,
    height: 25,
    tintColor: '#fff',
  },
});

export default AppNavigation;

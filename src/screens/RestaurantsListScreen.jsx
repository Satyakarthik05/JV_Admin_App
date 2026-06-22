
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import Toast from 'react-native-toast-message';

const RestaurantsListScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  // Receive data from HomeScreen
  const { categoryName = "Category", stores = [] } = route.params || {};

  const [favorited, setFavorited] = useState();

  useEffect(() => {
    console.log("RestaurantsListScreen Received:");
    console.log("Category:", categoryName);
    console.log("Stores Count:", stores.length);
  }, [categoryName, stores]);

  const toggleFavorite = (vendorId) => {
    setFavorited((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(vendorId)) {
        newSet.delete(vendorId);
        Toast.show({
          type: 'info',
          text1: 'Removed from wishlist',
          position: 'top',
        });
      } else {
        newSet.add(vendorId);
        Toast.show({
          type: 'success',
          text1: 'Added to wishlist!',
          position: 'top',
        });
      }
      return newSet;
    });
  };

  const renderItem = ({ item }) => {
    const isFavorited = favorited.has(item.vendorId);

    return (
      <View style={styles.listItem}>
        <TouchableOpacity
          style={styles.itemLeft}
          onPress={() => {
            // CORRECT: Pass only vendorId
            navigation.navigate("CouponsListScreen", {
              vendorId: item.vendorId,
            });
          }}
        >
          <Image
            source={{ uri: item.logo }}
            style={styles.logo}
            resizeMode="cover"
            defaultSource={require("../assets/profile1.png")}
          />
          <View style={styles.textContainer}>
            <Text style={styles.restaurantName}>{item.shopName}</Text>
            <Text style={styles.subText}>View Coupons & Offers</Text>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleFavorite(item.vendorId)}
        >
          <Ionicons
            name={isFavorited ? "heart" : "heart-outline"}
            size={26}
            color={isFavorited ? "#FF0000" : "#888"}
          />
        </TouchableOpacity> */}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {categoryName}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#000" style={{ marginLeft: 6 }} />
        </View>

        <View style={{ width: 26 }} />
      </View>

      {/* Stores List */}
      <FlatList
        data={stores}
        renderItem={renderItem}
        keyExtractor={(item) => item.vendorId.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: responsiveHeight(6),
        }}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: responsiveFontSize(2), color: '#999' }}>
              No stores found in this category
            </Text>
          </View>
        }
      />

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginLeft: -40,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: "700",
    color: "#000",
    maxWidth: responsiveWidth(65),
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2.2),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    borderRadius: 14,
    marginRight: responsiveWidth(4),
    backgroundColor: "#f5f5f5",
  },
  textContainer: {
    flex: 1,
  },
  restaurantName: {
    fontSize: responsiveFontSize(2.1),
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  subText: {
    fontSize: responsiveFontSize(1.7),
    color: "#16A34A",
    fontWeight: "600",
  },
  heartButton: {
    padding: responsiveWidth(3),
  },
});

export default RestaurantsListScreen;
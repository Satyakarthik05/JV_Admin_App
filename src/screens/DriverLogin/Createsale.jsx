import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

import { colors } from "../../config/theme";
import commonstyles from "../../commonstyles/commonstyles";
import { fetchDriverAssignedStock } from "../../redux/reducers/DriverLogin/DriverStock";

const CreateSale = ({ route }) => {
  const { customer } = route.params || {};
  console.log(customer, ">>>>>>>>>>>>>>customer")
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [userData, setUserData] = useState(null);
  const [search, setSearch] = useState("");
  const [cartQty, setCartQty] = useState({});
  const [returnType, setReturnType] = useState("with");

  const { assignedStock } = useSelector((state) => state.DriverStock);
  console.log("Assigned Stock Data --------------------->", assignedStock);


  const stockData = assignedStock?.data?.items || [];

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (userData?.id) {
      dispatch(fetchDriverAssignedStock(userData.id));
    }
  }, [userData?.id, dispatch]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white);
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  const getItemKey = (item, index) =>
    String(item?.id ?? item?.productId ?? item?.stockId ?? index);

  const filteredData = useMemo(() => {
    return stockData.filter((item) =>
      item?.productName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [stockData, search]);

  // const increaseQty = (item, index) => {
  //   const key = getItemKey(item, index);

  //   setCartQty((prev) => ({
  //     ...prev,
  //     [key]: (prev[key] || 0) + 1,
  //   }));
  // };

  const increaseQty = (item, index) => {
    const key = getItemKey(item, index);
    const currentQty = cartQty[key] || 0;
    const maxQty = Number(item?.quantity || 0);

    if (currentQty >= maxQty) {
      return; // ❌ stop increment
    }

    setCartQty((prev) => ({
      ...prev,
      [key]: currentQty + 1,
    }));
  };

  const decreaseQty = (item, index) => {
    const key = getItemKey(item, index);

    setCartQty((prev) => ({
      ...prev,
      [key]: Math.max((prev[key] || 0) - 1, 0),
    }));
  };

  const totalItems = Object.values(cartQty).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const totalAmount = stockData.reduce((sum, item, index) => {
    const key = getItemKey(item, index);
    const qty = cartQty[key] || 0;
    return sum + qty * Number(item?.sellingPrice || 0);
  }, 0);


  const selectedProducts = stockData
    .map((item, index) => {
      const key = getItemKey(item, index);
      const qty = cartQty[key] || 0;

      if (qty > 0) {
        return {
          id: item.id,
          productName: item.productName,
          imageUrl: item.imageUrl,
          price: item.sellingPrice,
          availableQty: item.quantity,
          orderQty: qty,
          itemTotal: qty * Number(item.sellingPrice),
        };
      }

      return null;
    })
    .filter(Boolean);

  const orderDetails = {
    customerName: customer?.shopName || "",
    returnType: returnType,
    totalItems: totalItems,
    totalAmount: totalAmount,
    products: selectedProducts,
  };

  const renderItem = ({ item, index }) => {
    const key = getItemKey(item, index);
    const qty = cartQty[key] || 0;
    const itemTotal = qty * Number(item?.sellingPrice || 0);

    return (
      <View style={styles.card}>
        <Image
          source={{
            uri:
              item?.imageUrl ||
              "https://via.placeholder.com/100x100.png?text=No+Image",
          }}
          style={styles.image}
        />

        <View style={styles.details}>
          <Text style={styles.name}>{item?.productName}</Text>
          <Text style={styles.price}>₹ {item?.sellingPrice}</Text>
          <Text style={styles.available}>
            Available: {item?.quantity}
          </Text>
        </View>

        <View style={styles.rightsection}>
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => decreaseQty(item, index)}
            >
              <Text style={styles.qtySymbol}>−</Text>
            </TouchableOpacity>

            <Text style={styles.qtyNumber}>{qty}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => increaseQty(item, index)}
            >
              <Text style={styles.qtySymbol}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.total}>₹ {itemTotal}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Create Sale</Text>
          <Text style={styles.headerSub}>{customer?.shopName || ""}</Text>
        </View>
      </View>

      <View style={styles.line} />

      {/* Search */}
      <View style={styles.searchBox}>
        <EvilIcons name="search" size={28} color="#9CA3AF" />
        <TextInput
          placeholder="Search Item Name"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => getItemKey(item, index)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListFooterComponent={
          <View>
            {/* Return Options */}
            <TouchableOpacity
              style={styles.returnContainer}
              onPress={() => setReturnType("with")}
            >
              <View style={styles.radioOuter}>
                {returnType === "with" && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.returnText}>With Can Return</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.returnContainer}
              onPress={() => setReturnType("without")}
            >
              <View style={styles.radioOuterInactive}>
                {returnType === "without" && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.returnText}>
                Without Can Return
              </Text>
            </TouchableOpacity>

            {/* Offer */}
            <View style={styles.offerBox}>
              <View style={styles.offerTag}>
                <Text style={styles.offerTagText}>
                  Offer Available
                </Text>
              </View>

              <Text style={styles.offerMainText}>
                10% Cashback Offer Applied
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.offerBtnRow}>
              <TouchableOpacity style={styles.offerBtn}>
                <Text style={styles.offerBtnText}>
                  Apply offer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.offerBtn}>
                <Text style={styles.offerBtnText}>
                  Remove Offer
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Payment */}
            <View style={styles.paymentContainer}>
              <View>
                <Text style={styles.qtyLabel}>
                  Qty:{" "}
                  <Text style={styles.qtyValue}>
                    {totalItems} Items
                  </Text>
                </Text>

                <Text style={styles.totalLabel}>
                  Estimated Total: ₹ {totalAmount}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.paymentBtn}
                onPress={() =>
                  navigation.navigate("PaymentScreen", {
                    orderDetails: orderDetails,
                    customer: customer,
                  })
                }
              >
                <Text style={styles.paymentText}>Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default CreateSale;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: "#fff",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    paddingTop: 10
  },

  headerSub: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  line: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  searchBox: {
    marginHorizontal: 14,
    marginVertical: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  searchInput: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: "#111827",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginBottom: 14,
    borderRadius: 16,
    padding: 12,
    elevation: 2,
  },

  image: {
    width: 105,
    height: 105,
    resizeMode: "contain",
    borderRadius: 12,
    backgroundColor: "#fff",
  },

  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#16A34A",
    marginTop: 8,
  },

  available: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 12,
  },

  rightsection: {
    justifyContent: "space-between",
    alignItems: "center",
  },

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 6,
  },

  qtyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  qtySymbol: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
  },

  qtyNumber: {
    minWidth: 30,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  total: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF3B30",
    marginBottom: 8,
  },

  returnContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginBottom: 14,
    borderRadius: 16,
    padding: 18,
    elevation: 2,
  },

  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
  },

  radioOuterInactive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CFCFCF",
    justifyContent: "center",
    alignItems: "center",
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF3B30",
  },

  returnText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },

  offerBox: {
    marginHorizontal: 14,
    marginTop: 4,
    backgroundColor: "#DDF5E5",
    borderWidth: 1.5,
    borderColor: "#00B140",
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  offerTag: {
    position: "absolute",
    top: -12,
    left: 16,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },

  offerTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  offerMainText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  offerBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 14,
    marginTop: 24,
  },

  offerBtn: {
    width: "48%",
    borderWidth: 1.5,
    borderColor: "#FF3B30",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  offerBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  paymentContainer: {
    marginTop: 24,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  qtyLabel: {
    fontSize: 16,
    color: "#4B5563",
  },

  qtyValue: {
    fontWeight: "700",
    color: "#111827",
  },

  totalLabel: {
    marginTop: 8,
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "500",
  },

  paymentBtn: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 38,
    paddingVertical: 16,
    borderRadius: 14,
  },

  paymentText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
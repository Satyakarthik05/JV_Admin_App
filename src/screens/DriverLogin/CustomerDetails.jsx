import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

import {
  responsiveWidth,
} from "react-native-responsive-dimensions";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import { launchImageLibrary } from "react-native-image-picker";
import { colors } from "../../config/theme";
import commonstyles from "../../commonstyles/commonstyles";

import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchDriverAssignedStock } from "../../redux/reducers/DriverLogin/DriverStock";
import api from "../../utils/api";

const CustomerDetails = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.Login);
  const { assignedStock } = useSelector((state) => state.DriverStock);

  const { customers } = route?.params || {};
  console.log("customers Data coming in params--------------->",customers);
  

  const [userData, setUserData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  console.log(salesData,">>>>>sales")

  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [photo, setPhoto] = useState(null);

  const loginData = data || userData;

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white);
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (loginData?.id) {
      dispatch(fetchDriverAssignedStock(loginData.id));
    }
  }, [loginData?.id]);

  useEffect(() => {
    if (customers?.mobile) {
      getSalesHistory();
    }
  }, [customers]);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSalesHistory = async () => {
    try {
      const res = await api.get(
        `customer-transactions?customerMobile=${customers?.mobile}`
      );
      console.log(res?.data?.data, ">>>>>sales data");
      setSalesData(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) return;

        if (response.assets?.length > 0) {
          setPhoto(response.assets[0].uri);
        }
      }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.saleNameContainer}>
      <Text style={styles.saletitle}>
        {item?.transactionType }
      </Text>

      <View style={styles.dateContainer1}>
        <Text style={commonstyles.text8}>
          {new Date(item?.saleDate).toLocaleDateString("en-GB")}
        </Text>

        <Text
          style={[
            commonstyles.header1,
            { color: colors.btntextgreen },
          ]}
        >
          ₹{item?.amount || 0}
        </Text>
      </View>

      <View style={styles.line} />
    </View>
  );

  return (
    <>
      <SafeAreaView style={styles.Maincontainer}>
        <View style={styles.ListContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>

          <Text style={styles.ListText}>Customer Details</Text>
        </View>

        <View style={styles.line} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.StoreContainer}>
            <Text style={styles.storeText}>
              {customers?.shopName}
            </Text>

            <View style={styles.callContainer}>
              <Ionicons name="call-outline" size={22} color="#292D32" />
              <Text style={commonstyles.text5}>
                {customers?.mobile}
              </Text>
            </View>

            <View style={styles.line} />
          </View>

          <View style={styles.OutstandingContainer}>
            <Text style={styles.outstandingText}>₹ Outstanding</Text>

            <Text style={styles.outstandingText}>
              ₹
              {customers?.outstandingAmount?.toLocaleString("en-IN") || 0}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.shoppingContainer}
            onPress={() =>
              navigation.navigate("CreateSale", {
                customer: customers,
              })
            }
          >
            <FontAwesome5
              name="shopping-cart"
              size={22}
              color="#fff"
            />

            <View style={styles.saleContainer}>
              <Text style={styles.saleText}>Create Sale</Text>
              <Text style={styles.saleText1}>
                Add new order for customer
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shoppingContainer1}
            onPress={() => navigation.navigate("RecordPayment",{customersdata:customers})}
          >
            <MaterialIcons
              name="payments"
              size={22}
              color="#fff"
            />

            <View style={styles.saleContainer}>
              <Text style={styles.saleText}>Record Payment</Text>
              <Text style={styles.saleText1}>
                Collect outstanding payment
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shoppingContainer2}
            onPress={() => setModalVisible(true)}
          >
            <FontAwesome6
              name="delete-left"
              size={22}
              color="#fff"
            />

            <View style={styles.saleContainer}>
              <Text style={styles.saleText}>No Sale</Text>
              <Text style={styles.saleText1}>
                Record visit without sale
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.recentActive}>
              Recent Activity
            </Text>

            <FlatList
              data={salesData}
              keyExtractor={(item, index) =>
                index.toString()
              }
              renderItem={renderItem}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>No Sale Reason</Text>

            <TextInput
              placeholder="Enter reason"
              placeholderTextColor="#ccc"
              value={reason}
              onChangeText={setReason}
              style={styles.input}
              multiline
            />

            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={pickImage}
            >
              <Text style={styles.uploadText}>
                {photo ? "Change Photo" : "Upload Photo"}
              </Text>
            </TouchableOpacity>

            {photo && (
              <Image
                source={{ uri: photo }}
                style={styles.previewImage}
              />
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => {
                  console.log(reason, photo);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CustomerDetails;

const styles = StyleSheet.create({
  Maincontainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  ListContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 15,
  },

  ListText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
  },

  StoreContainer: {
    padding: 15,
  },

  storeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },

  callContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },

  OutstandingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FEF2F2",
    margin: 12,
    padding: 12,
    borderRadius: 10,
  },

  outstandingText: {
    color: "#E7000B",
    fontWeight: "700",
  },

  shoppingContainer: {
    backgroundColor: "#3A77FB",
    margin: 10,
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },

  shoppingContainer1: {
    backgroundColor: "#00A63E",
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    marginBottom: 10,
  },

  shoppingContainer2: {
    backgroundColor: "#767676",
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },

  saleContainer: {
    gap: 4,
  },

  saleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  saleText1: {
    color: "#fff",
    fontSize: 13,
  },

  card: {
    backgroundColor: "#fff",
    margin: 12,
    padding: 14,
    borderRadius: 12,
    elevation: 4,
  },

  recentActive: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  saleNameContainer: {
    paddingVertical: 10,
  },

  saletitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },

  dateContainer1: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  line: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginTop: 8,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    minHeight: 80,
    padding: 10,
    marginBottom: 10,
  },

  uploadBtn: {
    borderWidth: 1,
    borderColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  uploadText: {
    color: "red",
    fontWeight: "700",
  },

  previewImage: {
    height: 120,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: "#999",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  submitBtn: {
    flex: 1,
    backgroundColor: "#ff3b30",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';

const PaymentScreen = ({ route }) => {
  const navigation = useNavigation();

  const { orderDetails = {}, customer = {} } = route.params || {};
  console.log(orderDetails, '>>>>>>>>> Order details details')
  console.log(customer, "customer")
  const {
    customerName = 'Customer',
    totalAmount = 0,
    products = [],
    returnType = 'with',
  } = orderDetails;

  const [image, setImage] = useState(null);
  const [receivedAmount, setReceivedAmount] = useState(String(totalAmount));
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [driverId, setDriverId] = useState(null);

  useEffect(() => {
    const loadDriver = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed?.id != null) setDriverId(parsed.id);
        }
      } catch (e) {
        // ignore - screen can still render without driver id
      }
    };
    loadDriver();
  }, []);

  const balance = useMemo(() => {
    const paid = Number(receivedAmount || 0);
    return Math.max(totalAmount - paid, 0);
  }, [receivedAmount, totalAmount]);

  const openImagePicker = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1, includeBase64: true, selectionLimit: 1 },
      response => {
        if (response?.assets?.length > 0) {
          setImage(response.assets[0]);
        }
      },
    );
  };

  const PaymentOption = ({ label, value }) => (
    <TouchableOpacity
      style={[
        styles.optionBox,
        paymentMethod === value && styles.optionBoxActive,
      ]}
      onPress={() => setPaymentMethod(value)}>
      <Text
        style={[
          styles.optionText,
          paymentMethod === value && styles.optionTextActive,
        ]}>
        {label}
      </Text>

      <View
        style={[
          styles.radioOuter,
          paymentMethod === value && styles.radioOuterActive,
        ]}>
        {paymentMethod === value && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );

  const handleSalePlace = async () => {
    const paymentType =
      paymentMethod === 'cash'
        ? 'CASH'
        : paymentMethod === 'qr'
          ? 'QR'
          : 'CREDIT';

    const saleDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const collectedAmount = Number(receivedAmount || 0);

    const items = (products || []).map(p => ({
      productId: p?.id ?? p?.productId,
      productName: p?.productName,
      quantity: Number(p?.orderQty || 0),
      rate: Number(p?.price || 0),
    }));

    const payload = {
      saleType: 'ROUTE',
      driverId: Number(driverId || 0),
      customerName: orderDetails?.customerName,
      customerMobile: customer?.mobile || '',
      customerId: customer?.customerId || null,

      saleDate,
      items,
      totalAmount: Number(totalAmount || 0),
      collectedAmount,
      remarks: collectedAmount < Number(totalAmount || 0) ? 'Partial payment' : '',
      image: image?.base64 || null,
      receiptImageMimeType: image?.type || null,
      receiptImageFileName: image?.fileName || null,
    };
    console.log(payload, ">>>>payload for conform payment")

    try {
      const res = await api.post('driver-sales', payload);
      console.log('driver-sales response', res?.data);
      navigation.navigate('SaleCompleted', {
        orderDetails,
        paymentMethod,
        receivedAmount,
        receiptImage: image,
        saleResponse: res?.data,
      });
      if (res?.data == 200) {
        Alert.alert('Success', 'Sale recorded successfully',);
      }
    } catch (e) {
      console.log('driver-sales error', e?.response?.data || e?.message || e);
    }
  };

  const isDisabled = !products.length || totalAmount === 0;

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Payment</Text>
          <Text style={styles.headerSub}>{customerName}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Bill Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>

          {products.map((item, index) => (
            <View key={index} style={styles.productRow}>
              <Image source={{ uri: item.imageUrl }} style={styles.productImg} />

              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.productName}>{item.productName}</Text>

                <Text style={styles.qtyText}>
                  Qty: {item.orderQty} x ₹{item.price}
                </Text>
              </View>

              <Text style={styles.itemTotal}>₹{item.itemTotal}</Text>
            </View>
          ))}

          <View style={styles.line} />

          <View style={styles.totalBox}>
            <Text style={styles.totalText}>Bill Total</Text>
            <Text style={styles.totalText}>₹ {totalAmount}</Text>
          </View>

          <Text style={styles.returnType}>
            Return Type:{' '}
            {returnType === 'with' ? 'With Can Return' : 'Without Can Return'}
          </Text>
        </View>

        {/* Offer */}
        <View style={styles.offerBox}>
          <View style={styles.offerTag}>
            <Text style={styles.offerTagText}>Offer Available</Text>
          </View>
          <Text style={styles.offerMain}>10% Cashback Offer Applied</Text>
        </View>

        {/* Amount Received */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Amount Received</Text>

          <TextInput
            value={receivedAmount}
            onChangeText={setReceivedAmount}
            keyboardType="numeric"
            placeholder="Enter Amount"
            style={styles.input}
          />

          {balance > 0 && (
            <Text style={styles.balanceText}>
              Remaining Balance: ₹ {balance}
            </Text>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <PaymentOption label="Cash" value="cash" />
          <PaymentOption label="QR" value="qr" />
          <PaymentOption label="Credit (Outstanding)" value="credit" />

          {paymentMethod === 'qr' && (
            <View style={styles.qrBox}>
              <Image
                source={require('../../assets/qrcode.png')}
                style={{ width: 140, height: 140 }}
                resizeMode="contain"
              />
              <Text style={styles.qrAmount}>₹ {totalAmount}</Text>
            </View>
          )}
        </View>

        {/* Upload Receipt */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Upload Receipt (Optional)</Text>

          <TouchableOpacity style={styles.uploadBox} onPress={openImagePicker}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
            ) : (
              <>
                <Ionicons name="camera-outline" size={26} color="#6B7280" />
                <Text style={{ marginTop: 8 }}>Upload payment photo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Success */}
        {products.length > 0 && totalAmount > 0 && (
          <View style={styles.successBox}>
            <FontAwesome name="check-circle" size={20} color="#16A34A" />
            <Text style={styles.successText}>Payment done successfully</Text>
          </View>
        )}

        {/* Buttons */}
        {/* <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.confirmBtn} onPress={handleSalePlace}  >
            <Text style={styles.confirmText}>Confirm & Generate Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn}>
            <FontAwesome name="share" size={20} color="#fff" />
          </TouchableOpacity>
        </View> */}

        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={[styles.confirmBtn, isDisabled && { backgroundColor: "#ccc" }]}
            disabled={isDisabled}
            onPress={() => {
              if (isDisabled) {
                Alert.alert("Error", "No items added. Please add products.");
                return;
              }
              handleSalePlace();
            }}
          >
            <Text style={styles.confirmText}>Confirm & Generate Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn}>
            <FontAwesome name="share" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F3F4F6' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  headerSub: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },

  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  productImg: {
    width: 55,
    height: 55,
    borderRadius: 10,
  },

  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  qtyText: {
    marginTop: 4,
    color: '#6B7280',
  },

  itemTotal: {
    fontWeight: '700',
    color: '#111827',
  },

  line: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },

  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF6F6',
    padding: 12,
    borderRadius: 10,
  },

  totalText: {
    color: '#EF3D3B',
    fontWeight: '700',
  },

  returnType: {
    marginTop: 10,
    color: '#374151',
    fontWeight: '500',
  },

  offerBox: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#DDF5E5',
    borderWidth: 1,
    borderColor: '#00B140',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    position: 'relative',
  },

  offerTag: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: '#EF3D3B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  offerTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  offerMain: {
    fontWeight: '700',
    color:"#000",
  },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    color:"#000",
  },

  balanceText: {
    marginTop: 10,
    color: '#EF3D3B',
    fontWeight: '600',
  },

  optionBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  optionBoxActive: {
    borderColor: '#EF3D3B',
    backgroundColor: '#FFF6F6',
  },

  optionText: {
    color: '#111827',
  },

  optionTextActive: {
    fontWeight: '700',
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CFCFCF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOuterActive: {
    borderColor: '#EF3D3B',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF3D3B',
  },

  qrBox: {
    alignItems: 'center',
    paddingVertical: 10,
  },

  qrAmount: {
    marginTop: 8,
    fontWeight: '700',
  },

  uploadBox: {
    height: 180,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },

  successBox: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#ECFDF5',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  successText: {
    color: '#065F46',
    fontWeight: '600',
  },

  bottomRow: {
    flexDirection: 'row',
    margin: 12,
    alignItems: 'center',
  },

  confirmBtn: {
    flex: 1,
    backgroundColor: '#EF3D3B',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginRight: 10,
  },

  confirmText: {
    color: '#fff',
    fontWeight: '700',
  },

  shareBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EF3D3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

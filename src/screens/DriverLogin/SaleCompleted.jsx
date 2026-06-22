import React, { useCallback } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Share,
  PermissionsAndroid,
  Platform,
  BackHandler,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import commonstyles from '../../commonstyles/commonstyles';
//import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

const SaleCompleted = ({ route, navigation }) => {
  const {
    orderDetails = {},
    customer = {},
    saleResponse = {},
    receivedAmount = 0,
    paymentMethod = 'cash',
  } = route.params || {};

  const products = Array.isArray(orderDetails?.products)
    ? orderDetails.products
    : [];

  const totalAmount = Number(orderDetails?.totalAmount || 0);
  const paidAmount = Number(receivedAmount || 0);
  const balance = Math.max(totalAmount - paidAmount, 0);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#00A63E');
      StatusBar.setBarStyle('light-content');
    }, []),
  );


  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'DriverHome' }],
        });
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove(); // ✅ correct way
    }, [navigation])          
  );

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS !== 'android') {
        return true;
      }

      if (Platform.Version >= 33) {
        return true;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs storage permission to save PDF',
          buttonPositive: 'Allow',
        },
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      return false;
    }
  };

  const generateHtml = () => {
    const rows = products
      .map(item => {
        const qty = Number(item?.orderQty || item?.quantity || 0);
        const rate = Number(item?.price || item?.rate || 0);
        const itemTotal = Number(item?.itemTotal || qty * rate);

        return `
          <tr>
            <td>${item?.productName || 'Product'}</td>
            <td>${qty}</td>
            <td>₹${rate}</td>
            <td>₹${itemTotal}</td>
          </tr>
        `;
      })
      .join('');

    return `
      <html>
        <body style="padding:20px;font-family:Arial;">
          <h1 style="text-align:center;color:#00A63E;">JAVAJ INVOICE</h1>
          <hr />

          <p><b>Invoice No:</b> ${saleResponse?.orderNo || 'INV001'}</p>
          <p><b>Date:</b> ${new Date().toLocaleDateString()}</p>

          <h3>Customer Details</h3>
          <p>${orderDetails?.customerName || customer?.customerName || ''}</p>
          <p>${orderDetails?.customerMobile || customer?.mobile || ''}</p>
          <p>${customer?.address || ''}</p>

          <h3>Products</h3>

          <table border="1" cellspacing="0" cellpadding="8" width="100%">
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
            ${rows}
          </table>

          <h3 style="margin-top:20px;">Summary</h3>
          <p>Total: ₹${totalAmount}</p>
          <p>Paid: ₹${paidAmount}</p>
          <p>Balance: ₹${balance}</p>

          <p><b>Payment:</b> ${paymentMethod.toUpperCase()}</p>

          <br />
          <h3 style="text-align:center;">Thank You!</h3>
        </body>
      </html>
    `;
  };

  // const handleDownload = async () => {
  //   try {
  //     const allowed = await requestStoragePermission();

  //     if (!allowed) {
  //       Alert.alert('Permission Denied');
  //       return;
  //     }

  //     const fileName = `Invoice_${Date.now()}`;

  //     const pdf = await RNHTMLtoPDF.convert({
  //       html: generateHtml(),
  //       fileName,
  //       directory: 'Documents',
  //     });

  //     const destination = `${RNFS.DownloadDirectoryPath}/${fileName}.pdf`;

  //     if (pdf?.filePath) {
  //       await RNFS.copyFile(pdf.filePath, destination);
  //       Alert.alert('Success', `PDF Saved Successfully\n${destination}`);
  //     } else {
  //       Alert.alert('Error', 'PDF not created');
  //     }
  //   } catch (error) {
  //     console.log('Download Error:', error);
  //     Alert.alert('Error', 'Failed to download PDF');
  //   }
  // };


  const handleDownload = async () => {
    try {
      const fileName = `Invoice_${Date.now()}.pdf`;

      //  Generate PDF (temporary path)
      const file = await RNHTMLtoPDF.generatePDF({
        html: generateHtml(),
        fileName: `Invoice_${Date.now()}`,
        directory: 'Documents', // temporary location
      });

      if (!file?.filePath) {
        Alert.alert('Error', 'PDF not created');
        return;
      }

      //  Move to Downloads folder (LIKE HR CODE)
      const destPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      await RNFS.moveFile(file.filePath, destPath);

      Alert.alert('Success', 'PDF saved in Downloads');

      console.log('Saved Path:', destPath);

    } catch (error) {
      console.log('Download Error:', error);
      Alert.alert('Error', 'Failed to download PDF');
    }
  };





  const handleShare = async () => {
    try {
      const productText = products
        .map(item => {
          const qty = Number(item?.orderQty || item?.quantity || 0);
          const rate = Number(item?.price || item?.rate || 0);
          const itemTotal = Number(item?.itemTotal || qty * rate);

          return `${item?.productName || 'Product'
            } - ${qty} x ₹${rate} = ₹${itemTotal}`;
        })
        .join('\n');

      const message = `
JAVAJ INVOICE
Invoice No: ${saleResponse?.orderNo || 'INV001'}

Customer: ${orderDetails?.customerName || customer?.customerName || ''}
Mobile: ${orderDetails?.customerMobile || customer?.mobile || ''}

Products:
${productText}

Total: ₹${totalAmount}
Paid: ₹${paidAmount}
Balance: ₹${balance}

Payment: ${paymentMethod.toUpperCase()}

Thank you for your business!
      `;

      await Share.share({ message });
    } catch (error) {
      console.log('Share Error:', error);
    }
  };

  const renderItem = ({ item, index }) => {
    const qty = Number(item?.orderQty || item?.quantity || 0);
    const rate = Number(item?.price || item?.rate || 0);
    const itemTotal = Number(item?.itemTotal || qty * rate);

    return (
      <View>
        <View style={styles.productRow}>
          <View style={styles.leftProduct}>
            <Image
              source={{
                uri: item?.imageUrl || 'https://via.placeholder.com/100',
              }}
              style={styles.productImage}
            />

            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {item?.productName || 'Product'}
              </Text>

              <Text style={styles.qtyText}>
                {qty} x ₹{rate}
              </Text>
            </View>
          </View>

          <Text style={styles.priceText}>₹{itemTotal}</Text>
        </View>

        {index !== products.length - 1 && <View style={styles.divider} />}
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.statusContainer}>
          <Image
            source={require('../../assets/tickmark.png')}
            resizeMode="contain"
            style={styles.image}
          />

          <Text style={styles.saleText}>Sale Completed!</Text>
          <Text style={styles.invoiceText}>
            Invoice generated successfully
          </Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.brandText}>JAVAJ</Text>

          <Text style={styles.invoiceNo}>
            {saleResponse?.orderNo || 'INV001'}
          </Text>
        </View>

        <View style={styles.rowBetween2}>
          <Text style={styles.grayText}>Driver System</Text>

          <Text style={styles.grayText}>
            {new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.billLabel}>Bill To</Text>

          <Text style={styles.customerName}>
            {orderDetails?.customerName ||
              customer?.customerName ||
              'Customer'}
          </Text>

          <Text style={styles.subText}>
            {customer?.address || 'Address'}
          </Text>

          <Text style={styles.subText}>
            {orderDetails?.customerMobile ||
              customer?.mobile ||
              'No Mobile'}
          </Text>
        </View>

        <View style={styles.card}>
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              String(item?.id || item?._id || index)
            }
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Products Found</Text>
            }
          />

          <View style={styles.summaryDivider} />

          <View style={styles.rowBetween}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryText}>₹{totalAmount}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.paidText}>
              Paid ({paymentMethod.toUpperCase()})
            </Text>
            <Text style={styles.paidText}>₹{paidAmount}</Text>
          </View>

          {balance > 0 && (
            <View style={styles.rowBetween}>
              <Text style={styles.balanceText}>Balance</Text>
              <Text style={styles.balanceText}>₹{balance}</Text>
            </View>
          )}
        </View>

        <View style={styles.thankBox}>
          <Text style={styles.thankText}>
            Thank you for your business!
          </Text>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}>
            <EvilIcons name="share-google" size={22} color="#fff" />
            <Text style={styles.btnWhiteText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={handleDownload}>
            <AntDesign name="download" size={18} color="#000" />
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
        //DriverHome
          style={styles.completeBtn}
          //onPress={() => navigation.navigate('RecordPayment',{customersdata: orderDetails,products: products,subtotal: totalAmount,paidAmount: paidAmount,paymentMethod: paymentMethod,})}
          onPress={()=>navigation.navigate("DriverHome")}
          >
          <Text style={styles.btnWhiteText}>Mark Visit Complete</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SaleCompleted;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scrollContent: {
    paddingBottom: 30,
  },

  statusContainer: {
    backgroundColor: '#00A63E',
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 35,
  },

  image: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },

  saleText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  invoiceText: {
    color: '#fff',
    fontSize: 15,
    marginTop: 6,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 14,
  },

  rowBetween2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 14,
    marginTop: 6,
  },

  brandText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },

  invoiceNo: {
    fontSize: 15,
    color: '#00A63E',
    fontWeight: '700',
  },

  grayText: {
    color: '#6B7280',
    fontSize: 14,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 12,
    padding: 14,
    elevation: 3,
  },

  billLabel: {
    color: '#6B7280',
    fontSize: 14,
  },

  customerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginTop: 5,
  },

  subText: {
    color: '#6B7280',
    marginTop: 4,
  },

  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },

  leftProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  productInfo: {
    marginLeft: 10,
    flex: 1,
  },

  productImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },

  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  qtyText: {
    color: '#6B7280',
    marginTop: 3,
    fontSize: 13,
  },

  priceText: {
    fontWeight: '700',
    color: '#111827',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 12,
  },

  summaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  paidText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00A63E',
    marginTop: 10,
  },

  balanceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF3D3B',
    marginTop: 10,
  },

  thankBox: {
    backgroundColor: '#F3F4F6',
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },

  thankText: {
    fontWeight: '600',
    color: '#111827',
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 14,
    marginTop: 16,
  },

  shareBtn: {
    width: responsiveWidth(44),
    height: responsiveHeight(5.5),
    backgroundColor: '#00A63E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  downloadBtn: {
    width: responsiveWidth(44),
    height: responsiveHeight(5.5),
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  completeBtn: {
    backgroundColor: '#EF3D3B',
    marginHorizontal: 14,
    marginTop: 16,
    height: responsiveHeight(6),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnWhiteText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 5,
  },

  downloadText: {
    color: '#111827',
    fontWeight: '700',
    marginLeft: 5,
  },

  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 20,
  },
});
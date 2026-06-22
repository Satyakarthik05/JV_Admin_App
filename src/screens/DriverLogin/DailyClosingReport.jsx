import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors, fonts } from '../../config/theme';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import DateTimePicker from '@react-native-community/datetimepicker';


const DailyReports = () => {
  const navigation = useNavigation();
  const { data } = useSelector(state => state.Login);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);


  const today = new Date();
  const formateDate = (date) => {

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }




  const [showFromDate, setShowFromDate] = useState(false);
  const [from, setFrom] = useState(formateDate(today));

  const [showToDate, setShowToDate] = useState(false);
  const [todate, setTodate] = useState(formateDate(today));


  // show from calender
  const Fromdatefun = (event, selected) => {
    setShowFromDate(false);
    if (selected) {
      const FromDate = formateDate(selected);
      setFrom(FromDate);
    }
  }

  // show to calender
  const Todatefun = (event, selected) => {
    setShowToDate(false);
    if (selected) {
      const ToDate = formateDate(selected);
      setTodate(ToDate);
    }
  }



  const loginData = data || userData;

  const [report, setReport] = useState({
    openingStock: [],
    closingStock: [],
    sales: 0,
    payments: { cash: 0, online: 0, total: 0 },
    expenses: 0,
    netBalance: 0,
  });

  const todayDate = new Date().toISOString().split('T')[0];

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white);
      StatusBar.setBarStyle('dark-content');
    }, []),
  );

  useEffect(() => {
    loadUser();
  }, []);

  // useEffect(() => {
  //   if (loginData?.id) {
  //     getClosingReport();
  //   }
  // }, [loginData?.id]);

  useEffect(() => {
    if (loginData?.id) {
      getClosingReport();
    }
  }, [loginData?.id, from, todate]);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      }
    } catch (error) {
      console.log('User Load Error:', error);
    }
  };

  // const getClosingReport = async () => {
  //   try {
  //     setLoading(true);

  //     const res = await api.get(
  //       `/driver-closing-report?driverId=${loginData?.id}&date=${todayDate}`,
  //     );

  //     console.log('API FULL RESPONSE =>', res?.data);

  //     const response = res?.data?.data || {};

  //     setReport({
  //       openingStock: response?.openingStock || [],
  //       closingStock: response?.closingStock || [],
  //       sales: Number(response?.sales) || 0,
  //       payments: {
  //         cash: Number(response?.payments?.cash) || 0,
  //         online: Number(response?.payments?.online) || 0,
  //         total: Number(response?.payments?.total) || 0,
  //       },
  //       expenses: Number(response?.expenses) || 0,
  //       netBalance: Number(response?.netBalance) || 0,
  //     });
  //   } catch (error) {
  //     console.log(
  //       'Closing Report Error:',
  //       error?.response?.data || error,
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const getClosingReport = async () => {
    try {
      setLoading(true);

      const payload = {
        driverId: loginData?.id,
        fromDate: from,
        toDate: todate,
      };

      console.log('REQUEST PAYLOAD =>', payload);

      const res = await api.post(
        '/driver-closing-report',
        payload,
      );

      console.log('API FULL RESPONSE =>', res?.data);

      const response = res?.data?.data || {};

      setReport({
        openingStock: response?.openingStock || [],
        closingStock: response?.closingStock || [],
        sales: Number(response?.sales) || 0,
        payments: {
          cash: Number(response?.payments?.cash) || 0,
          online: Number(response?.payments?.online) || 0,
          total: Number(response?.payments?.total) || 0,
        },
        expenses: Number(response?.expenses) || 0,
        netBalance: Number(response?.netBalance) || 0,
      });

    } catch (error) {
      console.log(
        'Closing Report Error:',
        error?.response?.data || error,
      );
    } finally {
      setLoading(false);
    }
  };


  const formatAmount = value =>
    Number(value || 0).toLocaleString('en-IN');

  const getProductName = id => {
    if (id === 1) return '20L Can';
    if (id === 2) return 'Bottle';
    if (id === 3) return 'Jar';
    return 'Unknown';
  };

  // const renderStockRow = (label, value, color = '#111827') => (
  //   <View style={styles.stockRow}>
  //     <Text style={styles.stockLabel}>{label}</Text>
  //     <Text style={[styles.stockValue, {color}]}>
  //       {value}
  //     </Text>
  //   </View>
  // );


  const renderStockRow = (
    label,
    value,
    color = '#111827',
    bgColor = '#fff',
  ) => (
    <View style={[styles.stockRow, { backgroundColor: bgColor }]}>
      <Text style={styles.stockLabel}>{label}</Text>

      <Text style={[styles.stockValue, { color }]}>
        {value}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>
            Daily Closing Report
          </Text>
          <Text style={styles.headerDate}>{todayDate}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator
            size="large"
            color="#EF3D3B"
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>


          <View style={styles.searchBar_view}>
            <View style={styles.header}>
              <TextInput placeholder="From  Date" editable={false} style={styles.name} placeholderTextColor="#888" value={from} />
              <Text style={styles.in_time}>  to:  </Text>
              <TextInput value={todate} placeholder="To Date" editable={false} style={styles.name} placeholderTextColor="#888" />
            </View>
            <View style={[styles.header]}>
              <TouchableOpacity onPress={() => setShowFromDate(true)}>
                <Ionicons name="calendar-clear-outline" size={15} color="#82889A" style={styles.calender_icon} />
                {/* <Text>From   </Text>  */}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowToDate(true)}>
                <Ionicons name="calendar-clear-outline" size={15} color="#82889A" style={{ marginLeft: 20 }} />
              </TouchableOpacity>
            </View>
          </View>


          {/* Sales Summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Sales Summary
            </Text>

            <View style={styles.blueBox}>
              <Text style={styles.label}>
                Total Sales
              </Text>
              <Text style={styles.blueText}>
                ₹ {formatAmount(report.sales)}
              </Text>
            </View>

            <View style={styles.greenBox}>
              <Text style={styles.label}>
                Payment Collected
              </Text>
              <Text style={styles.greenText}>
                ₹ {formatAmount(report.payments.total)}
              </Text>
            </View>

            <View style={styles.redBox}>
              <Text style={styles.label}>
                Expenses
              </Text>
              <Text style={styles.redText}>
                ₹ {formatAmount(report.expenses)}
              </Text>
            </View>
          </View>

          {/* Payment Breakdown */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Payment Breakdown
            </Text>

            {/* {renderStockRow(
              'Cash in Hand',
              `₹ ${formatAmount(report.payments.cash)}`,
            )}

            {renderStockRow(
              'Online Payments',
              `₹ ${formatAmount(report.payments.online)}`,
            )} */}


            {renderStockRow(
              'Cash in Hand',
              `₹ ${formatAmount(report.payments.cash)}`,
              '#16A34A',
              '#F0FDF4',
            )}

            {renderStockRow(
              'Online Payments',
              `₹ ${formatAmount(report.payments.online)}`,
              '#2563EB',
              '#EFF6FF',
            )}
          </View>

          {/* Opening Stock */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Opening Stock
            </Text>

            {report.openingStock.length > 0 ? (
              report.openingStock.map((item, index) => (
                <View key={index}>
                  {renderStockRow(
                    getProductName(item.productId),
                    item.openingStock,
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>
                No Data
              </Text>
            )}
          </View>

          {/* Closing Stock */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Closing Stock
            </Text>

            {report.closingStock.length > 0 ? (
              report.closingStock.map((item, index) => (
                <View key={index}>
                  {renderStockRow(
                    getProductName(item.productId),
                    item.closingStock,
                    item.closingStock < 0
                      ? '#EF4444'
                      : '#16A34A',
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>
                No Data
              </Text>
            )}
          </View>


          {
            showFromDate &&
            < DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={Fromdatefun}
              maximumDate={new Date()}
            />
          }


          {
            showToDate &&
            < DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={Todatefun}
              // minimumDate={new Date()}
              maximumDate={new Date()}
            />
          }

        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default DailyReports;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  headerDate: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 14,
    borderRadius: 14,
    padding: 14,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  blueBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  greenBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  redBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  label: {
    fontSize: 14,
    color: '#374151',
  },

  blueText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },

  greenText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16A34A',
  },

  redText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },

  stockRow: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // paddingVertical: 10,
    // borderBottomWidth: 1,
    // borderColor: '#F3F4F6',

    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  stockLabel: {
    fontSize: 14,
    color: '#374151',
  },

  stockValue: {
    fontSize: 15,
    fontWeight: '700',
  },

  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingVertical: 10,
  },

  searchBar_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1.5),
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 5,
    marginHorizontal: 15, // equal left & right gap
    paddingHorizontal: 15, // inner left & right padding
    paddingVertical: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: 800,
    color: colors.simpleblack,
    fontFamily: fonts.sfbold,
  },
  in_time: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.foundationgray,
    fontFamily: fonts.sfmedium,
  },
  Date: {
    fontSize: 12,
    fontWeight: 500,
    color: colors.foundationgray,
    fontFamily: fonts.sfmedium,
  },


});
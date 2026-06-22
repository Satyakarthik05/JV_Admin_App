import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fonts } from '../../config/theme';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import { fetchDriverAssignedStock } from '../../redux/reducers/DriverLogin/DriverStock';
import api from '../../utils/api';
import { GetVehicleDetailsData } from '../../redux/reducers/DriverLogin/Forms';

const Home = ({ navigation }) => {
  const [todayWork, setTodayWork] = useState({
    customers: 0,
    completed: 0,
    pending: 0,
    salesToday: 0,
    paymentsToday: 0,
  });
  console.log(todayWork, ">>>>>>>todayworks")
  const { data } = useSelector(state => state.Login);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loginData = data || userData;
  console.log(loginData, "datalogin")
  const insets = useSafeAreaInsets();

  const { assignedStock } = useSelector(state => state.DriverStock);
  console.log("Assigned stock ----------------->",assignedStock);
  

  const { vehicleReadingData } = useSelector(state => state.VehicleReadingData);
  console.log("vehicle reading data in deiver home main screen------------------>", vehicleReadingData);


  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.commoncolor);
      StatusBar.setBarStyle('dark-content');
    }, []),
  );

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('userData');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      }
    };
    loadUser();
  }, []);

  //console.log("logned user data ------------->",parsedUser);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; //  YYYY-MM-DD
  };







  useEffect(() => {
    if (loginData?.id) {
      dispatch(fetchDriverAssignedStock(loginData.id));
      getTodayWork();

      const today = getTodayDate();
      const payload = {
        driverId: loginData.id,
        fromDate: today,
        toDate: today,
      }
      console.log("payload data that dispatching ------------->", payload);

      dispatch(GetVehicleDetailsData(payload))
    }
  }, [loginData?.id]);


  // refresh function 
  const onRefresh = async () => {
    if (!loginData?.id) return;

    setRefreshing(true);

    const today = getTodayDate();

    const payload = {
      driverId: loginData.id,
      fromDate: today,
      toDate: today,
    };

    try {
      await dispatch(fetchDriverAssignedStock(loginData.id)).unwrap();
      await dispatch(GetVehicleDetailsData(payload)).unwrap();
      await getTodayWork();
    } catch (e) {
      console.log("Refresh error:", e);
    }

    setRefreshing(false);
  };





  const getGreeting = () => {
    const hour = new Date().getHours();
    console.log("hours---------->", hour);

    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 17) {
      return "Good Afternoon";
    } else if (hour < 21) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };



  const getTodayWork = async () => {
    try {
      const res = await api.get(
        `driver-today-work?driverId=${loginData?.id}`
      );

      const data = res?.data?.data || {};
      console.log(data, ">>>>>>>>>>>>>>>works")

      setTodayWork({
        customers: data.customers || 0,
        completed: data.completed || 0,
        pending: data.pending || 0,
        salesToday: data.salesToday || 0,
        paymentsToday: data.paymentsToday || 0,
      });

    } catch (error) {
      console.log('Today Work Error:', error);
    }
  };



  const canShowRoute = (() => {
    const list = vehicleReadingData?.data || vehicleReadingData || [];

    if (!list || list.length === 0) return false;

    const today = getTodayDate();

    //  check using startTime instead of readingDate
    const todayRecord = list.find(item =>
      item?.startTime?.split('T')[0] === today
    );

    if (!todayRecord) return false;

    //  show only if started but NOT ended
    if (todayRecord?.startTime && !todayRecord?.endTime) {
      return true;
    }

    return false;
  })();








  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER - Full Red Section */}
      <View style={styles.header}>
        {/* Top Row: Greeting + Profile */}
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.driverId}>
              {loginData?.id ? `${loginData.name}` : 'Driver'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('TelecallerProfile')}>
            <Icon name="account-outline" size={rf(3)} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Bottom Row: Sales & Payments */}
        <View style={styles.statsRowInHeader}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Sales Today</Text>
            <Text style={styles.statValue}>₹{todayWork.salesToday?.toLocaleString("en-IN") || 0}</Text>
          </View>

          <View style={styles.statCard}>
            <Text
              style={[
                styles.statTitle,
                { fontFamily: 'Poppins-ExtraBoldItalic' },
              ]}>
              Payments
            </Text>
            <Text style={styles.statValue}>₹{todayWork.paymentsToday?.toLocaleString("en-IN") || 0}</Text>
          </View>
        </View>
      </View>

      {/* Main Content Below Header */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[ styles.content, { paddingBottom: insets.bottom + 100 },]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
        {/* TODAY'S WORK */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Work</Text>

          <View style={styles.workRow}>
            <View style={styles.workItem}>
              <Text style={[styles.workCount, { color: '#1976D2' }]}>{todayWork.customers}</Text>
              <Text style={styles.workLabel}>Customers</Text>
            </View>

            <View style={styles.workItem}>
              <Text style={[styles.workCount, { color: '#2E7D32' }]}>{todayWork.completed}</Text>
              <Text style={styles.workLabel}>Completed</Text>
            </View>

            <View style={styles.workItem}>
              <Text style={[styles.workCount, { color: '#F57C00' }]}>{todayWork.pending}</Text>
              <Text style={styles.workLabel}>Pending</Text>
            </View>
          </View>

          {/* <TouchableOpacity style={styles.routeBtn} onPress={() => navigation.navigate('MyDelivery_Routes', { driverId: loginData.id })}>
            <Text style={styles.routeText}>View Route</Text>
          </TouchableOpacity> */}

          {canShowRoute && (
            <TouchableOpacity style={styles.routeBtn} onPress={() => navigation.navigate('MyDelivery_Routes', { driverId: loginData.id })}>
              <Text style={styles.routeText}>View Route</Text>
            </TouchableOpacity>
          )}


        </View>

        {/* ASSIGNED STOCK */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Assigned Stock</Text>
          <FlatList
            data={assignedStock?.data?.items || []}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.stockRow}>
                <Text style={styles.stockLabel}>{item.productName}</Text>
                <Text style={styles.stockValue}>{item.quantity}</Text>
              </View>
            )}
          />
        </View>

        {/* QUICK ACTIONS - All 4 in one row */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>

          <View style={styles.actionsRow}>
            <Action
              icon="cash-plus"
              label="Add Expense"
              color="rgba(243, 232, 255, 1)"
              onPress={() => navigation.navigate('AddExpenseScreen')}
            />
            <Action
              icon="truck-outline"
              label="Vehicle Reading"
              color="rgba(219, 234, 254, 1)"
              onPress={() => navigation.navigate('Vehicle_Reading')}
            />
            <Action
              icon="backup-restore"
              label="Returns"
              color="rgba(220, 252, 231, 1)"
              onPress={() => navigation.navigate('ReturnsSummaryScreen')}
            />
            <Action
              icon="file-document-outline"
              label="Daily Closing"
              color="rgba(255, 237, 212, 1)"
              onPress={() => navigation.navigate('DailyReports')}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.createCustomer}
          onPress={() => navigation.navigate('AddCustomerScreen')}>
          <AntDesign
            name="plus"
            size={22}
            color="#fff"
            style={styles.plusicon}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const Action = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={[styles.actionIcon, { backgroundColor: color }]}>
      <Icon name={icon} size={rf(3)} color="#000" />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    backgroundColor: colors.commoncolor,
    paddingHorizontal: rw(5),
    paddingTop: rh(2),
    paddingBottom: rh(3),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: rh(3),
  },

  greeting: {
    color: '#fff',
    fontSize: rf(2.6),
    fontWeight: '600',
  },

  driverId: {
    color: '#FFEAEA',
    fontSize: rf(1.9),
    marginTop: rh(0.5),
  },

  profileBtn: {
    width: rw(12),
    height: rw(12),
    borderRadius: rw(6),
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsRowInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statCard: {
    width: rw(42),
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    borderRadius: 12,
    padding: rw(4),
  },

  statTitle: {
    color: '#FFDADA',
    fontSize: rf(1.8),
  },

  statValue: {
    color: '#fff',
    fontSize: rf(2.6),
    fontWeight: '700',
    marginTop: rh(0.5),
  },

  content: {
    padding: rw(5),
    // paddingTop: rh(3),
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: rw(5),
    marginBottom: rh(2),
    elevation: 3,
  },

  cardTitle: {
    fontSize: rf(2.2),
    fontWeight: '600',
    marginBottom: rh(2),
    color: '#222',
    // paddingleft
  },

  workRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  workItem: {
    alignItems: 'center',
    flex: 1,
  },

  workCount: {
    fontSize: rf(2.4),
    fontWeight: '700',
  },

  workLabel: {
    fontSize: rf(1.6),
    color: '#666',
    marginTop: rh(0.5),
  },

  routeBtn: {
    marginTop: rh(2),
    backgroundColor: '#F44336',
    paddingVertical: rh(1.8),
    borderRadius: 10,
    alignItems: 'center',
  },

  routeText: {
    color: '#fff',
    fontSize: rf(2),
    fontWeight: '600',
  },

  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rh(1.5),
  },

  stockLabel: {
    fontSize: rf(1.8),
    color: '#444',
  },

  stockValue: {
    fontSize: rf(1.9),
    fontWeight: '600',
    color: '#000',
  },

  // Updated for single row layout
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Evenly spaces all 4 items
  },

  actionItem: {
    alignItems: 'center',
    width: rw(20), // Reduced slightly to fit 4 comfortably (4 x 20% = 80%, leaves margins)
    // No marginBottom needed since it's single row
  },

  actionIcon: {
    width: rw(14),
    height: rw(14),
    borderRadius: rw(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: rh(1),
  },

  actionLabel: {
    fontSize: 12,
    fontFamily: fonts.sfmedium,
    textAlign: 'center',
    color: '#333',
  },
  //
  orderCard: {
    // backgroundColor: '#fff',
    // borderRadius: 12,
    // padding: rw(4),
    // borderWidth: 1,
    // borderColor: '#EEE',
  },

  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: rw(2),
    height: rw(2),
    borderRadius: rw(1),
    backgroundColor: '#2ECC71',
    marginRight: rw(2),
  },

  storeName: {
    fontSize: rf(1.9),
    fontWeight: '600',
    color: '#222',
  },

  orderRight: {
    alignItems: 'flex-end',
  },

  cityText: {
    fontSize: rf(1.6),
    color: '#666',
  },

  pendingBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: rw(4),
    paddingVertical: rh(0.5),
    borderRadius: 8,
    marginTop: rh(0.5),
  },

  pendingText: {
    color: '#FB8C00',
    fontSize: rf(1.6),
    fontWeight: '500',
  },

  phoneText: {
    fontSize: rf(1.7),
    color: '#555',
    marginTop: rh(1),
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rh(0.8),
  },

  locationText: {
    marginLeft: rw(1),
    fontSize: rf(1.7),
    color: '#555',
  },

  productTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEC',
    alignSelf: 'flex-start',
    paddingHorizontal: rw(3),
    paddingVertical: rh(0.6),
    borderRadius: 8,
    marginTop: rh(1),
  },

  productText: {
    fontSize: rf(1.6),
    color: '#222',
    marginRight: rw(2),
  },

  qtyText: {
    fontSize: rf(1.6),
    fontWeight: '600',
    color: '#000',
  },

  outstandingText: {
    marginTop: rh(1.2),
    fontSize: rf(1.8),
    color: '#E53935',
    fontWeight: '600',
  },
  createCustomer: {
    alignItems: 'flex-end',
  },
  plusicon: {
    backgroundColor: '#EF3D3B',
    padding: 10,
    borderRadius: 46,
  },
});

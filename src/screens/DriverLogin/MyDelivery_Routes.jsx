import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fonts } from '../../config/theme';
import { GetAssignedCustomersByID } from '../../redux/reducers/AccounsLogin/VehicleDetails';
import { useSelector } from 'react-redux';
import api from '../../utils/api';

const MyDeliveryRoutes = ({ route }) => {
  const [assignedRoutes, setAssignedRoutes] = useState([]);
  const { driverId } = route.params || {};
  console.log(driverId, '>>>>>>>>>>driverId in MyDelivery_Routes'); // Check if driverId is received correctly
  const DriverRoutes = async () => {
    try {
      const res = await api.get(`routes/${driverId}`);
      setAssignedRoutes(res.data.data); // important
    } catch (error) {
      console.log(error);
    }
  };
  console.log(assignedRoutes, '>>>>>>>>>assigned');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  useEffect(() => {
    DriverRoutes();
  }, [driverId]);

  const customerlength = assignedRoutes.length;
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={()=> navigation.goBack()}>
          <Icon name="arrow-back-ios" size={rf(2.2)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Delivery Routes</Text>
        <View style={{ width: 24 }} />
      </View> */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Delivery Routes</Text>
      </View>
      <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* SUMMARY CARD */}
        {/* <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Today's Routes</Text>
            <Text style={styles.summaryValue}>4 Active</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Packages</Text>
            <Text style={styles.summaryValue}>160</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Est. Time</Text>
            <Text style={styles.summaryValue}>8h 15min</Text>
          </View>
        </View> */}

        {/* ROUTES TITLE */}
        {/* <Text style={styles.sectionTitle}>Routes</Text> */}

        {/* ROUTES LIST */}
        {assignedRoutes?.length > 0 ? (
          assignedRoutes.map((item, index) => (
            <TouchableOpacity
              key={item.routeId || index}
              activeOpacity={0.9}
              style={styles.routeCard}>
              <View style={styles.routeTopRow}>
                <View>
                  <Text style={styles.routeTitle}>
                    {item.routeName || 'Route'}
                  </Text>
                  <Text style={styles.routeSubTitle}>
                    Delivery Route #{item.routeId}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CustomerList', {
                      customers: item.customers,
                      routeName: item.routeName,
                      driverId: driverId,
                      assignedRoutes: assignedRoutes,
                    })
                  }
                  style={styles.arrowWrap}>
                  <Icon name="chevron-right" size={rf(2.8)} color="#E53935" />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.routeBottomRow}>
                <View style={styles.customerBadge}>
                  <Icon name="people" size={16} color="#E53935" />
                  <Text style={styles.customerText}>
                    {item.customers?.length || 0} Customers
                  </Text>
                </View>

                <TouchableOpacity style={styles.activeBtn} >
                  <Text style={styles.activeText}>View Route</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.activeBtn} onPress={() => navigation.navigate('RouteMap', { customers: item.customers, routeName: item.routeName, routeId: item.routeId, driverId: driverId, })}>
                  <Text style={styles.activeText}>View Route</Text>
                </TouchableOpacity> */}

              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Icon name="route" size={40} color="#ccc" />
            <Text style={styles.emptyText}>No Routes Found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MyDeliveryRoutes;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: rw(4),
    paddingVertical: rh(1.8),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F4',
    elevation: 2,
  },

  headerTitle: {
    fontSize: rf(2.1),
    fontWeight: '700',
    color: '#111827',
  },

  content: {
    padding: rw(4),
    paddingBottom: rh(4),
  },

  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: rh(2),
    paddingHorizontal: rw(2),
    marginBottom: rh(2.5),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  summaryLabel: {
    fontSize: rf(1.45),
    color: '#6B7280',
    marginBottom: rh(0.6),
    textAlign: 'center',
  },

  summaryValue: {
    fontSize: rf(1.75),
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: rf(2),
    fontWeight: '700',
    marginBottom: rh(1.6),
    color: '#111827',
  },

  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: rw(4),
    marginBottom: rh(2),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  routeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  routeTitle: {
    fontSize: rf(2),
    fontWeight: '700',
    color: '#111827',
  },

  routeSubTitle: {
    fontSize: rf(1.45),
    color: '#6B7280',
    marginTop: rh(0.3),
    fontFamily: fonts?.sfmedium,
  },

  routeLocation: {
    fontSize: rf(1.6),
    color: '#6B7280',
    marginTop: rh(0.8),
    fontFamily: fonts?.sfmedium,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEF0F4',
    marginVertical: rh(1.6),
  },

  routeBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  statusDot: {
    width: rw(2.2),
    height: rw(2.2),
    borderRadius: rw(1.1),
    marginRight: rw(1.8),
    backgroundColor: '#22C55E',
  },

  statusText: {
    fontSize: rf(1.5),
    color: '#6B7280',
    fontFamily: fonts?.sfmedium,
  },

  customerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: rw(3),
    paddingVertical: rh(0.7),
    borderRadius: 20,
    maxWidth: '55%',
  },

  customerText: {
    marginLeft: 6,
    fontSize: rf(1.45),
    color: '#E53935',
    fontWeight: '700',
  },

  routeBtn: {
    paddingHorizontal: rw(4),
    paddingVertical: rh(1),
    borderRadius: 10,
    minWidth: rw(24),
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeBtn: {
    backgroundColor: '#E53935',
    padding: 10,
    borderRadius: 10
  },

  disabledBtn: {
    backgroundColor: '#E5E7EB',
  },

  routeBtnText: {
    fontSize: rf(1.55),
    fontWeight: '700',
  },

  activeText: {
    color: '#FFFFFF',
  },

  disabledText: {
    color: '#9CA3AF',
  },

  arrowWrap: {
    width: rw(9),
    height: rw(9),
    borderRadius: rw(4.5),
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(8),
    paddingHorizontal: rw(6),
  },

  emptyText: {
    marginTop: rh(1.2),
    color: '#9CA3AF',
    fontSize: rf(1.8),
    fontWeight: '600',
  },
});

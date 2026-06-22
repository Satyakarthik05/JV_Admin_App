import React from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from "../../config/theme";
import commonstyles from "../../commonstyles/commonstyles";
const routes = [
  {
    id: 'A',
    title: 'Route A',
    location: 'Rajamundry to kakinada',
    status: 'In Progress',
    active: true,
  },
  {
    id: 'B',
    title: 'Route B',
    location: 'Rajamundry to kakinada',
    status: 'Pending',
    active: false,
  },
  {
    id: 'C',
    title: 'Route C',
    location: 'Rajamundry to kakinada',
    status: 'Pending',
    active: false,
  },
  {
    id: 'D',
    title: 'Route D',
    location: 'Rajamundry to kakinada',
    status: 'In Progress',
    active: false,
  },
];

const DeliveryRoutes = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={[commonstyles.row1, { gap: 12, marginVertical: 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={[commonstyles.assignText]}>My Delivery Routes</Text>
      </View>

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
        <Text style={styles.sectionTitle}>Routes</Text>

        {/* ROUTES LIST */}
        {routes.map(route => (
          <View key={route.id} style={styles.routeCard}>
            <View style={styles.routeTopRow}>
              <Text style={styles.routeTitle}>{route.title}</Text>
              <TouchableOpacity onPress={() => navigation.navigate("SaleCustomerList")}>
                <Icon name="chevron-right" size={rf(3)} color="#999" />
              </TouchableOpacity>
            </View>

            <Text style={styles.routeLocation}>{route.location}</Text>

            <View style={styles.routeBottomRow}>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: route.status === 'In Progress' ? '#E53935' : '#E53935' },
                  ]}
                />
                <Text style={styles.statusText}>{route.status}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.routeBtn,
                  route.active ? styles.activeBtn : styles.disabledBtn,
                ]}
                disabled={!route.active}
              >
                <Text
                  style={[
                    styles.routeBtnText,
                    route.active ? styles.activeText : styles.disabledText,
                  ]}
                >
                  {route.active ? 'View Route' : 'Start Route'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#Fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rw(4),
    paddingVertical: rh(1.8),

  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: rf(2.2),
    fontWeight: '600',
    color: '#000',
  },

  content: {
    padding: rw(4),
  },

  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: rh(2),
    elevation: 3,
    marginBottom: rh(2.5),
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: rf(1.5),
    color: '#777',
    marginBottom: rh(0.5),
  },

  summaryValue: {
    fontSize: rf(1.9),
    fontWeight: '600',
    color: '#000',
  },

  sectionTitle: {
    fontSize: rf(2),
    fontWeight: '600',
    marginBottom: rh(1.5),
    color: '#000',
  },

  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: rw(4),
    marginBottom: rh(2),
    elevation: 3,
  },

  routeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  routeTitle: {
    fontSize: rf(2),
    fontWeight: '600',
    color: '#000',
  },

  routeLocation: {
    fontSize: rf(1.6),
    color: '#666',
    marginTop: rh(0.6),
  },

  routeBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: rh(1.5),
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: rw(2),
    height: rw(2),
    borderRadius: rw(1),
    marginRight: rw(2),
  },

  statusText: {
    fontSize: rf(1.6),
    color: '#666',
  },

  routeBtn: {
    paddingHorizontal: rw(4),
    paddingVertical: rh(1),
    borderRadius: 8,
  },

  activeBtn: {
    backgroundColor: '#E53935',
  },

  disabledBtn: {
    backgroundColor: '#E0E0E0',
  },

  routeBtnText: {
    fontSize: rf(1.6),
    fontWeight: '600',
  },

  activeText: {
    color: '#fff',
  },

  disabledText: {
    color: '#999',
  },
});
export default DeliveryRoutes;
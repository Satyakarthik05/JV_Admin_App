import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Feather from 'react-native-vector-icons/Feather';
import commonstyles from "../../commonstyles/commonstyles";
import { colors, fonts } from "../../config/theme";

const customers = [
  {
    id: 1,
    name: 'Sai Babu Supermarket',
    owner: 'Suresh Kumar',
    area: 'Ameerpet, Hyderabad',
    phone: '+91 98765 43210',
    status: 'Delivered Today',
    statusColor: '#22C55E',
    statusBg: '#DCFCE7',
    dot: '#22C55E',
  },
  {
    id: 2,
    name: 'Annapurna General Store',
    owner: 'Suresh Kumar',
    area: 'Ameerpet, Hyderabad',
    phone: '+91 98765 43210',
    status: 'Pending',
    statusColor: '#EAB308',
    statusBg: '#FEF9C3',
    dot: '#EAB308',
  },
  {
    id: 3,
    name: 'Sai Kirana Store',
    owner: 'Suresh Kumar',
    area: 'Ameerpet, Hyderabad',
    phone: '+91 98765 43210',
    status: 'Not Visited',
    statusColor: '#EF4444',
    statusBg: '#FEE2E2',
    dot: '#EF4444',
  },
];
const SaleCustomer = () => {

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white)
      StatusBar.setBarStyle("dark-content")
    }, [])
  )
  const navigation = useNavigation();


  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={[commonstyles.row1, { gap: 12, marginVertical: 12 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.black} />
          </TouchableOpacity>
          <Text style={[commonstyles.assignText]}>Customer List</Text>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Icon name="magnify" size={18} color="#9CA3AF" />
            <TextInput placeholder="Search Customers...." style={styles.searchInput} />
          </View>
        </View>

        {/* Counters */}
        <View style={styles.counterRow}>
          <View style={styles.counterBox}>
            <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
            <Text style={styles.counterText}>36</Text>
          </View>
          <View style={styles.counterBox}>
            <View style={[styles.dot, { backgroundColor: '#EAB308' }]} />
            <Text style={styles.counterText}>36</Text>
          </View>
          <View style={styles.counterBox}>
            <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.counterText}>36</Text>
          </View>
        </View>

        {/* Cards */}
        {customers.map(item => (
          <View key={item.id} style={styles.card}>
            {/* Top */}
            <View style={styles.cardTop}>
              <View style={styles.rowCenter}>
                <View style={[styles.dot, { backgroundColor: item.dot }]} />
                <Text style={styles.storeName}>{item.name}</Text>
              </View>
              
              {/* <View>
                <Text style={styles.title}>Hyb</Text>
              </View> */}
            </View>

            <Text style={styles.subText}>Owner: {item.owner}</Text>
            <Text style={styles.subText}>{item.area}</Text>

            {/* Phone */}
            <View style={styles.phoneRow}>
              <Icon name="phone-outline" size={18} color="#6B7280" />
              <Text style={styles.phoneText}>{item.phone}</Text>
              {/* <View style={styles.routePill}>
                <Text style={styles.routeText}>Route b</Text>
              </View> */}
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="check-circle-outline" size={14} color="#EF4444" />
                <Text style={styles.statText}> Total Delivers : 23</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="close-circle-outline" size={14} color="#EF4444" />
                <Text style={styles.statText}> Total Cancellations : 3</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.callBtn}>
                <Icon name="phone" size={18} color="#fff" />
                <Text style={styles.callText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navigateBtn}>
                <Ionicons name="navigate-outline" size={18} color="#EF4444" />
                <Text style={styles.navigateText}>Navigate</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16, paddingBottom: 30 },

  header: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#000' },

  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor:colors.inputfieldborder,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
  },
  searchInput: { flex: 1, marginLeft: 6, fontSize: 13 },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  counterRow: { flexDirection: 'row', marginBottom: 14, justifyContent: "center" },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
  counterText: { marginLeft: 6, fontSize: 13, fontWeight: '600', color: "#000" },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor:colors.inputfieldborder,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  storeName: { fontSize: 14, fontWeight: '600', color: '#000' },

  statusPill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '600' },

  subText: { fontSize: 14, color:colors.black,fontFamily:fonts.sfmedium, marginTop: 4 },

  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  phoneText: { fontSize: 14, marginLeft: 6,fontWeight:'800',fontFamily:fonts.sfbold,color:colors.black },
  routePill: {
    marginLeft: 'auto',
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  routeText: { fontSize: 11, color: '#EF4444' },

  statsRow: { flexDirection: 'row', marginTop: 10 },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: 14 },
  statText: { fontSize: 11, color: '#374151' },

  actionRow: { flexDirection: 'row', marginTop: 14 },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 10,
    marginRight: 8,
  },
  callText: { color: '#fff', marginLeft: 6, fontSize: 13, fontWeight: '600' },

  navBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 10,
  },
  navText: { marginLeft: 6, fontSize: 13, fontWeight: '600' },
  navigateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EF4444',
    marginLeft: 10,
  },
  navigateText: {
    marginLeft: 6,
    color: '#EF4444',
    fontWeight: '600',
  },
  title:{
    fontSize:14,
    fontWeight:'400',
    fontFamily:fonts.sfmedium,
    color:colors.black,
  },
});
export default SaleCustomer;
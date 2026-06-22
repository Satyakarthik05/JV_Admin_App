import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, fonts } from "../../config/theme";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useFocusEffect } from "@react-navigation/native";

const SaleExpenses = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white)
      StatusBar.setBarStyle("dark-content")
    }, [])
  )

  const FILTERS = ['All', 'Petrol', 'Food', 'Repair', 'Others', 'Pending', 'Approved'];
  const DATA = [
    {
      id: '1',
      type: 'Petrol',
      amount: 450,
      date: '22 Dec, 11:32 AM',
      status: 'Approved',
      vendor: 'HP',
      description: 'Filled 2.5 liters petrol',
      proof: 'Video',
    },
    {
      id: '2',
      type: 'Food',
      amount: 450,
      date: '22 Dec, 11:32 AM',
      status: 'Approved',
      vendor: 'HP',
      description: 'Filled 2.5 liters petrol',
      proof: 'Photo',
    },
    {
      id: '3',
      type: 'Food',
      amount: 450,
      date: '22 Dec, 11:32 AM',
      status: 'Approved',
      vendor: 'HP',
      description: 'Filled 2.5 liters petrol',
      proof: 'Video',
    },
  ];

  const renderItem = ({ item }) => (
    <View style={[styles.card, { gap: 6 }]}>
      {/* Top: type + status */}
      <View style={styles.cardHeader}>
        <View style={styles.rowCenter}>
          <Icon name="silverware-fork-knife" size={18} color="#EF4444" />
          <Text style={styles.cardTitle}>{item.type}</Text>
        </View>
        <View style={styles.statusApproved}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Date */}
      <View>
        <Text style={styles.descText}>{item.date}</Text>
      </View>

      {/* Amount + proof + bill in one row */}
      
        <View style={styles.proofRow}>
          <View style={styles.proofBtn}>
            <Text style={styles.amountBoxText}>₹ {item.amount}</Text>
          </View>
          <View style={styles.proofBtn}>
            <Icon name={item.proof === 'Video' ? 'video' : 'image'} size={16} color="#EF4444" />
            <Text style={styles.proofText}>{item.proof}</Text>
          </View>

          <View style={styles.proofBtn}>
            <Icon name="file-outline" size={16} color="#22C55E" />
            <Text style={[styles.proofText, { color: '#22C55E' }]}>Bill</Text>
          </View>
        </View>

      {/* Description */}
      <View>
        <Text style={styles.descText}>{item.description}</Text>
      </View>


      {/* HP + Details in one row */}
      <View style={styles.bottomRow}>
        <Text style={styles.descText}>{item.vendor}</Text>
        <TouchableOpacity style={styles.detailsBtn}>
          <Icon name="information-outline" size={14} color="#EF4444" />
          <Text style={styles.detailsText}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 70 }}

          ListHeaderComponent={
            <>
              <Text style={styles.header}>Expenses</Text>

              {/* Search */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2) }}>
                <View style={styles.searchBox}>
                  <Icon name="magnify" size={20} color="#999" />
                  <TextInput placeholder="Search by name" style={styles.searchInput} />
                </View>
                <TouchableOpacity style={styles.addBtn}>
                  <Icon name="plus" size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Filters */}
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={FILTERS}
                keyExtractor={(item) => item}
                contentContainerStyle={{ paddingVertical: 10 }}
                renderItem={({ item }) => (
                  <TouchableOpacity style={[styles.filterChip, activeFilter === item && styles.filterActive,]} onPress={() => setActiveFilter(item)}>
                    <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive,]}> {item}</Text>
                  </TouchableOpacity>
                )}
              />

              {/* Summary */}
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Expenses</Text>
                <Text style={styles.summaryAmount}>₹12,000</Text>
              </View>
            </>
          }
        />

      </View>
    </SafeAreaView>
  )
};
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: '600', marginBottom: 12, color: '#000' },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
  },
  searchInput: { flex: 1, marginLeft: 6 },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterActive: { backgroundColor: '#EF4444' },
  filterText: { fontSize: 14, color: '#555' },
  filterTextActive: { color: '#fff' },

  summaryBox: {
    backgroundColor: '#FFF1DB',
    borderRadius: 10,
    padding: 14,
    marginVertical: 12,
  },
  summaryTitle: { color: '#F97316', fontSize: 13 },
  summaryAmount: { fontSize: 18, fontWeight: '700', color: '#F97316' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.black,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { marginLeft: 6, fontWeight: '600', color: '#000' },

  statusApproved: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  statusText: { fontSize: 12, color: '#22C55E' },

 
  amountText: { fontSize: 18, fontWeight: '700', color: '#000' },
 
  proofText: { marginLeft: 6, fontSize: 12, color: '#EF4444' },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // description+HP on left, Details on right [web:2][web:24]
    alignItems: 'flex-end',
    marginTop: 6,
  },
  //descText: { fontSize: 12, color: '#555' },
  vendorText: { fontSize: 12, color: '#000', marginTop: 2 },

  detailsBtn: { flexDirection: 'row', alignItems: 'center' },
  detailsText: { marginLeft: 4, color: '#EF4444', fontSize: 12 },

  //
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { marginLeft: 6, fontWeight: '600', color: '#000' },

  statusApproved: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  statusText: { fontSize: 12, color: '#22C55E' },

  dateText: { fontSize: 11, color: '#777', marginVertical: 4 },

  /* Row: amount box (left) + Photo + Bill (right) */
  amountAndProofRow: {
    // flexDirection: 'row',
    // justifyContent: 'space-between', // amount left, buttons right [web:2][web:5]
    // alignItems: 'center',
    // marginVertical: 8,
  },

  proofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:8
  },

  proofBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
   // marginLeft: 8,
  },

  amountBoxText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },

  proofText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#EF4444',
  },

  descText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    fontFamily:fonts.sfmedium,
  },

  /* Row: HP (left) + Details (right) */
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // HP left, Details right [web:2][web:5]
    alignItems: 'center',
    marginTop: 4,
  },
  vendorText: { fontSize: 12, color: '#000' },
  detailsBtn: { flexDirection: 'row', alignItems: 'center' },
  detailsText: { marginLeft: 4, color: '#EF4444', fontSize: 12 },
  date: {},
});
export default SaleExpenses;
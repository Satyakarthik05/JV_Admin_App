import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts } from '../../config/theme';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import api from '../../utils/api';
import { endpoints } from '../../config/config';

const formatYmd = d => {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

const ymdToDate = ymd => {
  if (!ymd || typeof ymd !== 'string') {
    return new Date();
  }
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
};

const formatDisplayDate = iso => {
  if (!iso) {
    return '';
  }
  try {
    const dt = new Date(iso);
    return dt.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(iso);
  }
};

const expenseTypeIcon = type => {
  const t = (type || '').toLowerCase();
  if (t.includes('petrol')) {
    return 'gas-station';
  }
  if (t.includes('diesel')) {
    return 'fuel';
  }
  if (t.includes('food')) {
    return 'silverware-fork-knife';
  }
  if (t.includes('travel')) {
    return 'car';
  }
  if (t.includes('salary')) {
    return 'cash';
  }
  return 'receipt';
};

const STATUS_CHIPS = ['All', 'Pending', 'Approved', 'Rejected', 'Forwarded'];

const statusStyle = status => {
  const s = (status || '').toLowerCase();
  if (s === 'approved') {
    return { dot: '#22C55E', text: '#22C55E', bg: '#DCFCE7' };
  }
  if (s === 'pending') {
    return { dot: '#F97316', text: '#EA580C', bg: '#FFEDD5' };
  }
  if (s === 'rejected') {
    return { dot: '#EF4444', text: '#DC2626', bg: '#FEE2E2' };
  }
  if (s === 'forwarded') {
    return { dot: '#3B82F6', text: '#2563EB', bg: '#DBEAFE' };
  }
  return { dot: '#6B7280', text: '#4B5563', bg: '#F3F4F6' };
};

const ExpensesScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const defaultTo = formatYmd(new Date());
  const defaultFrom = formatYmd(
    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  );
  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);
  const [pickerTarget, setPickerTarget] = useState(null);
  const [activeStatus, setActiveStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [rawList, setRawList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [billModalVisible, setBillModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        if (stored) {
          setUserData(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('ExpensesScreen userData', e);
      }
    };
    load();
  }, []);

  const fetchExpenses = useCallback(async () => {
    if (!userData?.id) {
      setRawList([]);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const body = {
        employeeId: userData.id,
        fromDate,
        toDate,
        requestType: 'EXPENSE',
      };
      const res = await api.post(endpoints.EXPENSE_FILTER, body, {
        timeout: 60000,
      });
      const list = res?.data?.data;
      console.log("get expenses Data------------>", list);

      setRawList(Array.isArray(list) ? list : []);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Failed to load expenses';
      setError(String(msg));
      setRawList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userData?.id, fromDate, toDate]);

  useEffect(() => {
    if (userData?.id) {
      fetchExpenses();
    }
  }, [userData?.id, fetchExpenses]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white);
      StatusBar.setBarStyle('dark-content');
      if (userData?.id) {
        fetchExpenses();
      }
    }, [userData?.id, fetchExpenses]),
  );

  const onDateChange = (event, selected) => {
    const target = pickerTarget;
    if (Platform.OS === 'android') {
      setPickerTarget(null);
      if (event?.type === 'dismissed') {
        return;
      }
    }
    if (selected && target) {
      const ymd = formatYmd(selected);
      if (target === 'from') {
        setFromDate(ymd);
      } else {
        setToDate(ymd);
      }
    }
    if (Platform.OS === 'ios') {
      setPickerTarget(null);
    }
  };

  const applyDateRange = () => {
    const a = ymdToDate(fromDate).getTime();
    const b = ymdToDate(toDate).getTime();
    if (a > b) {
      Alert.alert('Invalid range', 'From date cannot be after To date.');
      return;
    }
    fetchExpenses();
  };

  const filteredData = useMemo(() => {
    let rows = rawList;
    if (activeStatus !== 'All') {
      rows = rows.filter(
        r => (r.expenseStatus || '').toLowerCase() === activeStatus.toLowerCase(),
      );
    }
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(r => {
        const hay = [
          r.name,
          r.vendor,
          r.reason,
          r.expenseType,
          r.empCode,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      });
    }
    return rows;
  }, [rawList, activeStatus, search]);

  const totalAmount = useMemo(
    () =>
      filteredData.reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    [filteredData],
  );

  const renderItem = ({ item }) => {
    const st = statusStyle(item.expenseStatus);
    const hasBill = !!(item.billUrl && String(item.billUrl).trim());
    return (
      <View style={[styles.card, { gap: 6 }]}>
        <View style={styles.cardHeader}>
          <View style={styles.rowCenter}>
            <Icon
              name={expenseTypeIcon(item.expenseType)}
              size={18}
              color="#EF4444"
            />
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.expenseType || 'Expense'}
            </Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: st.bg }]}>
            <View style={[styles.dot, { backgroundColor: st.dot }]} />
            <Text style={[styles.statusText, { color: st.text }]}>
              {item.expenseStatus || '—'}
            </Text>
          </View>
        </View>

        <Text style={styles.descText}>
          {formatDisplayDate(item.expenseDate)}
        </Text>

        <View style={styles.proofRow}>
          <View style={styles.proofBtn}>
            <Text style={styles.amountBoxText}>₹ {item.amount ?? 0}</Text>
          </View>
          {/* {hasBill ? (
            <View style={styles.proofBtn}>
              <Icon name="file-image-outline" size={16} color="#22C55E" />
              <Text style={[styles.proofText, { color: '#22C55E' }]}>Bill</Text>
            </View>
          ) : null} */}

          {hasBill ? (
            <TouchableOpacity style={styles.proofBtn} onPress={() => { setSelectedBill(item.billUrl); setBillModalVisible(true); }} >
              <Icon name="file-image-outline" size={16} color="#22C55E" />
              <Text style={[styles.proofText, { color: '#22C55E' }]}> Bill</Text>
            </TouchableOpacity>
          ) : null}

        </View>

        {item.reason ? (
          <Text style={styles.descText} numberOfLines={2}>
            {item.reason}
          </Text>
        ) : null}

        <View style={styles.bottomRow}>
          <Text style={styles.descText} numberOfLines={1}>
            {item.vendor || item.name || '—'}
          </Text>
          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={() =>
              Alert.alert(
                'Details',
                [
                  item.name ? `Name: ${item.name}` : '',
                  item.empCode ? `Code: ${item.empCode}` : '',
                  item.vendor ? `Vendor: ${item.vendor}` : '',
                  item.reason ? `Reason: ${item.reason}` : '',
                  item.remarks ? `Remarks: ${item.remarks}` : '',
                  //hasBill ? `Bill: ${item.billUrl}` : '',
                ]
                  .filter(Boolean)
                  .join('\n') || 'No extra details',
              )
            }>
            <Icon name="information-outline" size={14} color="#EF4444" />
            <Text style={styles.detailsText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const listHeader = (
    <>
      <Text style={styles.header}>Expenses</Text>



      {pickerTarget ? (
        <DateTimePicker
          value={ymdToDate(pickerTarget === 'from' ? fromDate : toDate)}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={
            pickerTarget === 'to'
              ? new Date()
              : (() => {
                const end = ymdToDate(toDate);
                const today = new Date();
                return end.getTime() > today.getTime() ? today : end;
              })()
          }
          minimumDate={pickerTarget === 'to' ? ymdToDate(fromDate) : undefined}
        />
      ) : null}

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={20} color="#999" />
          <TextInput
            placeholder="Search name, vendor, reason"
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddExpenseScreen')}>
          <Icon name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>



      <View style={styles.dateFilterRow}>
        <TouchableOpacity
          style={styles.dateField}
          onPress={() => setPickerTarget('from')}>
          <Text style={styles.dateLabel}>From</Text>
          <View style={styles.dateValueRow}>
            <Text style={styles.dateValue}>{fromDate}</Text>
            <Ionicons name="calendar-outline" size={18} color="#82889A" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateField}
          onPress={() => setPickerTarget('to')}>
          <Text style={styles.dateLabel}>To</Text>
          <View style={styles.dateValueRow}>
            <Text style={styles.dateValue}>{toDate}</Text>
            <Ionicons name="calendar-outline" size={18} color="#82889A" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={applyDateRange}>
          <Text style={styles.applyBtnText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}>
        {STATUS_CHIPS.map(item => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterChip,
              activeStatus === item && styles.filterActive,
            ]}
            onPress={() => setActiveStatus(item)}>
            <Text
              style={[
                styles.filterText,
                activeStatus === item && styles.filterTextActive,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Total (filtered)</Text>
        <Text style={styles.summaryAmount}>
          ₹{totalAmount.toLocaleString('en-IN')}
        </Text>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : !userData?.id ? (
        <Text style={styles.errorText}>
          Log in to view your expenses.
        </Text>
      ) : null}
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {loading && !refreshing ? (
          <View style={styles.loadingWrap}>
            {listHeader}
            <ActivityIndicator size="large" color="#EF4444" />
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 90 }}
            ListHeaderComponent={listHeader}
            ListEmptyComponent={
              !loading ? (
                <Text style={styles.emptyText}>
                  {userData?.id
                    ? 'No expenses in this range.'
                    : ' '}
                </Text>
              ) : null
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  if (!userData?.id) {
                    return;
                  }
                  setRefreshing(true);
                  fetchExpenses();
                }}
                colors={['#EF4444']}
              />
            }
          />
        )}
      </View>

      <Modal visible={billModalVisible} transparent={true} animationType="fade" onRequestClose={() => setBillModalVisible(false)} >
        <View style={styles.modalContainer}>

          <TouchableOpacity style={styles.closeBtn} onPress={() => setBillModalVisible(false)} >
             <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          {selectedBill ? (
            <Image source={{ uri: selectedBill }} style={styles.billImage} resizeMode="contain"  />
          ) : null}

        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 16 },
  loadingWrap: { flex: 1 },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  dateFilterRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
    marginTop: 10
  },
  dateField: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dateLabel: { fontSize: 11, color: '#6B7280', marginBottom: 4 },
  dateValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateValue: { fontSize: 14, fontWeight: '600', color: '#000' },
  applyBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  applyBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(2),
  },
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
  searchInput: { flex: 1, marginLeft: 6, color: '#000' },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipsRow: { paddingVertical: 10 },
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
  errorText: { color: '#DC2626', fontSize: 13, marginBottom: 8 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 24 },
  card: {
    marginVertical: 10,
    marginHorizontal: 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  cardTitle: {
    marginLeft: 6,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  proofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proofBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
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
    fontFamily: fonts.sfmedium,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  detailsBtn: { flexDirection: 'row', alignItems: 'center' },
  detailsText: { marginLeft: 4, color: '#EF4444', fontSize: 12 },
  modalContainer: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.9)',
  justifyContent: 'center',
  alignItems: 'center',
},

billImage: {
  width: '90%',
  height: '70%',
},

closeBtn: {
  position: 'absolute',
  top: 50,
  right: 20,
  backgroundColor: '#EF4444',
  padding: 10,
  borderRadius: 8,
  zIndex: 1,
},

});

export default ExpensesScreen;

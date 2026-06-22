import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, fonts } from '../../config/theme';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';
import { endpoints } from '../../config/config';

/** YYYY-MM-DD in local calendar (matches API e.g. 2026-04-17). */
function getLocalDateYmd(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** API filters by date; UTC-stored returnDate often falls on adjacent calendar days — use a window. */
function getReturnsListRangeDaysBack(daysBack = 30) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - daysBack);
  return { fromDate: getLocalDateYmd(start), toDate: getLocalDateYmd(end) };
}

function ymdToDate(ymd) {
  if (!ymd || typeof ymd !== 'string') {
    return new Date();
  }
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
}

function normalizeReturnType(raw) {
  const u = String(raw || 'NORMAL').toUpperCase().trim();
  if (u === 'DAMAGED' || u === 'DAMAGE' || u === 'DMG' || u === 'BROKEN') {
    return 'DAMAGED';
  }
  return 'NORMAL';
}

function formatTimeLabel(value) {
  if (value == null || value === '') {
    return '';
  }
  if (typeof value === 'string' && /^\d{1,2}:\d{2}/.test(value.trim())) {
    return value.trim();
  }
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
  }
  return String(value);
}

function extractArray(payload) {
  if (payload == null) {
    return [];
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }
  if (Array.isArray(payload?.result)) {
    return payload.result;
  }
  return [];
}

function normalizeReturnLogs(payload) {
  const rows = extractArray(payload);
  return rows.map((row, index) => {
    const items = row.items || row.returnItems || [];
    const timeRaw =
      row.returnTime ||
      row.time ||
      row.createdAt ||
      row.returnDate ||
      row.date;
    const returnIso = row.returnDate || row.date;
    let dayLabel = '';
    if (returnIso) {
      const parsed = new Date(returnIso);
      if (!Number.isNaN(parsed.getTime())) {
        dayLabel = getLocalDateYmd(parsed);
      }
    }
    return {
      id: row.returnId ?? row.id ?? index,
      storeName:
        row.storeName ||
        row.customerName ||
        (row.remarks && String(row.remarks).slice(0, 40)) ||
        'Return',
      time: formatTimeLabel(timeRaw),
      dayLabel,
      items: items.map(it => ({
        productName: it.productName || it.name || '—',
        quantity: Number(it.quantity ?? it.qty ?? 0),
        returnType: normalizeReturnType(it.returnType),
      })),
    };
  });
}

function summarizeFromLogs(logList) {
  let normal = 0;
  let damaged = 0;
  logList.forEach(log => {
    log.items.forEach(item => {
      const q = Number(item.quantity) || 0;
      if (item.returnType === 'NORMAL') {
        normal += q;
      } else {
        damaged += q;
      }
    });
  });
  return { normal, damaged };
}

export default function ReturnsSummaryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { data } = useSelector(state => state.Login);
  const [storedLogin, setStoredLogin] = useState(null);

  const loginData = data || storedLogin;
  const driverId = loginData?.id;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('userData');
        if (raw && !cancelled) {
          setStoredLogin(JSON.parse(raw));
        }
      } catch (e) {
        console.warn('ReturnsSummary AsyncStorage userData', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const defaultRange = getReturnsListRangeDaysBack(90);
  const [fromDate, setFromDate] = useState(defaultRange.fromDate);
  const [toDate, setToDate] = useState(defaultRange.toDate);
  const [pickerTarget, setPickerTarget] = useState(null);

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ normal: 0, damaged: 0 });
  const [logs, setLogs] = useState([]);
  console.log("Retuns report data---------------->", logs);


  const loadReturns = useCallback(async () => {
    if (driverId == null || driverId === '') {
      return;
    }
    const startMs = ymdToDate(fromDate).getTime();
    const endMs = ymdToDate(toDate).getTime();
    if (startMs > endMs) {
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(endpoints.GET_RETURNS_LIST, {
        params: {
          driverId: Number(driverId),
          fromDate,
          toDate,
        },
      });
      const body = res?.data;
      const normalized = normalizeReturnLogs(body);
      setLogs(normalized);
      setSummary(summarizeFromLogs(normalized));
    } catch (e) {
      console.log('ReturnsSummary load returns', e?.response?.data || e);
      setLogs([]);
      setSummary({ normal: 0, damaged: 0 });
    } finally {
      setLoading(false);
    }
  }, [driverId, fromDate, toDate]);

  const applyDateRange = () => {
    const startMs = ymdToDate(fromDate).getTime();
    const endMs = ymdToDate(toDate).getTime();
    if (startMs > endMs) {
      Alert.alert('Invalid range', 'From date cannot be after To date.');
      return;
    }
    loadReturns();
  };

  const resetToLast90Days = () => {
    const r = getReturnsListRangeDaysBack(90);
    setFromDate(r.fromDate);
    setToDate(r.toDate);
  };

  const onDateChange = (event, selected) => {
    const target = pickerTarget;
    if (Platform.OS === 'android') {
      setPickerTarget(null);
      if (event?.type === 'dismissed') {
        return;
      }
    }
    if (selected && target) {
      const ymd = getLocalDateYmd(selected);
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

  useEffect(() => {
    if (driverId == null || driverId === '') {
      return;
    }
    const startMs = ymdToDate(fromDate).getTime();
    const endMs = ymdToDate(toDate).getTime();
    if (startMs > endMs) {
      return;
    }
    loadReturns();
  }, [driverId, fromDate, toDate, loadReturns]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white);
      StatusBar.setBarStyle('dark-content');
      if (driverId != null && driverId !== '') {
        loadReturns();
      }
    }, [driverId, loadReturns]),
  );

  const renderItemCard = item => {
    const isNormal = item.returnType === 'NORMAL';

    return (
      <View
        style={[
          styles.logCard,
          isNormal ? styles.normalBg : styles.damagedBg,
        ]}>
        <View style={styles.logTitleRow}>
          <Icon
            name={isNormal ? 'cube-outline' : 'alert-outline'}
            size={16}
            color={isNormal ? '#16A34A' : '#DC2626'}
          />

          <Text
            style={[
              styles.typeTitle,
              { color: isNormal ? '#16A34A' : '#DC2626' },
            ]}>
            {isNormal ? 'Normal Returns' : 'Damaged Returns'}
          </Text>
        </View>

        <Text style={[styles.logText, !isNormal && { color: '#DC2626' }]}>
          {item.productName}: {item.quantity}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.safe}>
      <View style={{ paddingTop: insets.top }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + 90 },
        ]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={22} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Returns Summary</Text>
        </View>

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

        <Text style={styles.filterSectionLabel}>Date range</Text>
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
        <TouchableOpacity onPress={resetToLast90Days} style={styles.resetRow}>
          <Text style={styles.resetText}>Reset to last 90 days</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#EF3D3B"
            style={{ marginVertical: 20 }}
          />
        ) : null}

        {!loading || logs.length > 0 ? (
          <>
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, styles.greenCard]}>
                <Icon name="cube-outline" size={26} color="#fff" />
                <Text style={styles.summaryTitle}>Normal Returns</Text>
                <Text style={styles.summaryCount}>
                  {summary.normal} items
                </Text>
              </View>

              <View style={[styles.summaryCard, styles.redCard]}>
                <Icon name="alert-outline" size={26} color="#fff" />
                <Text style={styles.summaryTitle}>Damaged</Text>
                <Text style={styles.summaryCount}>
                  {summary.damaged} items
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Returns</Text>

            {logs.length > 0 ? (
              logs.map((log, index) => (
                <View key={log.id ?? index} style={styles.logBlock}>
                  <View style={styles.logHeader}>
                    <Text style={styles.storeName}>{log.storeName}</Text>
                    <Text style={styles.timeText}>
                      {[log.dayLabel, log.time].filter(Boolean).join(' · ') ||
                        '—'}
                    </Text>
                  </View>

                  <View  style={styles.cardsRow}>
                    {log.items.map((item, idx) => (
                      <View key={`${log.id}-${idx}`} style={styles.cardWrapper} >
                        {renderItemCard(item)}
                      </View>
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>
                No returns in this date range. Try widening From / To or tap
                Reset.
              </Text>
            )}
          </>
        ) : null}
      </ScrollView>

      <TouchableOpacity
        style={styles.fabAddReturn}
        onPress={() => navigation.navigate('AddReturnScreen')}
        activeOpacity={0.9}>
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginLeft: 10,
  },

  filterSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },

  dateFilterRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 8,
  },

  dateField: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  dateLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },

  dateValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  applyBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },

  applyBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  resetRow: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },

  resetText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
  },

  fabAddReturn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  summaryCard: {
    width: '48%',
    borderRadius: 12,
    padding: 14,
  },

  greenCard: {
    backgroundColor: '#16A34A',
  },

  redCard: {
    backgroundColor: '#DC2626',
  },

  summaryTitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '700',
  },

  summaryCount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  logBlock: {
    marginBottom: 18,
  },

  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  storeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },

  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },

  logCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },

  normalBg: {
    backgroundColor: '#F0FDF4',
  },

  damagedBg: {
    backgroundColor: '#FEF2F2',
  },

  logTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  typeTitle: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
  },

  logText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: fonts.sfmedium,
  },

  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 20,
  },

  cardsRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},

cardWrapper: {
  width: '48%',
},

});

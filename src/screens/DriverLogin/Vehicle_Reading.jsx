import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {colors} from '../../config/theme';
import commonstyles from '../../commonstyles/commonstyles';
import api from '../../utils/api';
import {endpoints} from '../../config/config';

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

const localYmdFromIso = iso => {
  if (!iso) {
    return '';
  }
  try {
    return formatYmd(new Date(iso));
  } catch {
    return '';
  }
};

/** Calendar day from API (prefer date part of ISO to avoid TZ false positives). */
const calendarYmdFromReading = iso => {
  if (!iso) {
    return '';
  }
  const s = String(iso);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    return s.slice(0, 10);
  }
  try {
    return formatYmd(new Date(iso));
  } catch {
    return '';
  }
};

const matchesReadingPostDate = (readingIso, postYmd) => {
  if (!postYmd) {
    return false;
  }
  const fromIso = calendarYmdFromReading(readingIso);
  if (fromIso && fromIso === postYmd) {
    return true;
  }
  return localYmdFromIso(readingIso) === postYmd;
};

const isReadingEndOpen = r =>
  r.endReading === null ||
  r.endReading === undefined ||
  r.endReading === '';

const ymdMin = (a, b) => (a <= b ? a : b);
const ymdMax = (a, b) => (a >= b ? a : b);

const formatDisplay = iso => {
  if (!iso) {
    return '—';
  }
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(iso);
  }
};

/** Normalize GET driver-stock/:driverId payload (shape may vary). */
const parseVehicleFromDriverStock = payload => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const inner =
    payload.data != null && !Array.isArray(payload.data)
      ? payload.data
      : payload;
  if (!inner || typeof inner !== 'object') {
    return null;
  }
  const vid =
    inner.vehicleId ??
    inner.vehicle_id ??
    inner.assignedVehicleId ??
    inner.assigned_vehicle_id ??
    inner.vehicle?.id ??
    inner.assignedVehicle?.id;
  const vnum =
    inner.vehicleNumber ??
    inner.vehicle_number ??
    inner.registrationNumber ??
    inner.registration_number ??
    inner.numberPlate ??
    inner.number_plate;
  const vname =
    inner.vehicleName ??
    inner.vehicle_name ??
    inner.vehicleType ??
    inner.vehicle_type;

  let vidF = vid;
  let numF = vnum;
  let nameF = vname;
  const tryItem = it => {
    if (!it || typeof it !== 'object') {
      return;
    }
    if (vidF == null || Number.isNaN(Number(vidF))) {
      const x =
        it.vehicleId ?? it.vehicle_id ?? it.assignedVehicleId ?? it.vehicleID;
      if (x != null && !Number.isNaN(Number(x))) {
        vidF = x;
      }
    }
    if (!numF || !String(numF).trim()) {
      numF =
        it.vehicleNumber ??
        it.vehicle_number ??
        it.registrationNumber ??
        numF;
    }
    if (!nameF || !String(nameF).trim()) {
      nameF = it.vehicleName ?? it.vehicle_name ?? it.vehicleType ?? nameF;
    }
  };
  if (Array.isArray(inner.items) && inner.items.length) {
    tryItem(inner.items[0]);
  }

  const hasId = vidF != null && vidF !== '' && !Number.isNaN(Number(vidF));
  const hasNum = numF != null && String(numF).trim() !== '';
  const hasName = nameF != null && String(nameF).trim() !== '';
  if (!hasId && !hasNum && !hasName) {
    return null;
  }
  return {
    vehicleId: hasId ? Number(vidF) : null,
    vehicleNumber: hasNum ? String(numF).trim() : '',
    vehicleName: hasName ? String(nameF).trim() : '',
  };
};

const VehicleReadingScreen = ({route}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const paramVehicleId = route?.params?.vehicleId;

  const [userData, setUserData] = useState(null);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const today = formatYmd(new Date());
  const [listFrom, setListFrom] = useState(today);
  const [listTo, setListTo] = useState(today);
  const [pickerMode, setPickerMode] = useState(null);

  const [readingDatePost, setReadingDatePost] = useState(today);
  const [startReading, setStartReading] = useState('');
  const [meterImage, setMeterImage] = useState(null);

  const [vehicleId, setVehicleId] = useState(
    paramVehicleId != null ? Number(paramVehicleId) : null,
  );
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  /** From GET driver-stock/:driverId — primary source for plate & id */
  const [stockVehicle, setStockVehicle] = useState(null);
  const [manualVehicleId, setManualVehicleId] = useState('');

  const [closingDraft, setClosingDraft] = useState({});
  const [submittingStart, setSubmittingStart] = useState(false);
  const [submittingCloseId, setSubmittingCloseId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem('userData');
        if (raw) {
          setUserData(JSON.parse(raw));
        }
      } catch (e) {
        console.warn('Vehicle_Reading userData', e);
      }
    };
    load();
  }, []);

  const driverId = userData?.id;

  const fetchReadings = useCallback(
    async (opts = {}) => {
      const isPull = !!opts.isPullRefresh;
      if (!driverId) {
        setReadings([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      if (isPull) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      try {
        let stockParsed = null;
        try {
          const stockRes = await api.get(
            `${endpoints.GET_ASSIGN_STOCK}/${driverId}`,
            {timeout: 60000},
          );
          stockParsed = parseVehicleFromDriverStock(stockRes?.data);
          setStockVehicle(stockParsed);
        } catch {
          setStockVehicle(null);
        }

        const listLo = ymdMin(listFrom, listTo);
        const listHi = ymdMax(listFrom, listTo);
        const fromFetch = ymdMin(listLo, readingDatePost);
        const toFetch = ymdMax(listHi, readingDatePost);

        const q = new URLSearchParams({
          driverId: String(driverId),
          fromDate: fromFetch,
          toDate: toFetch,
        });
        const res = await api.get(
          `${endpoints.VEHICLE_READING}?${q.toString()}`,
          {timeout: 60000},
        );
        const list = res?.data?.data;
        
        const rows = Array.isArray(list) ? list : [];
        setReadings(rows);

        console.log('READINGS DATA =>', res?.data?.data);

        const sorted = [...rows].sort((a, b) => (b.id || 0) - (a.id || 0));
        const latest = sorted[0];

        if (stockParsed?.vehicleId != null && !Number.isNaN(stockParsed.vehicleId)) {
          setVehicleId(Number(stockParsed.vehicleId));
          if (stockParsed.vehicleNumber) {
            setVehicleNumber(stockParsed.vehicleNumber);
          }
          if (stockParsed.vehicleName) {
            setVehicleName(stockParsed.vehicleName);
          }
        } else if (latest?.vehicleId != null) {
          setVehicleId(Number(latest.vehicleId));
          setVehicleName(latest.vehicleName || '');
          setVehicleNumber(latest.vehicleNumber || '');
        }
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Failed to load readings';
        Alert.alert('Error', String(msg));
        setReadings([]);
      } finally {
        if (isPull) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [driverId, listFrom, listTo, readingDatePost],
  );

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white);
      StatusBar.setBarStyle('dark-content');
      if (driverId) {
        fetchReadings();
      }
    }, [driverId, fetchReadings]),
  );

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      return true;
    }
    if (Platform.OS !== 'android') {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'Allow access to choose a meter photo.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  const pickMeterPhoto = async () => {
    const ok = await requestStoragePermission();
    if (!ok) {
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Could not pick image');
          return;
        }
        if (response?.assets?.length) {
          setMeterImage(response.assets[0]);
        }
      },
    );
  };

  const openReadingOnPostDate = useMemo(() => {
    return readings.find(
      r =>
        matchesReadingPostDate(r.readingDate, readingDatePost) &&
        isReadingEndOpen(r),
    );
  }, [readings, readingDatePost]);

  const displayedReadings = useMemo(() => {
    const lo = ymdMin(listFrom, listTo);
    const hi = ymdMax(listFrom, listTo);
    const inRange = readings.filter(r => {
      const d =
        calendarYmdFromReading(r.readingDate) || localYmdFromIso(r.readingDate);
      return d >= lo && d <= hi;
    });
    const ids = new Set(inRange.map(r => r.id));
    const openForPost = readings.filter(
      r =>
        isReadingEndOpen(r) &&
        matchesReadingPostDate(r.readingDate, readingDatePost) &&
        !ids.has(r.id),
    );
    const merged = [...openForPost, ...inRange];
    merged.sort((a, b) => (b.id || 0) - (a.id || 0));
    return merged;
  }, [readings, listFrom, listTo, readingDatePost]);

  const effectiveVehicleId = useMemo(() => {
    if (
      stockVehicle?.vehicleId != null &&
      !Number.isNaN(stockVehicle.vehicleId)
    ) {
      return stockVehicle.vehicleId;
    }
    if (vehicleId != null && !Number.isNaN(vehicleId)) {
      return vehicleId;
    }
    const m = parseInt(manualVehicleId.replace(/\D/g, ''), 10);
    return Number.isFinite(m) ? m : null;
  }, [stockVehicle, vehicleId, manualVehicleId]);

  const headerVehicleNumber = stockVehicle?.vehicleNumber || vehicleNumber;
  const headerVehicleName = stockVehicle?.vehicleName || vehicleName;

  const onDateChange = (event, selected) => {
    const mode = pickerMode;
    if (Platform.OS === 'android') {
      setPickerMode(null);
      if (event?.type === 'dismissed') {
        return;
      }
    }
    if (!mode || !selected) {
      if (Platform.OS === 'ios') {
        setPickerMode(null);
      }
      return;
    }
    const ymd = formatYmd(selected);
    if (mode === 'listFrom') {
      setListFrom(ymd);
    } else if (mode === 'listTo') {
      setListTo(ymd);
    } else if (mode === 'postDate') {
      setReadingDatePost(ymd);
    }
    if (Platform.OS === 'ios') {
      setPickerMode(null);
    }
  };

  const applyListRange = () => {
    if (ymdToDate(listFrom) > ymdToDate(listTo)) {
      Alert.alert('Invalid range', 'From date cannot be after To date.');
      return;
    }
    fetchReadings();
  };

  const submitStartReading = async () => {
    if (!driverId) {
      Alert.alert('Login', 'Driver profile not found.');
      return;
    }
    if (effectiveVehicleId == null) {
      Alert.alert(
        'Vehicle',
        'Vehicle ID is missing. Ensure driver stock is assigned, or enter Vehicle ID below.',
      );
      return;
    }
    if (openReadingOnPostDate) {
      Alert.alert(
        'Open reading',
        'You already have an open reading for this date. Submit the closing KM first.',
      );
      return;
    }
    const start = Number(String(startReading).replace(/,/g, ''));
    if (startReading === '' || Number.isNaN(start) || start < 0) {
      Alert.alert('Validation', 'Enter a valid start odometer reading.');
      return;
    }
    setSubmittingStart(true);
    try {
      await api.post(endpoints.VEHICLE_READING, {
        driverId: Number(driverId),
        vehicleId: Number(effectiveVehicleId),
        readingDate: readingDatePost,
        startReading: start,
        image: meterImage?.base64 || '',
      });
      Alert.alert('Saved', 'Opening reading submitted.');
      setStartReading('');
      setMeterImage(null);
      await fetchReadings();
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Could not save reading';
      Alert.alert('Error', String(msg));
    } finally {
      setSubmittingStart(false);
    }
  };

  const setCloseField = (id, field, value) => {
    const key = id != null ? String(id) : '';
    if (!key) {
      return;
    }
    setClosingDraft(prev => ({
      ...prev,
      [key]: {...(prev[key] || {}), [field]: value},
    }));
  };

  const submitClosing = async item => {
    const id = item.id ?? item.readingId;
    if (id == null || id === '') {
      Alert.alert('Error', 'Missing reading id.');
      return;
    }
    const key = String(id);
    const draft = closingDraft[key] || {};
    const rawEnd = String(draft.endReading ?? '').trim().replace(/,/g, '');
    const end = Number(rawEnd);
    if (rawEnd === '' || Number.isNaN(end)) {
      Alert.alert('Validation', 'Enter closing odometer reading.');
      return;
    }
    const start = Number(item.startReading);
    if (!Number.isNaN(start) && end < start) {
      Alert.alert(
        'Validation',
        'Closing reading must be greater than or equal to start.',
      );
      return;
    }
    setSubmittingCloseId(key);
    try {
      await api.put(
        `${endpoints.VEHICLE_READING}/${id}`,
        {
          endReading: end,
          remarks: (draft.remarks || '').trim(),
        },
        {timeout: 60000},
      );
      Alert.alert('Saved', 'Closing reading updated.');
      setClosingDraft(prev => {
        const next = {...prev};
        delete next[key];
        return next;
      });
      await fetchReadings();
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Could not update reading';
      Alert.alert('Error', String(msg));
    } finally {
      setSubmittingCloseId(null);
    }
  };

  const renderReading = ({item}) => {
    const rowId = item.id ?? item.readingId;
    const rowKey = rowId != null ? String(rowId) : '';
    const isOpen = isReadingEndOpen(item);
    const draft = closingDraft[rowKey] || {};

    return (
      <View style={styles.readingCard}>
        <View style={styles.readingTop}>
          <View style={{flex: 1}}>
            <Text style={styles.readingTitle}>
              {item.vehicleName || stockVehicle?.vehicleName || 'Vehicle'}{' '}
              <Text style={styles.readingPlate}>
                {item.vehicleNumber || stockVehicle?.vehicleNumber
                  ? `· ${item.vehicleNumber || stockVehicle?.vehicleNumber}`
                  : ''}
              </Text>
            </Text>
            <Text style={styles.readingSub}>
              Date: {localYmdFromIso(item.readingDate) || '—'}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              isOpen ? styles.badgeOpen : styles.badgeDone,
            ]}>
            <Text style={styles.badgeText}>{isOpen ? 'Open' : 'Done'}</Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Start KM</Text>
            <Text style={styles.metricVal}>{item.startReading ?? '—'}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>End KM</Text>
            <Text style={styles.metricVal}>
              {item.endReading ?? '—'}
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Total</Text>
            <Text style={styles.metricVal}>
              {item.totalKm != null ? `${item.totalKm} km` : '—'}
            </Text>
          </View>
        </View>

        <Text style={styles.timeRow}>
          Start: {formatDisplay(item.startTime)} · End:{' '}
          {formatDisplay(item.endTime)}
        </Text>
        {item.remarks ? (
          <Text style={styles.remarks}>Remarks: {item.remarks}</Text>
        ) : null}

        {isOpen ? (
          <View style={styles.closeSection}>
            <Text style={styles.sectionTitle}>Closing reading</Text>
            <View style={commonstyles.for_border}>
              <TextInput
                style={commonstyles.inputfield}
                placeholder="End odometer (KM)"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={draft.endReading != null ? String(draft.endReading) : ''}
                onChangeText={t => setCloseField(rowKey, 'endReading', t)}
              />
            </View>
            <View style={[commonstyles.for_border, {marginTop: 10}]}>
              <TextInput
                style={[commonstyles.inputfield, {minHeight: 44}]}
                placeholder="Remarks (optional)"
                placeholderTextColor="#999"
                value={draft.remarks || ''}
                onChangeText={t => setCloseField(rowKey, 'remarks', t)}
              />
            </View>
            <TouchableOpacity
              style={styles.submitButton}
              disabled={submittingCloseId === rowKey}
              onPress={() => submitClosing(item)}>
              {submittingCloseId === rowKey ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Submit closing</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  const listHeader = (
    <>
      <View style={[styles.header, {paddingTop: Math.max(insets.top, 12)}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle reading</Text>
      </View>

      <View style={styles.vehicleCard}>
        <View style={styles.vehicleIcon}>
          <Ionicons name="car" size={18} color="#FFF" />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.vehiclePlateText} numberOfLines={1}>
            {headerVehicleNumber
              ? headerVehicleNumber
              : 'No plate on driver stock'}
          </Text>
          <Text style={styles.vehicleType} numberOfLines={2}>
            {headerVehicleName
              ? headerVehicleName
              : loading && driverId
                ? 'Loading driver stock…'
                : 'Assign vehicle in driver stock to continue'}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>History range</Text>
        <View style={styles.rangeRow}>
          <TouchableOpacity
            style={styles.dateChip}
            onPress={() => setPickerMode('listFrom')}>
            <Text style={styles.dateChipLabel}>From</Text>
            <Text style={styles.dateChipVal}>{listFrom}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateChip}
            onPress={() => setPickerMode('listTo')}>
            <Text style={styles.dateChipLabel}>To</Text>
            <Text style={styles.dateChipVal}>{listTo}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyChip} onPress={applyListRange}>
            <Text style={styles.applyChipText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      {effectiveVehicleId == null && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vehicle ID</Text>
          <Text style={styles.hint}>
            Driver stock did not return a vehicle ID. Enter the ID from your
            dispatch sheet.
          </Text>
          <View style={commonstyles.for_border}>
            <TextInput
              style={commonstyles.inputfield}
              placeholder="e.g. 1"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={manualVehicleId}
              onChangeText={setManualVehicleId}
            />
          </View>
        </View>
      )}

      {openReadingOnPostDate ? (
        <View style={[styles.card, styles.infoBanner]}>
          <Ionicons name="information-circle" size={22} color="#B45309" />
          <Text style={styles.infoBannerText}>
            You already have an open reading for {readingDatePost}. Submit closing
            KM in that row below, or pick another date above.
          </Text>
        </View>
      ) : null}

      <View
        style={[
          styles.card,
          openReadingOnPostDate ? styles.cardDisabled : null,
        ]}>
        <Text style={styles.sectionTitle}>Log opening (start)</Text>
        <Text style={styles.hint}>
          Submit once per vehicle per day before adding the closing reading.
        </Text>

        <Text style={styles.fieldLabel}>Reading date</Text>
        <TouchableOpacity
          style={styles.datePickRow}
          onPress={() => setPickerMode('postDate')}>
          <Text style={styles.datePickVal}>{readingDatePost}</Text>
          <Ionicons name="calendar-outline" size={20} color="#666" />
        </TouchableOpacity>

        <Text style={[styles.fieldLabel, {marginTop: 12}]}>Start odometer (KM)</Text>
        <View style={commonstyles.for_border}>
          <TextInput
            style={commonstyles.inputfield}
            placeholder="Enter start KM"
            placeholderTextColor="#999"
            keyboardType="numeric"
            editable={!openReadingOnPostDate}
            value={startReading}
            onChangeText={setStartReading}
          />
        </View>

        <Text style={[styles.fieldLabel, {marginTop: 12}]}>
          Meter photo (optional)
        </Text>
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={pickMeterPhoto}
          disabled={!!openReadingOnPostDate}>
          {meterImage?.uri ? (
            <Image source={{uri: meterImage.uri}} style={styles.meterPreview} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={22} color="#999" />
              <Text style={styles.uploadText}>Tap to attach meter photo</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (submittingStart || openReadingOnPostDate) && {opacity: 0.55},
          ]}
          disabled={submittingStart || !!openReadingOnPostDate}
          onPress={submitStartReading}>
          {submittingStart ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit opening reading</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.listSectionTitle}>Readings</Text>
    </>
  );

  const pickerValue =
    pickerMode === 'listFrom'
      ? listFrom
      : pickerMode === 'listTo'
        ? listTo
        : pickerMode === 'postDate'
          ? readingDatePost
          : today;

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      {pickerMode ? (
        <DateTimePicker
          value={ymdToDate(pickerValue)}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      ) : null}

      {loading && !refreshing ? (
        <View style={styles.centered}>
          {listHeader}
          <ActivityIndicator size="large" color="#F44336" />
        </View>
      ) : (
        <FlatList
          data={displayedReadings}
          keyExtractor={item => String(item.id ?? item.readingId ?? '')}
          renderItem={renderReading}
          ListHeaderComponent={listHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchReadings({isPullRefresh: true})}
              colors={['#F44336']}
            />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No readings in this date range.</Text>
          }
        />
      )}
    </View>
  );
};

export default VehicleReadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {flex: 1, justifyContent: 'center'},
  header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingHorizontal: 12,
  //   paddingBottom: 12,
  //  // backgroundColor: '#FFF',
  //   elevation: 2,

   flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 6, // reduced left/right space
  paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    color: '#111',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  vehicleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vehiclePlateText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  vehicleType: {
    color: '#FFECEC',
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  datePickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  datePickVal: {fontSize: 15, fontWeight: '600', color: '#111'},
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  dateChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 8,
    padding: 10,
  },
  dateChipLabel: {fontSize: 11, color: '#666', marginBottom: 4},
  dateChipVal: {fontSize: 14, fontWeight: '600', color: '#111'},
  applyChip: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  applyChipText: {color: '#fff', fontWeight: '600', fontSize: 14},
  uploadBox: {
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    overflow: 'hidden',
  },
  meterPreview: {width: '100%', height: 140, resizeMode: 'cover'},
  uploadText: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: '#F44336',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  submitText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  listSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  readingCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  readingTop: {flexDirection: 'row', alignItems: 'flex-start'},
  readingTitle: {fontSize: 15, fontWeight: '600', color: '#111'},
  readingPlate: {fontWeight: '500', color: '#555'},
  readingSub: {fontSize: 12, color: '#666', marginTop: 4},
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeOpen: {backgroundColor: '#FEF3C7'},
  badgeDone: {backgroundColor: '#DCFCE7'},
  badgeText: {fontSize: 12, fontWeight: '700', color: '#111'},
  metricsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  metric: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
  },
  metricLabel: {fontSize: 11, color: '#666'},
  metricVal: {fontSize: 14, fontWeight: '700', color: '#111', marginTop: 2},
  timeRow: {fontSize: 11, color: '#888', marginTop: 10},
  remarks: {fontSize: 12, color: '#555', marginTop: 8},
  closeSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  empty: {textAlign: 'center', color: '#888', paddingVertical: 24},
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  infoBannerText: {flex: 1, fontSize: 13, color: '#92400E', lineHeight: 18},
  cardDisabled: {opacity: 0.65},
});

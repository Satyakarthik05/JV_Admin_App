import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Dropdown} from 'react-native-element-dropdown';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../../config/theme';
import commonstyles from '../../commonstyles/commonstyles';
import api from '../../utils/api';
import {endpoints} from '../../config/config';
import {launchImageLibrary} from 'react-native-image-picker';

function getLocalDateYmd(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const newLineId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const emptyReturnLine = () => ({
  id: newLineId(),
  productId: null,
  quantity: '',
  returnType: 'NORMAL',
});

export default function AddReturnScreen() {
  const navigation = useNavigation();
  const {data} = useSelector(state => state.Login);
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
        console.warn('AddReturnScreen AsyncStorage userData', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const [productsLoading, setProductsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [returnLines, setReturnLines] = useState([emptyReturnLine()]);
  const [remarks, setRemarks] = useState('');
  /** react-native-image-picker asset with base64 when picked */
  const [proofImage, setProofImage] = useState(null);

  const todayDate = getLocalDateYmd();

  const productOptions = useMemo(
    () =>
      products.map(p => ({
        label: p.productName,
        value: p.id,
      })),
    [products],
  );

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white);
      StatusBar.setBarStyle('dark-content');
    }, []),
  );

  const loadProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const res = await api.get(endpoints.GET_PRODUCTS);
      const raw = res.data?.data ?? res.data;
      const list = Array.isArray(raw) ? raw : [];
      const active = list.filter(
        p => p.status === undefined || Number(p.status) === 1,
      );
      setProducts(active);
    } catch (e) {
      console.log('AddReturn load products', e);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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
          message: 'App needs access to your photos to attach a return image.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (e) {
      console.warn(e);
      return false;
    }
  };

  const pickReturnImage = async () => {
    const ok = await requestStoragePermission();
    if (!ok) {
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.85,
        includeBase64: true,
        selectionLimit: 1,
        maxWidth: 1600,
        maxHeight: 1600,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert(
            'Error',
            response.errorMessage || 'Failed to pick image',
          );
          return;
        }
        const a = response.assets?.[0];
        if (a?.base64) {
          setProofImage(a);
        } else {
          Alert.alert('Error', 'Could not read image. Try another photo.');
        }
      },
    );
  };

  const clearReturnImage = () => setProofImage(null);

  const addLine = () => {
    setReturnLines(prev => [...prev, emptyReturnLine()]);
  };

  const removeLine = lineId => {
    setReturnLines(prev => {
      const next = prev.filter(l => l.id !== lineId);
      return next.length ? next : [emptyReturnLine()];
    });
  };

  const updateLine = (lineId, patch) => {
    setReturnLines(prev =>
      prev.map(l => (l.id === lineId ? {...l, ...patch} : l)),
    );
  };

  const submitReturn = async () => {
    if (driverId == null || driverId === '') {
      Alert.alert('Error', 'Driver session not found. Please log in again.');
      return;
    }

    const items = returnLines
      .filter(
        l =>
          l.productId != null &&
          l.quantity !== '' &&
          Number(l.quantity) > 0,
      )
      .map(l => {
        const p = products.find(pr => pr.id === l.productId);
        return {
          productId: l.productId,
          productName: p?.productName || '',
          quantity: Number(l.quantity),
          // API list uses "DAMAGE" / "NORMAL"
          returnType: l.returnType === 'DAMAGED' ? 'DAMAGE' : 'NORMAL',
        };
      });

    if (!items.length) {
      Alert.alert(
        'Add items',
        'Select at least one product and enter a quantity for each line.',
      );
      return;
    }

    const imageUrl = proofImage?.base64?.trim() ?? '';

    const body = {
      returnDate: todayDate,
      driverId: Number(driverId),
      remarks: remarks.trim() || 'End of day returns',
      imageUrl,
      items,
    };

    try {
      setSubmitting(true);
      await api.post(endpoints.POST_DRIVER_RETURNS, body, {timeout: 120000});
      Alert.alert('Success', 'Return recorded successfully.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to submit return. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#000" />
        <Text style={styles.headerTitle}>Add Return</Text>
      </TouchableOpacity>
      <View style={styles.headerRule} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.hint}>
          Add one or more products. Each line can be normal or damaged.
        </Text>

        {productsLoading ? (
          <ActivityIndicator color="#EF4444" style={styles.loader} />
        ) : productOptions.length === 0 ? (
          <Text style={styles.warnText}>
            No products loaded. Check your connection and try again.
          </Text>
        ) : null}

        {returnLines.map((line, index) => (
          <View key={line.id} style={styles.lineCard}>
            <View style={styles.lineCardHeader}>
              <Text style={styles.lineLabel}>Item {index + 1}</Text>
              {returnLines.length > 1 ? (
                <TouchableOpacity
                  onPress={() => removeLine(line.id)}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                  <Icon name="trash-can-outline" size={20} color="#DC2626" />
                </TouchableOpacity>
              ) : null}
            </View>

            <Text style={styles.fieldLabel}>Product</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.dropdownPh}
              selectedTextStyle={styles.dropdownSelected}
              itemTextStyle={styles.dropdownItem}
              showsVerticalScrollIndicator={false}
              data={productOptions}
              labelField="label"
              valueField="value"
              placeholder="Select product"
              value={line.productId}
              onChange={item => updateLine(line.id, {productId: item.value})}
              renderRightIcon={() => (
                <Entypo name="chevron-small-down" size={18} color="#6B7280" />
              )}
            />

            <Text style={styles.fieldLabel}>Quantity</Text>
            <TextInput
              placeholder="Qty"
              value={line.quantity}
              onChangeText={text =>
                updateLine(line.id, {
                  quantity: text.replace(/[^0-9.]/g, ''),
                })
              }
              keyboardType="decimal-pad"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.fieldLabel}>Type</Text>
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  line.returnType === 'NORMAL' && styles.activeGreen,
                ]}
                onPress={() => updateLine(line.id, {returnType: 'NORMAL'})}>
                <Text
                  style={[
                    styles.typeTextBase,
                    line.returnType === 'NORMAL'
                      ? styles.typeTextOn
                      : styles.typeTextOff,
                  ]}>
                  Normal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  line.returnType === 'DAMAGED' && styles.activeRed,
                ]}
                onPress={() => updateLine(line.id, {returnType: 'DAMAGED'})}>
                <Text
                  style={[
                    styles.typeTextBase,
                    line.returnType === 'DAMAGED'
                      ? styles.typeTextOn
                      : styles.typeTextOff,
                  ]}>
                  Damaged
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addAnotherBtn} onPress={addLine}>
          <Icon name="plus" size={18} color="#EF4444" />
          <Text style={styles.addAnotherText}>Add another product</Text>
        </TouchableOpacity>

        <Text style={styles.fieldLabel}>Photo (optional)</Text>
        <Text style={styles.photoHint}>
          Attach a photo of returned goods. Stored as base64 in{' '}
          <Text style={styles.photoHintMono}>imageUrl</Text> on submit.
        </Text>
        {proofImage?.uri ? (
          <View style={styles.photoPreviewWrap}>
            <Image
              source={{uri: proofImage.uri}}
              style={styles.photoPreview}
              resizeMode="cover"
            />
            <View style={styles.photoActions}>
              <TouchableOpacity
                style={styles.photoBtn}
                onPress={pickReturnImage}>
                <Text style={styles.photoBtnText}>Change photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.photoBtn, styles.photoBtnOutline]}
                onPress={clearReturnImage}>
                <Text style={styles.photoBtnTextDark}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.photoPicker}
            onPress={pickReturnImage}
            activeOpacity={0.85}>
            <Icon name="camera-outline" size={22} color="#EF4444" />
            <Text style={styles.photoPickerText}>Add photo from gallery</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.fieldLabel}>Remarks (optional)</Text>
        <TextInput
          placeholder="End of day returns"
          value={remarks}
          onChangeText={setRemarks}
          style={[styles.input, styles.remarksInput]}
          placeholderTextColor="#9CA3AF"
          multiline
        />

        <TouchableOpacity
          style={[commonstyles.redbutton, submitting && styles.submitDisabled]}
          onPress={submitReturn}
          disabled={submitting || productsLoading}>
          <Text style={commonstyles.redbuttonText}>
            {submitting ? 'Submitting…' : 'Submit return'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  headerRule: {
    borderBottomWidth: 1,
    borderColor: '#cfcfcf',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 32,
  },
  hint: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  loader: {
    marginVertical: 16,
  },
  warnText: {
    color: '#B45309',
    fontSize: 13,
    marginBottom: 12,
  },
  lineCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  lineCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  lineLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  dropdownPh: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  dropdownSelected: {
    fontSize: 14,
    color: '#111827',
  },
  dropdownItem: {
    fontSize: 14,
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
    color: '#111827',
    backgroundColor: '#fff',
  },
  remarksInput: {
    height: 72,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  typeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  activeGreen: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  activeRed: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  typeTextBase: {
    fontWeight: '700',
    fontSize: 14,
  },
  typeTextOn: {
    color: '#fff',
  },
  typeTextOff: {
    color: '#374151',
  },
  addAnotherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginBottom: 8,
  },
  addAnotherText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  photoHint: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  photoHintMono: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    color: '#374151',
  },
  photoPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 16,
    marginBottom: 14,
    backgroundColor: '#FAFAFA',
  },
  photoPickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  photoPreviewWrap: {
    marginBottom: 14,
  },
  photoPreview: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  photoBtn: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  photoBtnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  photoBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  photoBtnTextDark: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 13,
  },
});

import React, {useCallback, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {colors, fonts} from '../../config/theme';
import Feather from 'react-native-vector-icons/Feather';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {approveDriverStock} from '../../redux/reducers/Production/productionModuleSlice';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const DriverStockDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {loading} = useSelector(state => state.productionmodule);

  const stockData = route.params?.stockData;

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white);
      StatusBar.setBarStyle('dark-content');
    }, []),
  );

  const handleApprovePress = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmApproval = async () => {
    setShowConfirmModal(false);

    try {
      const result = await dispatch(approveDriverStock(stockData.stockId)).unwrap();
      
      console.log(result, 'Driver stock approval result');
      
      Alert.alert(
        'Success',
        result.message || 'Driver stock dispatched successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error approving driver stock:', error);
      Alert.alert(
        'Error',
        error || 'Failed to dispatch driver stock. Please try again.',
        [{text: 'OK'}]
      );
    }
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (!stockData) {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <TouchableOpacity
            style={styles.header}
            onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#000" />
            <Text style={styles.title}>Driver Stock Details</Text>
          </TouchableOpacity>
        </SafeAreaView>
        <Text style={styles.errorText}>No stock data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TouchableOpacity
          style={styles.header}
          onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
          <Text style={styles.title}>Driver Stock Details</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>
        {/* Driver Information Section */}
        <Text style={[styles.title, {marginTop: 20}]}>Driver Information</Text>
        <View style={styles.card}>
          <View style={styles.head}>
            <Text style={styles.first}>Stock ID</Text>
            <View style={styles.for_border_readonly}>
              <TextInput
                style={styles.inputfield}
                editable={false}
                value={stockData.stockId?.toString()}
              />
            </View>
          </View>

          <View style={styles.head}>
            <Text style={styles.first}>Driver Name</Text>
            <View style={styles.for_border_readonly}>
              <TextInput
                style={styles.inputfield}
                editable={false}
                value={stockData.name || 'N/A'}
              />
            </View>
          </View>

          <View style={styles.head}>
            <Text style={styles.first}>Employee Code</Text>
            <View style={styles.for_border_readonly}>
              <TextInput
                style={styles.inputfield}
                editable={false}
                value={stockData.empCode || 'N/A'}
              />
            </View>
          </View>

          <View style={styles.head}>
            <Text style={styles.first}>Mobile Number</Text>
            <View style={styles.for_border_readonly}>
              <TextInput
                style={styles.inputfield}
                editable={false}
                value={stockData.mobileNumber || 'N/A'}
              />
            </View>
          </View>

          <View style={styles.head}>
            <Text style={styles.first}>Stock Date</Text>
            <View style={styles.for_border_readonly}>
              <TextInput
                style={styles.inputfield}
                editable={false}
                value={formatDate(stockData.stockDate)}
              />
            </View>
          </View>

          <View style={styles.head}>
            <Text style={styles.first}>Status</Text>
            <View style={[
              styles.for_border_readonly,
              stockData.status === 'Approved' && styles.statusApproved,
              stockData.status === 'Pending' && styles.statusPending,
              stockData.status === 'Dispatched' && styles.statusDispatched,
            ]}>
              <TextInput
                style={[
                  styles.inputfield,
                  styles.statusText,
                  stockData.status === 'Approved' && styles.statusTextApproved,
                  stockData.status === 'Pending' && styles.statusTextPending,
                  stockData.status === 'Dispatched' && styles.statusTextDispatched,
                ]}
                editable={false}
                value={stockData.status || 'N/A'}
              />
            </View>
          </View>
        </View>

        {/* Vehicle Information Section */}
        <Text style={[styles.title, {marginTop: 25, color: colors.commoncolor}]}>
          Vehicle Information
        </Text>
        <View style={styles.card}>
          <Text style={styles.first}>Vehicle Number</Text>
          <View style={styles.for_border_readonly}>
            <TextInput
              style={styles.inputfield}
              editable={false}
              value={stockData.vehicleNumber || 'N/A'}
            />
          </View>

          <View style={styles.head}>
            <Text style={styles.first}>Vehicle Name</Text>
            <View style={styles.for_border_readonly}>
              <TextInput
                style={styles.inputfield}
                editable={false}
                value={stockData.vehicleName || 'N/A'}
              />
            </View>
          </View>
        </View>

        {/* Products/Items Section */}
        <Text style={[styles.title, {marginTop: 25, color: colors.commoncolor}]}>
          Stock Items
        </Text>
        {stockData.items && stockData.items.length > 0 ? (
          stockData.items.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.itemHeader}>
                <View style={styles.itemNumber}>
                  <Text style={styles.itemNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.itemHeaderText}>Item Details</Text>
              </View>

              <Text style={styles.first}>Product Name</Text>
              <View style={styles.for_border_readonly}>
                <TextInput
                  style={styles.inputfield}
                  editable={false}
                  value={item.productName || 'N/A'}
                />
              </View>

              <View style={styles.head}>
                <Text style={styles.first}>Quantity</Text>
                <View style={styles.for_border_readonly}>
                  <TextInput
                    style={styles.inputfield}
                    editable={false}
                    value={item.quantity?.toString() || '0'}
                  />
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.card}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        )}
      </ScrollView>

      {/* Approve Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.approveButton, loading && styles.disabledButton]}
          onPress={handleApprovePress}
          disabled={loading}>
          <Text style={styles.approveButtonText}>
            {loading ? 'Approving...' : 'Dispatch'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Dispatch</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to approve Stock ID: {stockData.stockId} for
              driver {stockData.name}?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfirmModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmApproval}>
                <Text style={styles.confirmButtonText}>Dispatch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginLeft: 8,
    fontFamily: fonts.sfbold,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    elevation: 4,
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginHorizontal:2,
     marginTop:responsiveHeight(0.5),
  },
  head: {
    marginTop: 15,
  },
  first: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.formtitlegry,
    marginBottom: 5,
    fontFamily: fonts.sfmedium,
  },
  for_border_readonly: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F9F9F9',
  },
  inputfield: {
    flex: 1,
    color: colors.inputfieldcolor,
    fontSize: 16,
    height: 45,
  },
  statusText: {
    fontWeight: '600',
    fontFamily: fonts.sfbold,
  },
  statusApproved: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  },
  statusTextApproved: {
    color: '#155724',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
  },
  statusTextPending: {
    color: '#856404',
  },
  statusDispatched: {
    backgroundColor: '#d1ecf1',
    borderColor: '#17a2b8',
  },
  statusTextDispatched: {
    color: '#0c5460',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  itemNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.commoncolor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  itemNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.sfbold,
  },
  itemHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    fontFamily: fonts.sfbold,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: -2},
  },
  approveButton: {
    backgroundColor: '#28a745',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  approveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fonts.sfbold,
  },
  errorText: {
    fontSize: 16,
    color: colors.inputfieldcolor,
    textAlign: 'center',
    marginTop: 50,
    fontFamily: fonts.sfmedium,
  },
  emptyText: {
    fontSize: 16,
    color: colors.inputfieldcolor,
    textAlign: 'center',
    fontFamily: fonts.sfmedium,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 25,
    margin: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    fontFamily: fonts.sfbold,
    textAlign: 'center',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 15,
    color: colors.inputfieldcolor,
    fontFamily: fonts.sfmedium,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.commomcolorlight || '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputfieldborder || '#E0E0E0',
  },
  cancelButtonText: {
    color: colors.inputfieldcolor,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.sfbold,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#28a745',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.sfbold,
  },
});

export default DriverStockDetails;

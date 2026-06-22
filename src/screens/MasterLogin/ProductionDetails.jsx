import React, {useCallback, useState, useEffect} from 'react';
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
  Image,
} from 'react-native';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {colors, fonts} from '../../config/theme';
import Feather from 'react-native-vector-icons/Feather';
import {SafeAreaView} from 'react-native-safe-area-context';
import {approveProduction} from '../../redux/reducers/Production/productionModuleSlice';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const ProductionDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const productionData = route.params?.productionData;

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white);
      StatusBar.setBarStyle('dark-content');
    }, []),
  );

  const handleApprovePress = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmApproval = () => {
    setLoading(true);
    setShowConfirmModal(false);

    dispatch(approveProduction(productionData.productionId))
      .unwrap()
      .then(() => {
        Alert.alert(
          'Success',
          'Production approved successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]
        );
      })
      .catch((error) => {
        Alert.alert(
          'Error',
          error || 'Failed to approve production'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      return new Date(timeString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return timeString;
    }
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const diffMs = end - start;
      const diffMins = Math.floor(diffMs / 60000);
      return diffMins > 0 ? `${diffMins} Mins` : 'N/A';
    } catch {
      return 'N/A';
    }
  };

  if (!productionData) {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <TouchableOpacity
            style={styles.header}
            onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#000" />
            <Text style={styles.title}>Production Details</Text>
          </TouchableOpacity>
        </SafeAreaView>
        <Text style={styles.errorText}>No production data found</Text>
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
          <Text style={styles.title}>Production Details</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>
        
        {/* Production Information Section */}
        <Text style={[styles.title, {marginTop: 20}]}>
          Production Information
        </Text>
        <View style={styles.card}>
          <View style={styles.head}>
            <Text style={styles.first}>Production ID</Text>
            <View style={styles.for_border_readonly}>
              <TextInput
                style={styles.inputfield}
                editable={false}
                value={productionData.productionId?.toString()}
              />
            </View>
          </View>

          <View style={styles.head}>
            <Text style={styles.first}>Date</Text>
            <View style={styles.for_border_readonly}>
              <TextInput
                style={styles.inputfield}
                editable={false}
                value={formatDate(productionData.productionDate)}
              />
            </View>
          </View>

          <View style={styles.head}>
            <Text style={styles.first}>Production Incharge</Text>
            <View style={styles.for_border_readonly}>
              <TextInput
                style={styles.inputfield}
                editable={false}
                value={productionData.productionInchargeId?.toString() || 'N/A'}
              />
            </View>
          </View>

          <View style={styles.head}>
            <Text style={styles.first}>Status</Text>
            <View style={[
              styles.statusBadgeContainer,
              productionData.status === 'APPROVED' && styles.approvedBadge,
              productionData.status === 'PENDING' && styles.pendingBadge,
              productionData.status === 'REJECTED' && styles.rejectedBadge,
            ]}>
              <Text style={[
                styles.statusText,
                productionData.status === 'APPROVED' && styles.approvedText,
                productionData.status === 'PENDING' && styles.pendingText,
                productionData.status === 'REJECTED' && styles.rejectedText,
              ]}>
                {productionData.status?.toUpperCase() || 'UNKNOWN'}
              </Text>
            </View>
          </View>
        </View>

        {/* Products and Batches Section */}
        {productionData.products && productionData.products.length > 0 && (
          productionData.products.map((product, pIndex) => (
            <View key={product.productRowId || pIndex}>
              <Text
                style={[
                  styles.title,
                  {marginTop: 25, color: colors.commoncolor},
                ]}>
                Product {pIndex + 1}
              </Text>

              <View style={styles.card}>
                <Text style={styles.first}>Product Category</Text>
                <View style={styles.for_border_readonly}>
                  <TextInput
                    style={styles.inputfield}
                    editable={false}
                    value={product.categoryName || 'N/A'}
                  />
                </View>

                <View style={styles.head}>
                  <Text style={styles.first}>Product Name</Text>
                  <View style={styles.for_border_readonly}>
                    <TextInput
                      style={styles.inputfield}
                      editable={false}
                      value={product.productName || 'N/A'}
                    />
                  </View>
                </View>
              </View>

              {/* Batches for this product */}
              {product.batches && product.batches.length > 0 && (
                product.batches.map((batch, bIndex) => {
                  const duration = calculateDuration(batch.startTime, batch.endTime);
                  const hasDelay = batch.reason && batch.reason.trim() !== '';

                  return (
                    <View key={batch.batchId || bIndex} style={styles.card}>
                      <View style={styles.batchHeaderCard}>
                        <View style={styles.batchLeft}>
                          <View style={styles.batchNumber}>
                            <Text style={styles.batchNumberText}>
                              {batch.batchNo || bIndex + 1}
                            </Text>
                          </View>
                          <Text style={styles.batchHeaderText}>
                            Batch Section
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.first}>Ballet Number</Text>
                      <View style={styles.for_border_readonly}>
                        <TextInput
                          style={styles.inputfield}
                          editable={false}
                          value={batch.batchNo?.toString() || 'N/A'}
                        />
                      </View>

                      {batch.cases && (
                        <View style={styles.head}>
                          <Text style={styles.first}>No of Cases</Text>
                          <View style={styles.for_border_readonly}>
                            <TextInput
                              style={styles.inputfield}
                              editable={false}
                              value={batch.cases?.toString() || '0'}
                            />
                          </View>
                        </View>
                      )}

                      <View style={{marginBottom: 15, marginTop: 15}}>
                        <Text style={styles.first}>Duration</Text>
                        <View style={[styles.for_border_readonly, {backgroundColor: '#F9F9F9'}]}>
                          <TextInput
                            style={[
                              styles.inputfield,
                              {color: colors.commoncolor, fontWeight: '700'},
                            ]}
                            value={duration}
                            editable={false}
                          />
                        </View>
                      </View>

                      <View style={styles.head_new}>
                        <View style={styles.left}>
                          <Text style={styles.first}>Start Time</Text>
                          <View style={[styles.for_newborder, {backgroundColor: '#F5F5F5'}]}>
                            <TextInput
                              style={styles.newinputfield}
                              value={formatTime(batch.startTime)}
                              editable={false}
                              placeholder="00:00"
                              placeholderTextColor="#000"
                            />
                          </View>
                        </View>

                        <View style={styles.right}>
                          <Text style={styles.first}>End Time</Text>
                          <View style={[styles.for_newborder, {backgroundColor: '#F5F5F5'}]}>
                            <TextInput
                              style={styles.newinputfield}
                              value={formatTime(batch.endTime)}
                              editable={false}
                              placeholder="00:00"
                              placeholderTextColor="#000"
                            />
                          </View>
                        </View>
                      </View>

                      {/* Display Delay Information if exists */}
                      {hasDelay && (
                        <View
                          style={{
                            marginTop: 15,
                            borderTopWidth: 1,
                            borderColor: '#ffeb3b',
                            paddingTop: 10,
                            backgroundColor: '#fff9c4',
                            borderRadius: 8,
                            padding: 10,
                          }}>
                          <Text style={[styles.first, {color: '#f57f17', fontWeight: 'bold'}]}>
                            ⚠️ Delay Information
                          </Text>

                          <View style={styles.head}>
                            <Text style={styles.first}>Reason for Delay:</Text>
                            <View style={[styles.for_border_readonly, {backgroundColor: '#fff'}]}>
                              <TextInput
                                style={styles.inputfield}
                                value={batch.reason}
                                editable={false}
                                multiline={true}
                              />
                            </View>
                          </View>

                          {batch.image && (
                            <View style={styles.head}>
                              <Text style={styles.first}>Delay Documentation:</Text>
                              <View style={styles.inputfiled_upimg}>
                                <Image
                                  source={{uri: batch.image}}
                                  style={styles.uploadImage}
                                />
                              </View>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          ))
        )}

        {/* Approved Message */}
        {productionData.status === 'APPROVED' && (
          <View style={{ marginTop: 20, padding: 15, backgroundColor: '#d4edda', borderRadius: 8 }}>
            <Text style={{ color: '#155724', fontWeight: 'bold', textAlign: 'center', fontFamily: fonts.sfbold }}>
              ✅ This Production is already APPROVED
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Approve Button - Only show if status is not already approved */}
      {productionData.status !== 'APPROVED' && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.approveButton, loading && styles.disabledButton]}
            onPress={handleApprovePress}
            disabled={loading}
          >
            <Text style={styles.approveButtonText}>
              {loading ? 'Approving...' : 'Approve Production'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Approval</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to approve Production ID: {productionData.productionId}?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmApproval}
              >
                <Text style={styles.confirmButtonText}>Approve</Text>
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
  statusBadgeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.sfbold,
  },
  approvedBadge: {
    backgroundColor: colors.btnbggreen || '#E8F5E8',
  },
  approvedText: {
    color: colors.btntextgreen || '#4CAF50',
  },
  pendingBadge: {
    backgroundColor: colors.halfdaybg || '#FFF3E0',
  },
  pendingText: {
    color: colors.halfdayclr || '#FF9800',
  },
  rejectedBadge: {
    backgroundColor: colors.commomcolorlight || '#FFEBEE',
  },
  rejectedText: {
    color: colors.red || colors.commoncolor,
  },
  batchHeaderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  batchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batchNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.commoncolor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  batchNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.sfbold,
  },
  batchHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    fontFamily: fonts.sfbold,
  },
  head_new: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  left: {
    flex: 0.48,
  },
  right: {
    flex: 0.48,
  },
  for_newborder: {
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 6,
    height: 45,
    justifyContent: 'center',
  },
  newinputfield: {
    color: colors.black,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: fonts.sfmedium,
  },
  inputfiled_upimg: {
    height: 120,
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 6,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  uploadImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
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
    shadowOffset: { width: 0, height: -2 },
  },
  approveButton: {
    backgroundColor: '#28a745', // Dark green color
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
    shadowOffset: { width: 0, height: 5 },
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
    backgroundColor: '#28a745', // Dark green color
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

export default ProductionDetails;
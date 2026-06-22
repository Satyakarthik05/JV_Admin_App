import React, {useCallback, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {colors, fonts} from '../../config/theme';
import Feather from 'react-native-vector-icons/Feather';
import {GetAssignStock} from '../../redux/reducers/AccounsLogin/VehicleDetails';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const DriverStock = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const {StockData} = useSelector(state => state.GetDriverStockData);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.red || colors.commoncolor);
      StatusBar.setBarStyle('light-content');
      setLoading(true);

      dispatch(GetAssignStock())
        .unwrap()
        .then(() => {
          setLoading(false);
        })
        .catch(err => {
          console.log('Fetch Error:', err);
          setLoading(false);
        });
    }, [dispatch]),
  );

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const handleStockPress = item => {
    console.log('Navigating to driver stock details:', item);
    navigation.navigate('DriverStockDetails', {stockData: item});
  };

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={[styles.skeletonText, {width: '60%'}]} />
        <View style={[styles.skeletonText, {width: '30%'}]} />
      </View>
      <View style={[styles.skeletonHeader, {marginTop: 10}]}>
        <View style={[styles.skeletonText, {width: '40%'}]} />
        <View style={[styles.skeletonText, {width: '20%'}]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerContent}
            onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#fff" />
            <Text style={styles.headerTitle}>Driver Stock</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Body Section */}
      <View style={styles.body}>
        <Text style={styles.title}>All Driver Stocks</Text>

        {loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5]}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{paddingBottom: 100}}
            showsVerticalScrollIndicator={false}
            renderItem={() => <SkeletonCard />}
            scrollEnabled={false}
          />
        ) : !StockData || StockData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No driver stocks found</Text>
          </View>
        ) : (
          <FlatList
            data={StockData}
            keyExtractor={item => item.stockId.toString()}
            contentContainerStyle={{paddingBottom: 100}}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleStockPress(item)}
                activeOpacity={0.7}>
                <View style={styles.cardHeader}>
                  <Text style={styles.driverName}>{item.name}</Text>
                  <Text style={styles.date}>{formatDate(item.stockDate)}</Text>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Vehicle Number:</Text>
                    <Text style={styles.value}>{item.vehicleNumber}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Vehicle Name:</Text>
                    <Text style={styles.value}>{item.vehicleName}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Items:</Text>
                    <Text style={styles.value}>
                      {item.items?.length || 0} products
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Status:</Text>
                    <View style={[
                      styles.statusBadge,
                      item.status === 'Approved' && styles.statusBadgeApproved,
                      item.status === 'Pending' && styles.statusBadgePending,
                      item.status === 'Dispatched' && styles.statusBadgeDispatched,
                    ]}>
                      <Text style={[
                        styles.statusText,
                        item.status === 'Approved' && styles.statusTextApproved,
                        item.status === 'Pending' && styles.statusTextPending,
                        item.status === 'Dispatched' && styles.statusTextDispatched,
                      ]}>
                        {item.status || 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Arrow indicator */}
                {/* <View style={styles.arrowContainer}>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.inputfieldcolor}
                  />
                </View> */}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    backgroundColor: colors.red || colors.commoncolor,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 60,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginLeft: 8,
    fontFamily: fonts.sfbold,
  },
  body: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: fonts.sfbold,
    color: colors.black,
    marginBottom: 15,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    elevation: 4,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    marginHorizontal:2,
    marginTop:responsiveHeight(0.5),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fonts.sfbold,
    color: colors.black,
  },
  date: {
    fontSize: 14,
    color: colors.inputfieldcolor,
    fontFamily: fonts.sfmedium,
  },
  cardContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.formtitlegry,
    fontFamily: fonts.sfmedium,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    fontFamily: fonts.sfbold,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: fonts.sfbold,
    textAlign: 'center',
  },
  statusBadgeApproved: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  },
  statusTextApproved: {
    color: '#155724',
  },
  statusBadgePending: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
  },
  statusTextPending: {
    color: '#856404',
  },
  statusBadgeDispatched: {
    backgroundColor: '#d1ecf1',
    borderColor: '#17a2b8',
  },
  statusTextDispatched: {
    color: '#0c5460',
  },
  arrowContainer: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{translateY: -10}],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: colors.inputfieldcolor,
    fontFamily: fonts.sfmedium,
  },
  skeletonCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    elevation: 4,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonText: {
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
});

export default DriverStock;

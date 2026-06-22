

// export default CouponsListScreen;
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorCoupons } from '../redux/reducers/auth';

// Shimmer Imports
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const { width } = Dimensions.get('window');

const CouponsListScreen = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { vendorId } = route.params || {};
  const { userId } = useSelector((state) => state.Auth);
  const {
    vendorCoupons = [],
    vendorCouponsLoading = false,
    vendorCouponsError,
    vendorInfo,
  } = useSelector((state) => state.Auth || {});

  useEffect(() => {
    if (userId && vendorId) {
      dispatch(fetchVendorCoupons({ userId, vendorId }));
    }
  }, [userId, vendorId, dispatch]);

  const handleShowQR = (coupon) => {
    navigation.navigate('QRCodeScreen', { coupon });
  };

  const handleSubscribe = () => {
    console.log('Subscribed to', vendorInfo?.vendorName);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const renderCouponImageCard = ({ item }) => {
    const isUsed = item.isUsed === 1;

    return (
      <View style={[styles.couponContainer, isUsed && styles.usedCouponContainer]}>
        {isUsed && (
          <View style={styles.usedOverlay}>
            <Text style={styles.usedText}>ALREADY USED</Text>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={isUsed ? 0.7 : 0.9}
          onPress={() => !isUsed && navigation.navigate('CoffeeOfferScreen', { coupon: item })}
          disabled={isUsed}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={[
              styles.couponImage,
              isUsed && styles.usedCouponImage,
            ]}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    );
  };

  // Shimmer Placeholder for Loading State
  const renderShimmerCoupon = () => (
    <View style={styles.couponContainer}>
      <ShimmerPlaceholder
        style={styles.couponImage}
        shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
        autoRun={true}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        {/* Vendor Header - Show even during loading for better UX */}
        {vendorInfo && (
          <>
            <View style={styles.brandSection}>
              <View style={styles.logoContainer}>
                <Image
                  source={{ uri: vendorInfo.vendorLogo }}
                  style={styles.brandLogo}
                  resizeMode="contain"
                  defaultSource={require('../assets/profile1.png')}
                />
              </View>
              <Text style={styles.brandName}>{vendorInfo.vendorName}</Text>
              <Text style={styles.couponCount}>
                {vendorCouponsLoading
                  ? 'Loading offers...'
                  : `${vendorCoupons.length} Active Offer${vendorCoupons.length !== 1 ? 's' : ''}`}
              </Text>
            </View>

            <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
              <Text style={styles.subscribeButtonText}>Subscribe for Updates</Text>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#fff" style={styles.bellIcon} />
            </TouchableOpacity>
          </>
        )}

        {/* Shimmer Loading State */}
        {vendorCouponsLoading && (
          <View style={styles.listContainer}>
            {[1, 2, 3, 4].map((item) => (
              <View key={`shimmer-${item}`} style={{ marginBottom: 20 }}>
                {renderShimmerCoupon()}
              </View>
            ))}
          </View>
        )}

        {/* Actual Coupons List */}
        {!vendorCouponsLoading && vendorCoupons.length > 0 && (
          <FlatList
            data={vendorCoupons}
            renderItem={renderCouponImageCard}
            keyExtractor={(item) => item.couponId.toString()}
            contentContainerStyle={[
              styles.listContainer,
              { paddingBottom: insets.bottom + 100 },
            ]}
            showsVerticalScrollIndicator={false}
            snapToInterval={width - 32 + 16}
            decelerationRate="fast"
            pagingEnabled={vendorCoupons.length === 1 ? false : true}
          />
        )}

        {/* Empty State */}
        {!vendorCouponsLoading && vendorCoupons.length === 0 && !vendorCouponsError && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No offers available at the moment</Text>
            <Text style={styles.emptySubText}>Check back later!</Text>
          </View>
        )}

        {/* Error State */}
        {vendorCouponsError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{vendorCouponsError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => userId && vendorId && dispatch(fetchVendorCoupons({ userId, vendorId }))}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingHorizontal: 16, paddingVertical: 10 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  brandSection: { alignItems: 'center', paddingVertical: 20 },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    padding: 5,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    elevation: 5,
  },
  brandLogo: { width: 80, height: 80, borderRadius: 40 },
  brandName: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  couponCount: { fontSize: 15, color: '#666', marginTop: 4 },
  subscribeButton: {
    backgroundColor: '#E53935',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    elevation: 5,
  },
  subscribeButtonText: { fontSize: 17, fontWeight: 'bold', color: '#fff' },
  bellIcon: { marginLeft: 10 },

  // Coupon Card
  couponContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  couponImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
  },
  usedCouponContainer: {
    opacity: 0.6,
  },
  usedCouponImage: {
    opacity: 0.5,
  },
  usedOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#E53935',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  usedText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // States
  listContainer: { paddingTop: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyText: { fontSize: 18, color: '#888', textAlign: 'center' },
  emptySubText: { fontSize: 14, color: '#aaa', marginTop: 8 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginBottom: 16 },
  retryButton: { padding: 12, backgroundColor: '#003366', borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
});

export default CouponsListScreen;
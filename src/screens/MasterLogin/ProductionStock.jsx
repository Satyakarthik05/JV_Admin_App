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
import {useDispatch} from 'react-redux';
import {colors, fonts} from '../../config/theme';
import Feather from 'react-native-vector-icons/Feather';
import {fetchAllProductions} from '../../redux/reducers/Production/productionModuleSlice';
import { responsiveHeight } from 'react-native-responsive-dimensions';


const ProductionStock = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [productionList, setProductionList] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.red || colors.commoncolor);
      StatusBar.setBarStyle('light-content');
      setLoading(true);

      dispatch(fetchAllProductions())
        .unwrap()
        .then(data => {
          const list = data || [];
          setProductionList(list);
          setLoading(false);
        })
        .catch(err => {
          console.log('Fetch Error:', err);
          setLoading(false);
        });
    }, [dispatch]),
  );

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

  const handleProductionPress = (item) => {
    console.log('Navigating to production details:', item);
    navigation.navigate('ProductionDetails', { productionData: item });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerContent}
            onPress={() => navigation.goBack()}>
            <Feather
              name="arrow-left"
              size={24}
              color="#fff"
              style={styles.arrow}
            />
            <Text style={styles.headerTitle}>Productions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Body Section */}
      <View style={styles.body}>
        <Text style={styles.title}>All Productions</Text>

        {loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5]}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{paddingBottom: 100}}
            showsVerticalScrollIndicator={false}
            renderItem={() => <SkeletonCard />}
            scrollEnabled={false}
          />
        ) : productionList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No productions found</Text>
          </View>
        ) : (
          <FlatList
            data={productionList}
            keyExtractor={item => item.productionId.toString()}
            contentContainerStyle={{paddingBottom: 100}}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity 
                style={styles.card}
                onPress={() => handleProductionPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.productionId}>
                    Production ID: {item.productionId}
                  </Text>
                  <Text style={styles.date}>
                    {item.productionDate
                      ? new Date(item.productionDate).toLocaleDateString(
                          'en-GB',
                        )
                      : 'N/A'}
                  </Text>
                </View>
                
                <View style={styles.cardContent}>
                  <Text style={styles.status}>Status: {item.status}</Text>
                  
                  {/* Arrow indicator */}
                  <View style={styles.arrowContainer}>
                    <Feather name="chevron-right" size={20} color={colors.inputfieldcolor} />
                  </View>
                </View>
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal:2,
    marginTop:responsiveHeight(0.5),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productionId: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: fonts.sfmedium,
    color: colors.simpleblack,
  },
  arrowContainer: {
    padding: 5,
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

export default ProductionStock;
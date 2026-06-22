import React, { useCallback, useState } from 'react';
// 1. StyleSheet MUST be imported from 'react-native', NOT 'react'
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
// 2. Import these hooks for navigation to work
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { colors, fonts } from '../../config/theme';
import Feather from 'react-native-vector-icons/Feather';
import { fetchAllProductions } from '../../redux/reducers/Production/productionModuleSlice';
import { responsiveHeight } from 'react-native-responsive-dimensions';
const getLocalDateString = dateObj => {
  if (!dateObj) return null;
  const d = new Date(dateObj);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
};
const ProductionHome = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [productionList, setProductionList] = useState([]);
  const [hasTodayProduction, setHasTodayProduction] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.commoncolor);
      StatusBar.setBarStyle('light-content');
      setLoading(true);

      dispatch(fetchAllProductions())
        .unwrap()
        .then(data => {
          const list = data || [];
          setProductionList(list);

          // 1. Get today's local date string
          const todayStr = getLocalDateString(new Date());

          // 2. Check if any item in the list matches today's local date
          const exists = list.some(item => {
            const itemDateStr = getLocalDateString(item.productionDate);
            return itemDateStr === todayStr;
          });

          setHasTodayProduction(exists);
          setLoading(false);
        })
        .catch(err => {
          console.log('Fetch Error:', err);
          setLoading(false);
        });
    }, [dispatch]),
  );
  console.log("prodction data------------>", productionList);


  // Skeleton Loader Component
  const SkeletonCard = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={[styles.skeletonText, { width: '60%' }]} />
        <View style={[styles.skeletonText, { width: '30%' }]} />
      </View>
      <View style={[styles.skeletonHeader, { marginTop: 10 }]}>
        <View style={[styles.skeletonText, { width: '40%' }]} />
        <View style={[styles.skeletonText, { width: '20%' }]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.start_header}>
          <TouchableOpacity
            style={styles.for_flex}
            onPress={() => navigation.goBack()}>
            <Feather
              name="arrow-left"
              size={24}
              color="#fff"
              style={styles.arrow}
            />
            <Image
              source={require('../../assets/signin_logo.png')}
              style={styles.img_header}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('TelecallerProfile')}>
            <Feather name="user" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.start_header}>
          <Text style={styles.title}>Production</Text>

          {!hasTodayProduction && (
            <TouchableOpacity
              style={styles.btn}
              onPress={() => navigation.navigate('AddProduction')}>
              <Feather name="plus" size={14} color="#fff" />
              <Text style={styles.btn_text}>Add Production</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5]}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 100,paddingHorizontal: 2, }}
            showsVerticalScrollIndicator={false}
            renderItem={() => <SkeletonCard />}
            scrollEnabled={false}
          />
        ) : (
          <FlatList
            data={productionList}
            keyExtractor={item => item.productionId.toString()}
            contentContainerStyle={{ paddingBottom: 100,paddingHorizontal: 2, }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.start_header}>
                  <Text style={styles.title}>
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
                <View style={[styles.start_header, { paddingTop: 5 }]}>
                  <Text style={styles.BTH}>Status: {item.status}</Text>

                  {
                    item.status !== 'APPROVED' && (
                      <TouchableOpacity
                        onPress={() => {
                          // LOG THE DATA HERE
                          console.log(
                            'Navigating to AddProduction with item:',
                            JSON.stringify(item, null, 2),
                          );

                          navigation.navigate('AddProduction', { editData: item });
                        }}>
                        <Feather
                          name="edit"
                          size={18}
                          color={colors.commoncolor}
                        />
                      </TouchableOpacity>
                    )
                  }

                </View>
              </View>
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
  body: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    marginTop: 20,
  },
  header: {
    backgroundColor: colors.commoncolor,
    height: 130,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 15,
    elevation: 10,
  },
  BTH: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: fonts.sfmedium,
    color: colors.simpleblack,
  },
  start_header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    backgroundColor: colors.hrhomeprofile,
    padding: 9,
    borderRadius: 22,
  },
  img_header: {
    height: 39,
    width: 168,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: fonts.sfbold,
    color: colors.black,
  },
  btn: {
    backgroundColor: colors.commoncolor,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn_text: {
    paddingLeft: 5,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.sfbold,
    color: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    elevation: 4,
    marginBottom: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    //marginTop:responsiveHeight(1),
    marginHorizontal: 2, 
  },
  for_flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: colors.inputfieldcolor,
  },
  skeletonCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    elevation: 4,
    marginBottom: 10,
    marginTop: 10,
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

export default ProductionHome;

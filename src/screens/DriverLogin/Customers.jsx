// CustomersScreen.js
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, fonts} from '../../config/theme';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import commonstyles from '../../commonstyles/commonstyles';
import {useDispatch, useSelector} from 'react-redux';
import {
  DeleteCustomer,
  GetCustomerData,
} from '../../redux/reducers/DriverLogin/Forms';
import Feather from 'react-native-vector-icons/Feather';
import ProductSkeleton from '../../components/Skeletonplaceholder';
import CustomerSkeleton from '../../components/CustomerSkeleton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Customers() {
      const { data } = useSelector((state) => state.Login);
      const [userData, setUserData] = useState(null);
      const loginData = data || userData;
      
    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("userData");

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser);
            }
        }
        loadUser();
    }, []);
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(GetCustomerData()).unwrap();
    } catch (error) {
      console.log('Refresh error:', error);
    }
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white);
      StatusBar.setBarStyle('dark-content');

      const fetchData = async () => {
        setLoading(true);
        await dispatch(GetCustomerData()).unwrap();
        setLoading(false);
      };

      fetchData();
    }, [dispatch]),
  );

  const {CustomersDataGetCall} = useSelector(state => state.GetCustomers);
  console.log('Customers Data ---------------------->', CustomersDataGetCall);

  const handleDelete = id => {
    console.log('id---->', id);

    Alert.alert(
      'Delete  Customer Data',
      'Are You Sure To Delete Customer',
      [
        {
          text: 'No',
          onPress: () => console.log('Deletion Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await dispatch(DeleteCustomer(id)).unwrap();
            dispatch(GetCustomerData());
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.header}>Customers</Text>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Icon name="magnify" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Search shop, owner, mobile..."
              placeholderTextColor="#ccc"
              style={commonstyles.inputfield}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Icon name="tune-variant" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Counters */}
        <View style={styles.counterRow}>
          <View style={styles.counterBox}>
            <View style={[styles.dot, {backgroundColor: '#22C55E'}]} />
            <Text style={styles.counterText}>36</Text>
          </View>
          <View style={styles.counterBox}>
            <View style={[styles.dot, {backgroundColor: '#EAB308'}]} />
            <Text style={styles.counterText}>36</Text>
          </View>
          <View style={styles.counterBox}>
            <View style={[styles.dot, {backgroundColor: '#EF4444'}]} />
            <Text style={styles.counterText}>36</Text>
          </View>
        </View>

        {/* Cards */}
        <View style={styles.body}>
          {loading ? (
            <View style={{flex: 1}}>
              {/* <ActivityIndicator/> */}
              {[1, 2, 3, 4, 5].map((_, index) => (
                <CustomerSkeleton key={index} />
              ))}
            </View>
          ) : (
            <FlatList
              data={CustomersDataGetCall || []}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 30}}
              renderItem={({item}) => (
                <TouchableOpacity style={styles.card} onPress={()=>navigation.navigate("CustomerfullDetails",{customersData:item})}>
                  {/* Top */}
                  <View style={styles.cardTop}>
                    <View style={styles.rowCenter}>
                      <View style={[styles.dot, {backgroundColor: item.dot}]} />
                      <Text style={styles.storeName}>{item.shopName}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusPill,
                        {backgroundColor: item.statusBg},
                      ]}>
                      <Text
                        style={
                          item.status === 'ACTIVE'
                            ? commonstyles.active
                            : commonstyles.inactive
                        }>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.subText}>Owner: {item.ownerName}</Text>
                  <Text style={styles.subText}>{item.city}</Text>

                  {/* Phone */}
                  <View style={styles.phoneRow}>
                    <Icon name="phone-outline" size={14} color="#6B7280" />
                    <Text style={styles.phoneText}>{item.mobile}</Text>
                    {/* <View style={styles.routePill}>
                      <Text style={styles.routeText}>Route b</Text>
                    </View> */}
                  </View>

                  {/* Stats */}
                  {/* <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Icon
                        name="check-circle-outline"
                        size={14}
                        color="#EF4444"
                      />
                      <Text style={styles.statText}> Total Delivers : 23</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Icon
                        name="close-circle-outline"
                        size={14}
                        color="#EF4444"
                      />
                      <Text style={styles.statText}>
                        {' '}
                        Total Cancellations : 3
                      </Text>
                    </View>
                  </View> */}

                  {/* Actions */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${item.mobile}`)}>
                      <Icon name="phone" size={16} color="#fff" />
                      <Text style={styles.callText}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navigateBtn}>
                      <Ionicons
                        name="navigate-outline"
                        size={18}
                        color="#EF4444"
                      />
                      <Text style={styles.navigateText}>Navigate</Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 15,
                      alignSelf: 'flex-end',
                      paddingTop: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('EditCustomer', {EditData: item})
                      }>
                      <Feather name="edit" size={18} color="#00AD41" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Feather name="trash" size={18} color="#EF3D3B" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
          
        </View>
      </ScrollView>
      <TouchableOpacity
            style={styles.createCustomer}
            onPress={() => navigation.navigate('AddCustomerScreen')}>
            <AntDesign name="plus" size={24} color="#fff" />
          </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#fff'},
  container: {padding: 16, paddingBottom: 30,marginTop:10},
  header: {fontSize: 18, fontWeight: '600', marginBottom: 1, color: '#000'},
  searchRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
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
  searchInput: {flex: 1, marginLeft: 6, fontSize: 13},
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  counterRow: {
    flexDirection: 'row',
    marginBottom: 14,
    justifyContent: 'center',
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
  counterText: {marginLeft: 6, fontSize: 13, fontWeight: '600', color: '#000'},

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
  },
  cardTop: {flexDirection: 'row', justifyContent: 'space-between'},
  rowCenter: {flexDirection: 'row', alignItems: 'center'},
  dot: {width: 8, height: 8, borderRadius: 4, marginRight: 6},
  storeName: {fontSize: 14, fontWeight: '600', color: '#000'},

  statusPill: {borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4},
  statusText: {fontSize: 14, fontWeight: '600'},

  subText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: fonts.sfmedium,
  },

  phoneRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6},
  phoneText: {fontSize: 14, marginLeft: 6, color: colors.black},
  routePill: {
    marginLeft: 'auto',
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  routeText: {fontSize: 11, color: '#EF4444'},

  statsRow: {flexDirection: 'row', marginTop: 10},
  statItem: {flexDirection: 'row', alignItems: 'center', marginRight: 14},
  statText: {fontSize: 14, fontFamily: fonts.sfmedium, color: '#374151'},

  actionRow: {flexDirection: 'row', marginTop: 14},
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 10,
    marginRight: 8,
  },
  callText: {color: '#fff', marginLeft: 6, fontSize: 13, fontWeight: '600'},

  navBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 10,
  },
  navText: {marginLeft: 6, fontSize: 13, fontWeight: '600'},
  navigateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EF4444',
    marginLeft: 10,
  },
  navigateText: {
    marginLeft: 6,
    color: '#EF4444',
    fontWeight: '600',
  },
createCustomer: {
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
},

plusicon: {
  alignSelf: 'center',
},
});

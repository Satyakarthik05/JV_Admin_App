import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // <-- Add this
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fonts } from "../../config/theme";


const ReturnSumary = () => {
    const insets = useSafeAreaInsets(); // Get top and bottom insets
    const navigation = useNavigation();

    useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white)
      StatusBar.setBarStyle("dark-content")
    }, [])
  )
     return (
        <View style={styles.safe}>
          {/* Top inset padding */}
          <View style={{ paddingTop: insets.top }} />
    
          <ScrollView
            contentContainerStyle={[
              styles.container,
              { paddingBottom: insets.bottom + 30 }, // Extra bottom padding + safe area
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation?.goBack()}>
                <Icon name="arrow-left" size={22} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Returns Summary</Text>
            </View>
    
            {/* Summary Cards */}
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, styles.greenCard]}>
                <Icon name="cube-outline" size={26} color="#fff" />
                <Text style={styles.summaryTitle}>Normal Returns</Text>
                <Text style={styles.summaryCount}>41 items</Text>
              </View>
    
              <View style={[styles.summaryCard, styles.redCard]}>
                <Icon name="alert-outline" size={26} color="#fff" />
                <Text style={styles.summaryTitle}>Damaged</Text>
                <Text style={styles.summaryCount}>3 items</Text>
              </View>
            </View>
    
            {/* Logs */}
            <Text style={styles.sectionTitle}>Today's Logs</Text>
    
            {/* Log Item */}
            <View style={styles.logBlock}>
              <View style={styles.logHeader}>
                <Text style={styles.storeName}>Sai Kirana Store</Text>
                <Text style={styles.timeText}>Today, 10:30 AM</Text>
              </View>
    
              <View style={[styles.logCard, styles.normalBg]}>
                <View style={styles.logTitleRow}>
                  <Icon name="cube-outline" size={16} color="#16A34A" />
                  <Text style={styles.normalTitle}>Normal Returns</Text>
                </View>
                <Text style={styles.logText}>Empty Cans: 10</Text>
                <Text style={styles.logText}>Crates: 2</Text>
              </View>
            </View>
    
            {/* Log Item with Damaged */}
            <View style={styles.logBlock}>
              <View style={styles.logHeader}>
                <Text style={styles.storeName}>Annapurna General Store</Text>
                <Text style={styles.timeText}>Today, 10:30 AM</Text>
              </View>
    
              <View style={[styles.logCard, styles.normalBg]}>
                <View style={styles.logTitleRow}>
                  <Icon name="cube-outline" size={16} color="#16A34A" />
                  <Text style={styles.normalTitle}>Normal Returns</Text>
                </View>
                <Text style={styles.logText}>Empty Cans: 10</Text>
                <Text style={styles.logText}>Crates: 2</Text>
              </View>
    
              <View style={[styles.logCard, styles.damagedBg]}>
                <View style={styles.logTitleRow}>
                  <Icon name="alert-outline" size={16} color="#DC2626" />
                  <Text style={styles.damagedTitle}>Damaged Returns</Text>
                </View>
                <Text style={[styles.logText, styles.damagedText]}>Empty Cans: 10</Text>
                <Text style={[styles.logText, styles.damagedText]}>Crates: 2</Text>
              </View>
            </View>
    
            {/* Log Item */}
            <View style={styles.logBlock}>
              <View style={styles.logHeader}>
                <Text style={styles.storeName}>Sai Kirana Store</Text>
                <Text style={styles.timeText}>Today, 10:30 AM</Text>
              </View>
    
              <View style={[styles.logCard, styles.normalBg]}>
                <View style={styles.logTitleRow}>
                  <Icon name="cube-outline" size={16} color="#16A34A" />
                  <Text style={styles.normalTitle}>Normal Returns</Text>
                </View>
                <Text style={styles.logText}>Empty Cans: 10</Text>
                <Text style={styles.logText}>Crates: 2</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      );

};
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
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#000',
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
    backgroundColor:colors.btntextgreen,
  },
  redCard: {
    backgroundColor: 'rgba(248, 12, 23, 1)',
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 6,
    fontWeight:'bold',
  },
  summaryCount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },

  logBlock: {
    marginBottom: 18,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  timeText: {
    fontSize: 11,
    color: '#6B7280',
  },

  logCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  normalBg: {
     backgroundColor: colors.btnbggreen,
  },
  damagedBg: {
    backgroundColor: '#FEF2F2',
  },
  logTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  normalTitle: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
  },
  damagedTitle: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
  logText: {
    fontSize: 14,
    color:colors.black,
    fontFamily:fonts.sfregular,
  },
  damagedText: {
    color: '#DC2626',
  },
});
export default ReturnSumary;
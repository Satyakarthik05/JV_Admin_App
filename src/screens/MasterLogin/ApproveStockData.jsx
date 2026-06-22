import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { View, Text, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ApproveStockData = () => {
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            // Set Status Bar to match the header
            StatusBar.setBackgroundColor(colors.red || colors.commoncolor || '#D32F2F');
            StatusBar.setBarStyle("light-content");
        }, [])
    );

    const handleProductionStock = () => {
        try {
            navigation.navigate('ProductionStock');
            console.log("Navigating to Production Stock");
        } catch (error) {
            console.error("Navigation error to ProductionStock:", error);
        }
    };

    const handleDriverStock = () => {
        try {
            navigation.navigate('DriverStock');
            console.log("Navigating to Driver Stock");
        } catch (error) {
            console.error("Navigation error to DriverStock:", error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity 
                            style={styles.backButton} 
                            onPress={() => navigation.goBack()}
                        >
                            <Feather name="arrow-left" size={26} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Approve Stock</Text>
                    </View>
                </SafeAreaView>
            </View>

            {/* Content Section with Cards */}
            <View style={styles.content}>
                
                {/* Production Stock Card */}
                <TouchableOpacity 
                    style={styles.card} 
                    onPress={handleProductionStock}
                    activeOpacity={0.7}
                >
                    <View style={styles.iconContainer}>
                        <MaterialIcons 
                            name="precision-manufacturing" 
                            size={30} 
                            color={colors.red || colors.commoncolor || '#D32F2F'} 
                        />
                    </View>
                    <Text style={styles.cardText}>Production Stock</Text>
                    <Feather name="chevron-right" size={20} color="#CCC" />
                </TouchableOpacity>

                {/* Driver Stock Card */}
                <TouchableOpacity 
                    style={styles.card} 
                    onPress={handleDriverStock}
                    activeOpacity={0.7}
                >
                    <View style={styles.iconContainer}>
                        <FontAwesome5 
                            name="truck" 
                            size={25} 
                            color={colors.red || colors.commoncolor || '#D32F2F'} 
                        />
                    </View>
                    <Text style={styles.cardText}>Driver Stock</Text>
                    <Feather name="chevron-right" size={20} color="#CCC" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white || '#F8F9FA',
    },
    headerContainer: {
        backgroundColor: colors.red || colors.commoncolor || '#D32F2F',
        paddingBottom: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 15,
        fontFamily: fonts.sfbold || 'System',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginBottom: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FEECEC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    cardText: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        fontFamily: fonts.sfbold || 'System',
    },
});

export default ApproveStockData;
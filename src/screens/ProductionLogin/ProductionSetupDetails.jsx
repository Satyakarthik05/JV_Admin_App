import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from '../../config/theme';

const ProductionSetupDetails = ({ route, navigation }) => {
    const { setup } = route.params;

    const renderMaterial = ({ item }) => (
        <View style={styles.materialCard}>
            <View style={styles.row}>
                <Text style={styles.matLabel}>Material Name: {item.rawMaterialName}</Text>
                {/* <Text style={styles.matValue}></Text> */}
            </View>
            <View style={styles.divider} />
            <View style={styles.grid}>
                <View style={styles.col}>
                    <Text style={styles.subLabel}>Unit</Text>
                    <Text style={styles.subValue}>{item.consumptionUnit}</Text>
                </View>
                <View style={styles.col}>
                    <Text style={styles.subLabel}>Output</Text>
                    <Text style={styles.subValue}>{item.outputPerUnit}</Text>
                </View>
                {/* <View style={styles.col}>
                    <Text style={styles.subLabel}>Wastage</Text>
                    <Text style={styles.subValue}>{item.wastagePercent}%</Text>
                </View> */}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{setup.productName}</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={setup.materials}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={() => (
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>Setup Overview</Text>
                        <Text style={styles.infoText}>Code: {setup.productCode}</Text>
                        <Text style={styles.infoText}>Duration: {setup.productionDuration} Mins</Text>
                    </View>
                )}
                contentContainerStyle={{ padding: 15 }}
                renderItem={renderMaterial}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { height: 60, backgroundColor: colors.commoncolor, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginLeft: 15 },
    infoBox: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
    infoTitle: { fontSize: 16, fontWeight: '700', marginBottom: 5, color: colors.commoncolor },
    infoText: { fontSize: 14, color: '#666' },
    materialCard: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 12, elevation: 3 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    matLabel: { fontWeight: '700', color: '#444' },
    matValue: { color: colors.commoncolor, fontWeight: '700' },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
    grid: { flexDirection: 'row', justifyContent: 'space-around' },
    col: { alignItems: 'center' },
    subLabel: { fontSize: 11, color: '#999', textTransform: 'uppercase' },
    subValue: { fontSize: 14, fontWeight: '600', color: '#333' }
});

export default ProductionSetupDetails;
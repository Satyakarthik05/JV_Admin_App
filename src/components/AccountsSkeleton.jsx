import React from "react";
import { View, StyleSheet } from "react-native";

const AccountsSkeleton = () => {
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={styles.boxLarge} />
                <View style={styles.boxSmall} />
            </View>

            <View style={styles.row}>
                <View style={styles.boxMedium} />
                <View style={styles.boxLarge} />
            </View>

            <View style={styles.boxLong} />
        </View>
    );
};

export default AccountsSkeleton;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        padding: 13,
        marginBottom: 5,
        marginTop: 10,
        gap: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    boxLarge: {
        height: 14,
        width: 120,
        backgroundColor: "#e0e0e0",
        borderRadius: 5,
    },
    boxMedium: {
        height: 14,
        width: 100,
        backgroundColor: "#e0e0e0",
        borderRadius: 5,
    },
    boxSmall: {
        height: 14,
        width: 80,
        backgroundColor: "#e0e0e0",
        borderRadius: 5,
    },
    boxLong: {
        height: 14,
        width: 140,
        backgroundColor: "#e0e0e0",
        borderRadius: 5,
    },
});

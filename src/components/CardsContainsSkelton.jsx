import React from "react";
import { View, StyleSheet } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { colors } from "../config/theme";

const CardsContainsSkelton = () => {
    return (
        <SkeletonPlaceholder
            backgroundColor="#E1E9EE"
            highlightColor="#F2F8FC"
        >
            {[1, 2, 3, 4].map((_, index) => (
                <View key={index} style={styles.card}>

                    {/* Row 1 */}
                    <View style={styles.row}>
                        <View style={styles.smallLine} />
                        <View style={styles.mediumLine} />
                    </View>

                    {/* Row 2 */}
                    <View style={styles.row}>
                        <View style={styles.mediumLine} />
                        <View style={styles.smallLine} />
                    </View>

                    {/* Row 3 */}
                    <View style={styles.row}>
                        <View style={styles.fullLine} />
                    </View>

                </View>
            ))}
        </SkeletonPlaceholder>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    smallLine: {
        width: 80,
        height: 12,
        borderRadius: 6,
    },

    mediumLine: {
        width: 120,
        height: 14,
        borderRadius: 6,
    },

    fullLine: {
        width: "100%",
        height: 12,
        borderRadius: 6,
    },
});

export default CardsContainsSkelton;

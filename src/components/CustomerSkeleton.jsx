import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../config/theme";

const CustomerSkeleton = () => {
  return (
    <View style={styles.card}>
      
      {/* Top Row */}
      <View style={styles.rowBetween}>
        <View style={styles.titleSkeleton} />
        <View style={styles.statusSkeleton} />
      </View>

      {/* Owner */}
      <View style={styles.textSkeleton} />

      {/* City */}
      <View style={[styles.textSkeleton, { width: "60%" }]} />

      {/* Phone */}
      <View style={styles.row}>
        <View style={styles.smallCircle} />
        <View style={[styles.textSkeleton, { width: "40%", marginLeft: 6 }]} />
      </View>

      {/* Stats */}
      <View style={styles.row}>
        <View style={[styles.textSkeleton, { width: "45%" }]} />
        <View style={[styles.textSkeleton, { width: "45%", marginLeft: 10 }]} />
      </View>

      {/* Buttons */}
      <View style={styles.rowBetween}>
        <View style={styles.buttonSkeleton} />
        <View style={styles.buttonSkeletonOutline} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleSkeleton: {
    height: 14,
    width: "50%",
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },

  statusSkeleton: {
    height: 20,
    width: 70,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
  },

  textSkeleton: {
    height: 12,
    width: "80%",
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginTop: 8,
  },

  smallCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#E5E7EB",
  },

  buttonSkeleton: {
    height: 40,
    width: "48%",
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    marginTop: 12,
  },

  buttonSkeletonOutline: {
    height: 40,
    width: "48%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginTop: 12,
  },
});

export default CustomerSkeleton;

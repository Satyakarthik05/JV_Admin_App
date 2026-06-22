// components/SkeletonLoader.js
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export const TrendingSkeleton = () => (
  <View style={styles.trendingContainer}>
    {[1, 2, 3].map((i) => (
      <View key={i} style={styles.trendingCard}>
        <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.trendingImage} />
        <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.trendingLogo} />
        <View style={styles.trendingTextContainer}>
          <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.trendingTitle} />
          <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.trendingSubtitle} />
        </View>
      </View>
    ))}
  </View>
);

export const CouponGridSkeleton = () => (
  <View style={styles.grid}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <View key={i} style={styles.gridCard}>
        <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.gridImage} />
        <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.gridLogo} />
        <View style={styles.gridTextContainer}>
          <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.gridTitle} />
          <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.gridSubtitle} />
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  trendingContainer: { flexDirection: 'row', paddingLeft: 20 },
  trendingCard: { width: 140, marginRight: 16 },
  trendingImage: { width: '100%', height: 100, borderRadius: 12 },
  trendingLogo: { width: 40, height: 40, borderRadius: 6, position: 'absolute', top: 8, left: 8 },
  trendingTextContainer: { padding: 12 },
  trendingTitle: { width: '80%', height: 14, borderRadius: 4, marginBottom: 6 },
  trendingSubtitle: { width: '60%', height: 12, borderRadius: 4 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, justifyContent: 'space-between' },
  gridCard: { width: '48%', marginBottom: 16, borderRadius: 12, overflow: 'hidden' },
  gridImage: { width: '100%', height: 120, borderRadius: 12 },
  gridLogo: { width: 40, height: 40, borderRadius: 8, position: 'absolute', top: 8, left: 8 },
  gridTextContainer: { padding: 12 },
  gridTitle: { height: 14, borderRadius: 4, marginBottom: 6 },
  gridSubtitle: { height: 12, width: '70%', borderRadius: 4 },
});
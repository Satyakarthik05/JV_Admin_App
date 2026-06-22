// components/CategorySkeleton.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const CategorySkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.categorySection}>
          {/* Banner Skeleton */}
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={styles.banner}
          />
          <View style={styles.overlaySkeleton}>
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={styles.titleSkeleton}
            />
          </View>

          {/* Cards Row Skeleton */}
          <View style={styles.cardsRow}>
            {[1, 2, 3, 4].map((j) => (
              <View key={j} style={styles.card}>
                <ShimmerPlaceholder
                  LinearGradient={LinearGradient}
                  style={styles.cardImage}
                />
                <ShimmerPlaceholder
                  LinearGradient={LinearGradient}
                  style={styles.cardTitle}
                />
              </View>
            ))}
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  categorySection: { marginBottom: responsiveHeight(5) },
  banner: {
    width: '100%',
    height: responsiveHeight(10),
    borderRadius: 16,
  },
  overlaySkeleton: {
    position: 'absolute',
    top: responsiveHeight(2),
    left: responsiveWidth(4),
    right: responsiveWidth(4),
  },
  titleSkeleton: {
    height: 24,
    width: '50%',
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  cardsRow: {
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2),
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingTop: responsiveHeight(2),
  },
  card: {
    width: responsiveWidth(22),
    alignItems: 'center',
    marginRight: 16,
  },
  cardImage: {
    width: responsiveWidth(18),
    height: responsiveWidth(16),
    borderRadius: 15,
  },
  cardTitle: {
    height: 14,
    width: '80%',
    borderRadius: 6,
    marginTop: 6,
  },
});

export default CategorySkeleton;
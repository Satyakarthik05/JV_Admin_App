// import React, { useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Linking, Platform, } from 'react-native';
// import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation } from '@react-navigation/native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { responsiveWidth as rw, responsiveHeight as rh, responsiveFontSize as rf, } from 'react-native-responsive-dimensions';

// const RouteMapScreen = ({ route }) => {
//     const { customers = [], routeName = 'Route' } = route.params || {};
//     const navigation = useNavigation();
//     const insets = useSafeAreaInsets();
//     const mapRef = useRef(null);

//     // Keep only customers that have valid coordinates
//     const validCustomers = customers.filter(
//         c =>
//             typeof c.latitude === 'number' &&
//             typeof c.longitude === 'number' &&
//             !isNaN(c.latitude) &&
//             !isNaN(c.longitude),
//     );

//     // After map loads, zoom to fit all pins
//     const onMapReady = () => {
//         if (mapRef.current && validCustomers.length > 0) {
//             const coords = validCustomers.map(c => ({
//                 latitude: c.latitude,
//                 longitude: c.longitude,
//             }));

//             if (coords.length === 1) {
//                 // Only one pin → center it
//                 mapRef.current.animateToRegion(
//                     {
//                         ...coords[0],
//                         latitudeDelta: 0.01,
//                         longitudeDelta: 0.01,
//                     },
//                     500,
//                 );
//             } else {
//                 mapRef.current.fitToCoordinates(coords, {
//                     edgePadding: { top: 100, right: 60, bottom: 220, left: 60 },
//                     animated: true,
//                 });
//             }
//         }
//     };

//     // Open this customer in Google Maps for turn-by-turn
//     const openInGoogleMaps = c => {
//         const url = Platform.select({
//             ios: `comgooglemaps://?daddr=${c.latitude},${c.longitude}&directionsmode=driving`,
//             android: `google.navigation:q=${c.latitude},${c.longitude}`,
//         });
//         const fallback = `https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}`;
//         Linking.canOpenURL(url)
//             .then(ok => Linking.openURL(ok ? url : fallback))
//             .catch(() => Linking.openURL(fallback));
//     };

//     // Empty state
//     if (validCustomers.length === 0) {
//         return (
//             <View style={[styles.container, { paddingTop: insets.top }]}>
//                 <StatusBar barStyle="dark-content" backgroundColor="#fff" />
//                 <View style={styles.header}>
//                     <TouchableOpacity onPress={() => navigation.goBack()}>
//                         <Ionicons name="arrow-back" size={22} color="#000" />
//                     </TouchableOpacity>
//                     <Text style={styles.headerTitle}>{routeName}</Text>
//                 </View>
//                 <View style={styles.emptyBox}>
//                     <Icon name="location-off" size={48} color="#ccc" />
//                     <Text style={styles.emptyText}>No customer locations to show</Text>
//                 </View>
//             </View>
//         );
//     }

//     const initialRegion = {
//         latitude: validCustomers[0].latitude,
//         longitude: validCustomers[0].longitude,
//         latitudeDelta: 0.05,
//         longitudeDelta: 0.05,
//     };

//     return (
//         <View style={[styles.container, { paddingTop: insets.top }]}>
//             <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//             {/* HEADER */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Ionicons name="arrow-back" size={22} color="#000" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle} numberOfLines={1}>
//                     {routeName}
//                 </Text>
//             </View>

//             {/* MAP  for API */}
//             {/* <MapView
//         ref={mapRef}
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         initialRegion={initialRegion}
//         onMapReady={onMapReady}
//         showsUserLocation
//         showsMyLocationButton>
//         {validCustomers.map((c, idx) => (
//           <Marker
//             key={c.customerId ?? idx}
//             coordinate={{latitude: c.latitude, longitude: c.longitude}}
//             title={`${idx + 1}. ${(c.shopName || '').trim()}`}
//             description={`${c.ownerName || ''}${c.mobile ? ' • ' + c.mobile : ''}`}
//             pinColor={
//               idx === 0
//                 ? 'green'
//                 : idx === validCustomers.length - 1
//                 ? 'red'
//                 : '#E53935'
//             }
//             onCalloutPress={() => openInGoogleMaps(c)}
//           />
//         ))}
//       </MapView> */}

//             {/* Map no api key */}
//             <MapView
//                 ref={mapRef}
//                 style={styles.map}
//                 initialRegion={initialRegion}
//                 onMapReady={onMapReady}
//             >
//                 <UrlTile
//                     urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     maximumZ={19}
//                 />

//                 {validCustomers.map((c, idx) => (
//                     <Marker
//                         key={c.customerId ?? idx}
//                         coordinate={{ latitude: c.latitude, longitude: c.longitude }}
//                         title={`${idx + 1}. ${(c.shopName || '').trim()}`}
//                         description={`${c.ownerName || ''}${c.mobile ? ' • ' + c.mobile : ''}`}
//                     />
//                 ))}
//             </MapView>


//             {/* BOTTOM INFO BAR */}
//             <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 12 }]}>
//                 <View style={styles.infoRow}>
//                     <View style={styles.infoItem}>
//                         <Icon name="people" size={18} color="#E53935" />
//                         <Text style={styles.infoValue}>{validCustomers.length}</Text>
//                         <Text style={styles.infoLabel}>Customers</Text>
//                     </View>
//                     <View style={styles.infoDivider} />
//                     <View style={styles.infoItem}>
//                         <Icon name="place" size={18} color="#22C55E" />
//                         <Text style={styles.infoValue}>Start</Text>
//                         <Text style={styles.infoLabel} numberOfLines={1}>
//                             {(validCustomers[0].shopName || '').trim()}
//                         </Text>
//                     </View>
//                     <View style={styles.infoDivider} />
//                     <View style={styles.infoItem}>
//                         <Icon name="flag" size={18} color="#E53935" />
//                         <Text style={styles.infoValue}>End</Text>
//                         <Text style={styles.infoLabel} numberOfLines={1}>
//                             {(
//                                 validCustomers[validCustomers.length - 1].shopName || ''
//                             ).trim()}
//                         </Text>
//                     </View>
//                 </View>

//                 <Text style={styles.helpText}>
//                     Tap a pin to see shop details. Tap the popup to open Google Maps for
//                     directions.
//                 </Text>
//             </View>
//         </View>
//     );
// };

// export default RouteMapScreen;

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#F6F7FB' },

//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 12,
//         paddingHorizontal: rw(4),
//         paddingVertical: rh(1.8),
//         backgroundColor: '#FFFFFF',
//         borderBottomWidth: 1,
//         borderBottomColor: '#EEF0F4',
//         elevation: 2,
//         zIndex: 10,
//     },
//     headerTitle: {
//         fontSize: rf(2.1),
//         fontWeight: '700',
//         color: '#111827',
//         flex: 1,
//     },

//     map: { flex: 1 },

//     bottomCard: {
//         position: 'absolute',
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 22,
//         borderTopRightRadius: 22,
//         paddingHorizontal: rw(4),
//         paddingTop: rh(2),
//         elevation: 10,
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowRadius: 10,
//         shadowOffset: { width: 0, height: -3 },
//     },
//     infoRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: rh(1.2),
//     },
//     infoItem: { flex: 1, alignItems: 'center', paddingHorizontal: 6 },
//     infoDivider: { width: 1, height: rh(4), backgroundColor: '#EEF0F4' },
//     infoValue: {
//         fontSize: rf(1.7),
//         fontWeight: '700',
//         color: '#111827',
//         marginTop: 4,
//     },
//     infoLabel: {
//         fontSize: rf(1.3),
//         color: '#6B7280',
//         marginTop: 2,
//         textAlign: 'center',
//     },
//     helpText: {
//         textAlign: 'center',
//         fontSize: rf(1.35),
//         color: '#9CA3AF',
//         marginTop: 4,
//     },

//     emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//     emptyText: {
//         marginTop: 12,
//         color: '#9CA3AF',
//         fontSize: rf(1.8),
//         fontWeight: '600',
//     },
// });






// RouteMapScreen.js
// =============================================================================
// 🗺️  ROUTE MAP SCREEN
// =============================================================================
// CURRENT MODE  : OpenStreetMap (FREE, no API key needed) ✅ Working now
// FUTURE MODE   : Google Maps (after client provides API key)
//
// 👉 NAVIGATION TO THIS SCREEN (from previous screen):
// ---------------------------------------------------------------------------
//   navigation.navigate('RouteMapScreen', {
//       routeName: 'Morampudi Route',
//       customers: [
//           {
//               customerId: 1,
//               shopName: 'Amrica Industries',
//               ownerName: 'Ravi Kumar',
//               mobile: '9876543210',
//               latitude: 16.9891,
//               longitude: 82.2475,
//           },
//           {
//               customerId: 2,
//               shopName: 'Sri Venkata Padmaja Ceramics',
//               ownerName: 'Suresh',
//               mobile: '9123456780',
//               latitude: 16.9875,
//               longitude: 82.2490,
//           },
//           // ... more customers
//       ],
//   });
// =============================================================================

import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Linking,
    Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    responsiveWidth as rw,
    responsiveHeight as rh,
    responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

// =============================================================================
// 🔑 GOOGLE MAPS API KEY — WHERE TO ADD WHEN CLIENT PROVIDES IT
// =============================================================================
// The API key does NOT go in this JS file. It goes in NATIVE config files:
//
// 📍 ANDROID → android/app/src/main/AndroidManifest.xml
//    Inside <application> tag:
//    <meta-data
//        android:name="com.google.android.geo.API_KEY"
//        android:value="YOUR_API_KEY_HERE"/>
//
// 📍 iOS → ios/<YourAppName>/AppDelegate.mm  (or AppDelegate.m)
//    At the top:
//        #import <GoogleMaps/GoogleMaps.h>
//    Inside didFinishLaunchingWithOptions:
//        [GMSServices provideAPIKey:@"YOUR_API_KEY_HERE"];
//
// THEN in this file (below in the JSX):
//    1. COMMENT OUT the OpenStreetMap <MapView> block
//    2. UNCOMMENT the Google Maps <MapView> block
//    Both blocks are clearly marked.
// =============================================================================

const RouteMapScreen = ({ route }) => {
    const { customers = [], routeName = 'Route' } = route.params || {};
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const mapRef = useRef(null);

    // Keep only customers with valid coordinates
    const validCustomers = customers.filter(
        c =>
            typeof c.latitude === 'number' &&
            typeof c.longitude === 'number' &&
            !isNaN(c.latitude) &&
            !isNaN(c.longitude),
    );

    // After map loads, zoom to fit all pins
    const onMapReady = () => {
        if (mapRef.current && validCustomers.length > 0) {
            const coords = validCustomers.map(c => ({
                latitude: c.latitude,
                longitude: c.longitude,
            }));

            if (coords.length === 1) {
                mapRef.current.animateToRegion(
                    {
                        ...coords[0],
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    },
                    500,
                );
            } else {
                mapRef.current.fitToCoordinates(coords, {
                    edgePadding: { top: 100, right: 60, bottom: 220, left: 60 },
                    animated: true,
                });
            }
        }
    };

    // Open this customer in Google Maps app for turn-by-turn directions
    const openInGoogleMaps = c => {
        const url = Platform.select({
            ios: `comgooglemaps://?daddr=${c.latitude},${c.longitude}&directionsmode=driving`,
            android: `google.navigation:q=${c.latitude},${c.longitude}`,
        });
        const fallback = `https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}`;
        Linking.canOpenURL(url)
            .then(ok => Linking.openURL(ok ? url : fallback))
            .catch(() => Linking.openURL(fallback));
    };

    // -------------------------------------------------------------------------
    // EMPTY STATE — when no valid customer coordinates
    // -------------------------------------------------------------------------
    if (validCustomers.length === 0) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={22} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{routeName}</Text>
                </View>
                <View style={styles.emptyBox}>
                    <Icon name="location-off" size={48} color="#ccc" />
                    <Text style={styles.emptyText}>
                        No customer locations to show
                    </Text>
                </View>
            </View>
        );
    }

    const initialRegion = {
        latitude: validCustomers[0].latitude,
        longitude: validCustomers[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {routeName}
                </Text>
            </View>

            {/* ============================================================== */}
            {/* 🟢 CURRENT — OPENSTREETMAP (NO API KEY NEEDED)                 */}
            {/* ============================================================== */}
            {/* ⚠️  When Google Maps API key is ready:                          */}
            {/*    → COMMENT OUT this entire <MapView> block                    */}
            {/*    → UNCOMMENT the Google Maps block below                      */}
            {/* ============================================================== */}
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={initialRegion}
                onMapReady={onMapReady}
            >
                <UrlTile
                    urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maximumZ={19}
                />

                {validCustomers.map((c, idx) => (
                    <Marker
                        key={c.customerId ?? idx}
                        coordinate={{
                            latitude: c.latitude,
                            longitude: c.longitude,
                        }}
                        title={`${idx + 1}. ${(c.shopName || '').trim()}`}
                        description={`${c.ownerName || ''}${
                            c.mobile ? ' • ' + c.mobile : ''
                        }`}
                        pinColor={
                            idx === 0
                                ? 'green'
                                : idx === validCustomers.length - 1
                                ? 'red'
                                : '#E53935'
                        }
                        onCalloutPress={() => openInGoogleMaps(c)}
                    />
                ))}
            </MapView>

            {/* ============================================================== */}
            {/* 🔵 FUTURE — GOOGLE MAPS (USE AFTER API KEY ADDED IN NATIVE)    */}
            {/* ============================================================== */}
            {/* ✅ Steps when client gives API key:                             */}
            {/*    1. Add key in AndroidManifest.xml & AppDelegate.mm           */}
            {/*       (instructions at top of this file)                        */}
            {/*    2. Comment out the OpenStreetMap <MapView> above             */}
            {/*    3. Uncomment this <MapView> block below                      */}
            {/* ============================================================== */}
            {/*
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}   // ⬅️ uses native API key
                style={styles.map}
                initialRegion={initialRegion}
                onMapReady={onMapReady}
                showsUserLocation
                showsMyLocationButton
            >
                {validCustomers.map((c, idx) => (
                    <Marker
                        key={c.customerId ?? idx}
                        coordinate={{
                            latitude: c.latitude,
                            longitude: c.longitude,
                        }}
                        title={`${idx + 1}. ${(c.shopName || '').trim()}`}
                        description={`${c.ownerName || ''}${
                            c.mobile ? ' • ' + c.mobile : ''
                        }`}
                        pinColor={
                            idx === 0
                                ? 'green'
                                : idx === validCustomers.length - 1
                                ? 'red'
                                : '#E53935'
                        }
                        onCalloutPress={() => openInGoogleMaps(c)}
                    />
                ))}
            </MapView>
            */}

            {/* BOTTOM INFO CARD */}
            <View
                style={[
                    styles.bottomCard,
                    { paddingBottom: insets.bottom + 12 },
                ]}
            >
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Icon name="people" size={18} color="#E53935" />
                        <Text style={styles.infoValue}>
                            {validCustomers.length}
                        </Text>
                        <Text style={styles.infoLabel}>Customers</Text>
                    </View>

                    <View style={styles.infoDivider} />

                    <View style={styles.infoItem}>
                        <Icon name="place" size={18} color="#22C55E" />
                        <Text style={styles.infoValue}>Start</Text>
                        <Text style={styles.infoLabel} numberOfLines={1}>
                            {(validCustomers[0].shopName || '').trim()}
                        </Text>
                    </View>

                    <View style={styles.infoDivider} />

                    <View style={styles.infoItem}>
                        <Icon name="flag" size={18} color="#E53935" />
                        <Text style={styles.infoValue}>End</Text>
                        <Text style={styles.infoLabel} numberOfLines={1}>
                            {(
                                validCustomers[validCustomers.length - 1]
                                    .shopName || ''
                            ).trim()}
                        </Text>
                    </View>
                </View>

                <Text style={styles.helpText}>
                    Tap a pin to see shop details. Tap the popup to open Google
                    Maps for directions.
                </Text>
            </View>
        </View>
    );
};

export default RouteMapScreen;

// =============================================================================
// STYLES
// =============================================================================
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F7FB' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: rw(4),
        paddingVertical: rh(1.8),
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEF0F4',
        elevation: 2,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: rf(2.1),
        fontWeight: '700',
        color: '#111827',
        flex: 1,
    },

    map: { flex: 1 },

    bottomCard: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        paddingHorizontal: rw(4),
        paddingTop: rh(2),
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -3 },
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: rh(1.2),
    },
    infoItem: { flex: 1, alignItems: 'center', paddingHorizontal: 6 },
    infoDivider: { width: 1, height: rh(4), backgroundColor: '#EEF0F4' },
    infoValue: {
        fontSize: rf(1.7),
        fontWeight: '700',
        color: '#111827',
        marginTop: 4,
    },
    infoLabel: {
        fontSize: rf(1.3),
        color: '#6B7280',
        marginTop: 2,
        textAlign: 'center',
    },
    helpText: {
        textAlign: 'center',
        fontSize: rf(1.35),
        color: '#9CA3AF',
        marginTop: 4,
    },

    emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: {
        marginTop: 12,
        color: '#9CA3AF',
        fontSize: rf(1.8),
        fontWeight: '600',
    },
});


// import React from "react";
// import { View, StyleSheet } from "react-native";
// import SkeletonPlaceholder from "react-native-skeleton-placeholder";
// import { colors } from "../config/theme"; // adjust path if needed

// const TelecallerSkeleton = () => {
//     return (
//         <View style={{ paddingHorizontal: 12, marginTop: 10 }}>

//             {[1, 2, 3, 4, 5].map((_, index) => (

//                 <View key={index} style={styles.card}>
//                     <View style={{ backgroundColor: "#fff", borderRadius: 10, overflow: "hidden" }}>
//                         <SkeletonPlaceholder
//                             backgroundColor="#E5E7EB"
//                             highlightColor="#F9FAFB"
//                             speed={1200}
//                         >
//                             <SkeletonPlaceholder.Item>

//                                 {/* Top Row */}
//                                 <SkeletonPlaceholder.Item
//                                     flexDirection="row"
//                                     justifyContent="space-between"
//                                     alignItems="center"
//                                 >
//                                     <SkeletonPlaceholder.Item
//                                         width="50%"
//                                         height={14}
//                                         borderRadius={6}
//                                     />
//                                     <SkeletonPlaceholder.Item
//                                         width={60}
//                                         height={20}
//                                         borderRadius={6}
//                                     />
//                                 </SkeletonPlaceholder.Item>

//                                 {/* Phone */}
//                                 <SkeletonPlaceholder.Item
//                                     marginTop={8}
//                                     width="40%"
//                                     height={12}
//                                     borderRadius={6}
//                                 />

//                                 {/* Address */}
//                                 <SkeletonPlaceholder.Item
//                                     marginTop={8}
//                                     width="80%"
//                                     height={12}
//                                     borderRadius={6}
//                                 />

//                                 {/* Buttons */}
//                                 <SkeletonPlaceholder.Item
//                                     marginTop={12}
//                                     flexDirection="row"
//                                     justifyContent="space-between"
//                                     alignItems="center"
//                                 >
//                                     <SkeletonPlaceholder.Item
//                                         width="30%"
//                                         height={30}
//                                         borderRadius={8}
//                                     />
//                                     <SkeletonPlaceholder.Item
//                                         width="30%"
//                                         height={30}
//                                         borderRadius={8}
//                                     />

//                                     <SkeletonPlaceholder.Item
//                                         width={30}
//                                         height={30}
//                                         borderRadius={6}
//                                     />
//                                     <SkeletonPlaceholder.Item
//                                         width={30}
//                                         height={30}
//                                         borderRadius={6}
//                                     />
//                                 </SkeletonPlaceholder.Item>

//                             </SkeletonPlaceholder.Item>
//                         </SkeletonPlaceholder>
//                     </View>

//                 </View>
//             ))}

//         </View>
//     );
// };

// export default TelecallerSkeleton;

// const styles = StyleSheet.create({
//     card: {
//         backgroundColor: colors.white,   // ✅ WHITE CARD BACK
//         padding: 10,
//         borderRadius: 10,
//         marginTop: 10,
//         marginBottom: 5,

//         // ✅ SHADOW (same as your real card)
//         shadowColor: colors.black,
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 8,
//     },
// });


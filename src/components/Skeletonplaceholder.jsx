import React from "react";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const ProductSkeleton = () => {
    return (
        <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 10 }}>
            
            <SkeletonPlaceholder
                backgroundColor="#E5E7EB"
                highlightColor="#F9FAFB"
                speed={1200}
            >
                
                <SkeletonPlaceholder.Item>

                    {[1, 2, 3, 4, 5].map((_, index) => (
                        <SkeletonPlaceholder.Item
                            key={index}
                            marginTop={12}
                            height={100}        // same as your card height
                            borderRadius={12}
                        />
                    ))}

                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>

        </View>
    );
};

export default ProductSkeleton;


import React from "react";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const CategorySkeleton = () => {
    return (
        <View style={{ marginTop: 10, paddingHorizontal: 12 }}>

            <SkeletonPlaceholder
                backgroundColor="#E5E7EB"
                highlightColor="#F9FAFB"
                speed={1200}
            >

                {/* HEADER ROW */}
                <SkeletonPlaceholder.Item flexDirection="row">
                    <SkeletonPlaceholder.Item flex={1} height={40} />
                    <SkeletonPlaceholder.Item flex={1} height={40} />
                    <SkeletonPlaceholder.Item flex={1} height={40} />
                </SkeletonPlaceholder.Item>

                {/* TABLE ROWS */}
                {[1, 2, 3, 4, 5].map((_, index) => (
                    <SkeletonPlaceholder.Item
                        key={index}
                        flexDirection="row"
                        marginTop={2}
                    >
                        {/* S.NO */}
                        <SkeletonPlaceholder.Item flex={1} height={40} />

                        {/* CATEGORY */}
                        <SkeletonPlaceholder.Item flex={1} height={40} />

                        {/* ACTIONS */}
                        <SkeletonPlaceholder.Item
                            flex={1}
                            height={40}
                            flexDirection="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <SkeletonPlaceholder.Item
                                width={20}
                                height={20}
                                borderRadius={4}
                                marginRight={10}
                            />
                            <SkeletonPlaceholder.Item
                                width={20}
                                height={20}
                                borderRadius={4}
                            />
                        </SkeletonPlaceholder.Item>

                    </SkeletonPlaceholder.Item>
                ))}

            </SkeletonPlaceholder>

        </View>
    );
};

export default CategorySkeleton;

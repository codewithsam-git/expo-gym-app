import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SkeletonMember = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const [numberOfItems, setNumberOfItems] = useState(0);
    const windowHeight = Dimensions.get('window').height;
    const cardHeight = 100 + 10;

    useEffect(() => {
        const calculatedItems = Math.ceil(windowHeight / cardHeight);
        setNumberOfItems(calculatedItems + 1);

        const shimmerLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        );
        shimmerLoop.start();
        return () => shimmerLoop.stop();
    }, []);

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-150, 150],
    });

    return (
        <View style={styles.container}>
            {Array(numberOfItems)
                .fill(0)
                .map((_, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.skeletonBox}>
                            <Animated.View
                                style={[
                                    styles.shimmerEffect,
                                    { transform: [{ translateX: shimmerTranslate }] },
                                ]}
                            />
                        </View>
                        <View style={styles.skeletonContent}>
                            <View style={styles.skeletonText}>
                                <Animated.View
                                    style={[
                                        styles.shimmerEffect,
                                        { transform: [{ translateX: shimmerTranslate }] },
                                    ]}
                                />
                            </View>
                            <View style={[styles.skeletonText, { width: '60%' }]}>
                                <Animated.View
                                    style={[
                                        styles.shimmerEffect,
                                        { transform: [{ translateX: shimmerTranslate }] },
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 100,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    skeletonBox: {
        width: 60,
        height: 60,
        borderRadius: 10,
        overflow: 'hidden',
    },
    skeletonContent: {
        flex: 1,
        marginLeft: 15,
    },
    skeletonText: {
        height: 15,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
        overflow: 'hidden',
    },
    shimmerEffect: {
        position: 'absolute',
        width: 150,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        opacity: 0.5,
        borderRadius: 5,
    },
});

export default SkeletonMember;

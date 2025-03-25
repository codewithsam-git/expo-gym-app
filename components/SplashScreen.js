import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation
import {COLORS, images} from "../constants";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 2500);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={images.gymLogo}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 60
  },
});

export default SplashScreen;

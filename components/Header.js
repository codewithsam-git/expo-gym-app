import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, icons } from '../constants'; // Make sure these constants are properly defined.
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

function Header({ headerTitle }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Image source={icons.menu_icon} style={styles.menuIcon} />
      </TouchableOpacity>

      <View style={styles.centerSection}>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>

      {/* Right section removed to have nothing on the right */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.font,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  menuIcon: {
    width: 30,
    height: 30,
    tintColor: COLORS.white,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...FONTS.h2,
    marginRight: SIZES.padding,
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Header;
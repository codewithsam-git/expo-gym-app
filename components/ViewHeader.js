import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SIZES, FONTS, icons } from '../constants';
import { useNavigation } from '@react-navigation/native';

const ViewHeader = ({ headerTitle, navigateTo }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {/* Left Section: Menu Icon */}
        <TouchableOpacity
          style={styles.leftSection}
          onPress={() => navigation.openDrawer()}>
          <Image source={icons.menu_icon} style={styles.menuIcon} />
        </TouchableOpacity>

        {/* Center Section: Title */}
        <View style={styles.centerSection}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>

        {/* Right Section: New Button */}
        <TouchableOpacity
          style={styles.rightSection}
          onPress={() => navigation.navigate(navigateTo)}>
          <Icon name="add" size={28} color={COLORS.white} />
          <Text style={styles.newText}>New</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black,
    paddingVertical: SIZES.padding * 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
  },
  leftSection: {
    flex: 1, // Ensures equal space allocation
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2, // Larger space for title
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1, // Ensures equal space allocation
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  menuIcon: {
    width: 30,
    height: 30,
    tintColor: COLORS.white,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  newText: {
    ...FONTS.body3,
    color: COLORS.white,
    marginLeft: 5,
    fontWeight: '600',
  },
});

export default ViewHeader;

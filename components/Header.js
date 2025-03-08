import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import Icon from 'react-native-vector-icons/FontAwesome';

function Header() {

  const navigation = useNavigation();
  
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: SIZES.padding,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image source={icons.menu_icon} style={styles.menuIcon} />
        </TouchableOpacity>

        <View style={{ marginLeft: SIZES.padding }}>
          <View style={{ marginRight: SIZES.padding }}>
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>Hello,</Text>
            <Text style={{ ...FONTS.h2, color: COLORS.white }}>Admin</Text>
          </View>
        </View>
      </View>

      <View style={styles.iconContainer}>
        <Icon name="user" size={40} color={COLORS.white} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20,
    alignItems: 'center',
    height: 60,
  },
  menuIcon: {
    width: 30,
    height: 30,
    tintColor: COLORS.white,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Header;

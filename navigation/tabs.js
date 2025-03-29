import React from 'react';
import { Image, Text, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Notification from '../screens/Notification';
import Search from '../screens/Search';
import Offers from '../screens/Offers';

import { icons, COLORS, SIZES } from '../constants';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 75, // More height for label visibility
          backgroundColor: COLORS.black,
          paddingBottom: Platform.OS === 'ios' ? 25 : 15, // Prevents cutting off
          paddingTop: Platform.OS === 'ios' ? SIZES.padding : SIZES.radius,
        },
        tabBarIcon: ({ focused }) => {
          const tintColor = focused ? COLORS.white : COLORS.lightGray4;
          let iconName, label;

          switch (route.name) {
            case 'Home':
              iconName = icons.home_icon;
              label = 'Home';
              break;
            case 'Search':
              iconName = icons.revenue_icon;
              label = 'Revenue';
              break;
            case 'Notification':
              iconName = icons.notification_icon;
              label = 'Notification';
              break;
            case 'Offers':
              iconName = icons.dashboard_icon;
              label = 'Offers';
              break;
          }

          return (
            <View style={styles.tabContainer}>
              <Image
                source={iconName}
                resizeMode="contain"
                style={[styles.icon, { tintColor }]}
              />
              <Text style={[styles.label, { color: tintColor }]}>{label}</Text>
            </View>
          );
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Notification" component={Notification} />
      <Tab.Screen name="Offers" component={Offers} />
    </Tab.Navigator>
  );
};

const styles = {
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  icon: {
    width: SIZES.padding,
    height: SIZES.padding,
    marginBottom: 5,
  },
  label: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
};

export default Tabs;

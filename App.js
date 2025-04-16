import React, { useEffect } from 'react';

import { enableScreens } from 'react-native-screens';
enableScreens();

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BookDetail from './screens/BookDetail';
import Tabs from './navigation/tabs';
import ViewMembers from './screens/ViewMembers';
import AddMember from './screens/AddMember';
import Login from './screens/Login';
import AddPackage from './screens/AddPackage';
import ViewPackages from './screens/ViewPackages';
import AddAsset from './screens/AddAsset';
import ViewAsset from './screens/ViewAssets';
import AddStaff from './screens/AddStaff';
import ViewStaff from './screens/ViewStaff';
import AddInventory from './screens/AddInventory';
import ViewInventory from './screens/ViewInventory';
import Profile from './components/Profile';
import MemberBill from './components/MemberBill';
import UpdatePlan from './components/UpdatePlan';
import PackageReports from './screens/PackageReports';
import Splash from './components/SplashScreen';
import EditMember from './screens/EditMember';
import EditPackage from './screens/EditPackage';
import EditStaff from './screens/EditStaff';
import EditAsset from './screens/EditAsset';
import EditInventory from './screens/EditInventory';
import Settings from './screens/Settings';
import History from './screens/History';

import {
  StatusBar,
  useColorScheme,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  AppState,
} from 'react-native';
import { COLORS } from './constants';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IMAGES_URL from './Api/ImagesUrl';

const CustomDrawerContent = (props) => {
  const { navigation } = props;

  return (
    <SafeAreaView style={styles.drawerContainer}>
      {/* Profile Header */}
      <View style={styles.profileContainer}>
        <TouchableOpacity
          style={styles.profileTouch}>
          <Image
            source={{ uri: `${IMAGES_URL}/logo/gym-logo.png` }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>One Hour Fitness Club</Text>
          <Text style={styles.profileEmail}>Everything You Need to Lead</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable drawer items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollViewContent}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Logout button */}
      <TouchableOpacity
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'login' }],
          });
        }}
        style={styles.logoutButton}>
        <Ionicons
          name="log-out-outline"
          size={24}
          color="white"
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#0A0D0F',
  },
  profileContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white,
    backgroundColor: COLORS.lightGray + '20',
    paddingBottom: 0,
  },
  profileTouch: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.white,
    marginBottom: 12,
  },
  profileName: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: COLORS.lightGray4,
    fontSize: 14,
    opacity: 0.8,
  },
  scrollViewContent: {
    paddingTop: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#b23b3b',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  logoutIcon: {
    marginRight: 12,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  drawerIcon: {},
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: 'transparent',
  },
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 300,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          marginLeft: 0,
        },
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.white,
        drawerActiveBackgroundColor: 'transparent',
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Home"
        component={Tabs}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="home"
              size={24}
              color={color}
              style={styles.drawerIcon}
            />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Add Member"
        component={AddMember}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="person-add"
              size={24}
              color={color}
              style={styles.drawerIcon}
            />
          ),
        }}
      />*/}
      <Drawer.Screen
        name="Members"
        component={ViewMembers}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="people"
              size={24}
              color={color}
              style={styles.drawerIcon}
            />
          ),
        }}
      />
      {/*<Drawer.Screen
        name="Add Package"
        component={AddPackage}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="archive"
              size={24}
              color={color}
              style={styles.drawerIcon}
            />
          ),
        }}
      />*/}
      <Drawer.Screen
        name="Packages"
        component={ViewPackages}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="folder"
              size={24}
              color={color}
              style={styles.drawerIcon}
            />
          ),
        }}
      />
      {/*<Drawer.Screen
        name="Add Asset"
        component={AddAsset}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="add-circle"
              size={24}
              color={color}
              style={styles.drawerIcon}
            />
          ),
        }}
      />*/}
      <Drawer.Screen
        name="Assets"
        component={ViewAsset}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="eye"
              size={24}
              color={color}
              style={styles.drawerIcon}
            />
          ),
        }}
      />
      {/*<Drawer.Screen
        name="Add Staff"
        component={AddStaff}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={color}
              style={styles.drawerIcon}
            />
          ),
        }}
      />*/}
      <Drawer.Screen
        name="Staff"
        component={ViewStaff}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="people-outline"
              size={24}
              color={color}
              style={styles.drawerIcon}
            />
          ),
        }}
      />
      {/*<Drawer.Screen
        name="Add Inventory"
        component={AddInventory}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="bag-add-outline"
              size={24}
              color={color}
              style={styles.drawerIcon}
            />
          ),
        }}
      />*/}
      <Drawer.Screen
        name="Inventory"
        component={ViewInventory}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="grid-outline"
              size={24}
              color={color}
              style={styles.drawerIcon}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Package Reports"
        component={PackageReports}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="document-text-outline"
              size={24}
              color={color}
              style={styles.drawerIcon}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const App = () => {

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        StatusBar.setBackgroundColor(COLORS.black);
        StatusBar.setBarStyle('light-content');
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => subscription.remove();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
      <NavigationContainer theme={theme}>
        <SafeAreaView style={styles.appContainer}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName={"Splash"}>
            <Stack.Screen
              name="Splash"
              component={Splash}
              options={{
                headerShown: false,
                cardStyleInterpolator: ({ current, next, layouts }) => {
                  const opacity = current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  });
                  return {
                    cardStyle: {
                      opacity,
                    },
                  };
                },
              }}
            />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={DrawerNavigator} />
            <Stack.Screen name="addMember" component={AddMember} />
            <Stack.Screen name="viewMember" component={ViewMembers} />
            <Stack.Screen name="addPackage" component={AddPackage} />
            <Stack.Screen name="viewPackage" component={ViewPackages} />
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="profile" component={Profile} />
            <Stack.Screen name="memberBill" component={MemberBill} />
            <Stack.Screen name="updatePlan" component={UpdatePlan} />
            <Stack.Screen name="packageReports" component={PackageReports} />
            <Stack.Screen name="addAsset" component={AddAsset} />
            <Stack.Screen name="viewAsset" component={ViewAsset} />
            <Stack.Screen name="addStaff" component={AddStaff} />
            <Stack.Screen name="viewStaff" component={ViewStaff} />
            <Stack.Screen name="addInventory" component={AddInventory} />
            <Stack.Screen name="viewInventory" component={ViewInventory} />
            <Stack.Screen name="editMember" component={EditMember} />
            <Stack.Screen name="editPackage" component={EditPackage} />
            <Stack.Screen name="editStaff" component={EditStaff} />
            <Stack.Screen name="editAsset" component={EditAsset} />
            <Stack.Screen name="editInventory" component={EditInventory} />
            <Stack.Screen name="settings" component={Settings} />
            <Stack.Screen name="history" component={History} />
            <Stack.Screen
              name="BookDetail"
              component={BookDetail}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </View>
  );
};

export default App;
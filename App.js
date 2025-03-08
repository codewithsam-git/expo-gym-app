import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BookDetail from './screens/BookDetail';
import Tabs from './navigation/tabs';
import ViewMembers from './screens/ViewMembers';
import AddMember from './screens/AddMember';
import Login from './screens/Login';
import AddPackage from './screens/AddPackage';
import ViewPackages from './screens/ViewPackages';
import Profile from './components/Profile';
import MemberBill from './components/MemberBill';
import UpdatePlan from './components/UpdatePlan';
import {
  StatusBar,
  useColorScheme,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform
} from 'react-native';
import { COLORS } from './constants';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomDrawerContent = (props) => {
  const { navigation } = props;

  return (
    <SafeAreaView style={styles.drawerContainer}>
      {/* Profile Header */}
      <View style={styles.profileContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('profile')}
          style={styles.profileTouch}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@example.com</Text>
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
    marginTop: Platform.OS === 'ios' ? 0 : 50,
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
    color: COLORS.white,
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
    marginBottom: 20, // Standardized marginBottom for both platforms
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
  drawerIcon: {
  },
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: 'transparent',
  },
};

const Stack = createStackNavigator();
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
      <Drawer.Screen
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
      />
      <Drawer.Screen
        name="View Members"
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
      <Drawer.Screen
        name="Add Packages"
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
      />
      <Drawer.Screen
        name="View Packages"
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
    </Drawer.Navigator>
  );
};

const App = () => {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={theme}>
      <SafeAreaView style={styles.appContainer}>
        <StatusBar
          backgroundColor={COLORS.black}
          barStyle="light-content" // Fixed to light-content for consistency
        />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'Home'}>
          <Stack.Screen name="Home" component={DrawerNavigator} />
          <Stack.Screen name="addMember" component={AddMember} />
          <Stack.Screen name="viewMember" component={ViewMembers} />
          <Stack.Screen name="addPackage" component={AddPackage} />
          <Stack.Screen name="viewPackage" component={ViewPackages} />
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="profile" component={Profile} />
          <Stack.Screen name="memberBill" component={MemberBill} />
          <Stack.Screen name="updatePlan" component={UpdatePlan} />
          <Stack.Screen
            name="BookDetail"
            component={BookDetail}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
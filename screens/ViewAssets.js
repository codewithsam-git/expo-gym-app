import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
  Modal,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import BASE_URL from '../Api/commonApi';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import SkeletonMember from '../components/SkeletonMember';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ViewAssets = () => {
  // const members = [
  //   {
  //     id: 1,
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     email: 'john.doe@email.com',
  //     mobileNo: '123-456-7890',
  //   },
  //   {
  //     id: 2,
  //     firstName: 'Jane',
  //     lastName: 'Smith',
  //     email: 'jane.smith@email.com',
  //     mobileNo: '987-654-3210',
  //   },
  //   {
  //     id: 3,
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     email: 'john.doe@email.com',
  //     mobileNo: '123-456-7890',
  //   },
  //   {
  //     id: 4,
  //     firstName: 'Jane',
  //     lastName: 'Smith',
  //     email: 'jane.smith@email.com',
  //     mobileNo: '987-654-3210',
  //   },
  //   {
  //     id: 5,
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     email: 'john.doe@email.com',
  //     mobileNo: '123-456-7890',
  //   },
  //   {
  //     id: 6,
  //     firstName: 'Jane',
  //     lastName: 'Smith',
  //     email: 'jane.smith@email.com',
  //     mobileNo: '987-654-3210',
  //   },
  //   {
  //     id: 7,
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     email: 'john.doe@email.com',
  //     mobileNo: '123-456-7890',
  //   },
  //   {
  //     id: 8,
  //     firstName: 'Jane',
  //     lastName: 'Smith',
  //     email: 'jane.smith@email.com',
  //     mobileNo: '987-654-3210',
  //   },
  //   {
  //     id: 8,
  //     firstName: 'Jane',
  //     lastName: 'Smith',
  //     email: 'jane.smith@email.com',
  //     mobileNo: '987-654-3210',
  //   },
  //   {
  //     id: 8,
  //     firstName: 'Jane',
  //     lastName: 'Smith',
  //     email: 'jane.smith@email.com',
  //     mobileNo: '987-654-3210',
  //   },
  //   {
  //     id: 8,
  //     firstName: 'Jane',
  //     lastName: 'Smith',
  //     email: 'jane.smith@email.com',
  //     mobileNo: '987-654-3210',
  //   },
  // ];

  const navigation = useNavigation();

  const [members, setMembers] = useState([]);
  const [skeletonLoader, setSkeletonLoader] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false); // To toggle menu visibility

  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible); // Toggle the visibility of the menu
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        console.log(`${BASE_URL}/get-assets`);
        const response = await fetch(`${BASE_URL}/get-assets`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setMembers(data.memberData);
        setSkeletonLoader(false);
      } catch (err) {
        console.error('Fetch error:', err);
        // setSkeletonLoader(false);
      }
    };

    fetchMembers();
  }, [members]);

  function renderMemberCard(member) {
    return (
      <View style={styles.memberCard}>
        <TouchableWithoutFeedback>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgzPKFziefwggi6URHF_ApNhe9okKizqq4lRBjzG9QQ5--_Ch0Iq9IUtPONEw9-SeKlqs&usqp=CAU',
              }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback>
          <View style={styles.memberDetails}>
            <Text style={styles.memberName}>{member.package_name}</Text>
            <Text style={styles.memberPlan}>Plan : {member.package_type}</Text>
          </View>
        </TouchableWithoutFeedback>

        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                navigation.navigate('EditMember', { memberId: member.id });
                setMenuVisible(false); // Close the menu after selecting
              }}>
              <Text style={styles.menuOptionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                handleDelete(member.id);
                setMenuVisible(false); // Close the menu after selecting
              }}>
              <Text style={styles.menuOptionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  const handleDelete = (id) => {
    // Logic to delete the member (e.g., remove from state or make API call)
    console.log(`Member with ID ${id} deleted.`);
  };

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
      <SafeAreaView style={styles.safeArea}>
        <View
          style={{
            marginTop: Platform.OS === 'ios' ? 20 : 60,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: SIZES.padding,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image
                  source={icons.menu_icon} // You can use any menu icon for the drawer
                  style={styles.menuIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.headerSection}>
              <Text style={styles.header}>Assets</Text>
            </View>

            <View>
              <Text style={styles.header}> </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: SIZES.font }}>
          {members.length === 0 ? (
            <View style={styles.emptyState}>
              <Image source={images.noData} style={styles.noDataImage} />
              <Text style={styles.emptyText}>
                No assets available at the moment
              </Text>
            </View>
          ) : (
            <View>
              {skeletonLoader ? (
                ''
              ) : (
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  scrollEnabled={true}>
                  {members.map((member, index) => (
                    <View key={member.id}>
                      {renderMemberCard(member, navigation)}
                      {index < members.length - 1 && (
                        <View style={styles.separator} />
                      )}
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  menuIcon: {
    width: 30,
    height: 30,
    tintColor: COLORS.white,
  },
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
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  headerSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  scrollView: {
    padding: 10,
    marginTop: 10,
  },
  emptyState: {
    marginTop: screenWidth / 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  noDataImage: {
    width: 100, // Adjust the size as needed
    height: 100, // Adjust the size as needed
    marginBottom: SIZES.base,
  },
  emptyText: {
    color: COLORS.lightGray,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  memberCard: {
    flexDirection: 'row',
    padding: SIZES.base,
    marginHorizontal: SIZES.base,
    borderRadius: SIZES.radius,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.base,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGray,
  },
  memberDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  memberName: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  memberPlan: {
    ...FONTS.body4,
    color: COLORS.lightGray,
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base / 2,
    paddingHorizontal: SIZES.base,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
  },
  deleteButton: {
    backgroundColor: COLORS.lightRed,
    paddingVertical: SIZES.base / 2,
    paddingHorizontal: SIZES.base,
    borderRadius: SIZES.radius,
  },
  buttonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    margin: SIZES.base,
  },
  menuButton: {
    padding: 5,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menu: {
    position: 'absolute',
    top: 0,
    right: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 1000,
  },
  menuOption: {
    paddingVertical: 10,
  },
  menuOptionText: {
    fontSize: 14,
    color: '#007bff',
  },
});

export default ViewAssets;

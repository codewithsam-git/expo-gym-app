import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';
import BASE_URL from '../Api/commonApi';
import SkeletonMember from '../components/SkeletonMember';
import { useFocusEffect } from '@react-navigation/native';
import ViewHeader from '../components/ViewHeader';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ViewStaff = () => {
  const members1 = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      mobileNo: '123-456-7890',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      mobileNo: '987-654-3210',
    },
    {
      id: 3,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      mobileNo: '123-456-7890',
    },
    {
      id: 4,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      mobileNo: '987-654-3210',
    },
    {
      id: 5,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      mobileNo: '123-456-7890',
    },
    {
      id: 6,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      mobileNo: '987-654-3210',
    },
    {
      id: 7,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      mobileNo: '123-456-7890',
    },
    {
      id: 8,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      mobileNo: '987-654-3210',
    },
    {
      id: 8,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      mobileNo: '987-654-3210',
    },
    {
      id: 8,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      mobileNo: '987-654-3210',
    },
    {
      id: 8,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      mobileNo: '987-654-3210',
    },
  ];

  const navigation = useNavigation();
  const [members, setMembers] = useState([]);
  const [skeletonLoader, setSkeletonLoader] = useState(false);
  const [menuVisibleFor, setMenuVisibleFor] = useState(null);

  const fetchMembers = async () => {
    try {
      console.log(`${BASE_URL}/staff`);
      const response = await fetch(`${BASE_URL}/staff`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setMembers(data.staffData);
      setSkeletonLoader(false);
    } catch (err) {
      console.error('Fetch error:', err);
      // setSkeletonLoader(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMembers();
    }, [])
  );

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this staff?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete cancelled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              console.log(`${BASE_URL}/delete-staff/${id}`);
              const response = await fetch(`${BASE_URL}/delete-staff/${id}`);

              if (!response.ok) {
                throw new Error(
                  `Failed to delete item, HTTP error! status: ${response.status}`
                );
              }

              setMembers((prevMembers) =>
                prevMembers.filter((member) => member.id !== id)
              );
            } catch (err) {
              console.error('Delete error:', err);
              alert('Failed to delete the staff. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  function renderMemberCard(member) {
    const isMenuVisible = menuVisibleFor === member.id;

    const toggleMenu = () => {
      setMenuVisibleFor(isMenuVisible ? null : member.id);
    };

    return (
      <TouchableOpacity
        style={{ marginTop: 10 }}
        onPress={() => setMenuVisibleFor(false)}>
        {/* Animate the main card view */}
        <Animatable.View
          style={styles.card}
          animation="fadeInUp"
          duration={600}
          delay={100}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgzPKFziefwggi6URHF_ApNhe9okKizqq4lRBjzG9QQ5--_Ch0Iq9IUtPONEw9-SeKlqs&usqp=CAU',
              }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>

          <View style={styles.memberDetails}>
            <Text style={styles.memberName}>{member.full_name}</Text>
            <Text style={styles.memberEmail}>{member.mob_no}</Text>
            <Text style={styles.memberPlan}>Role: {member.role}</Text>
          </View>

          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            {/* Adding rotation animation to the menu icon */}
            <Animatable.View animation="fadeInUp" duration={1000}>
              <Icon name="more-vert" size={20} color={COLORS.lightGray2} />
            </Animatable.View>
          </TouchableOpacity>
        </Animatable.View>

        {/* Animate the menu dropdown when visible */}
        {isMenuVisible && (
          <Animatable.View
            animation="fadeInDown"
            duration={200}
            style={styles.menuDropdown}>
            {/* Edit Button with bounce effect */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('editStaff', { staffId: member.id });
                setMenuVisibleFor(null);
              }}>
              <Animatable.View animation="bounceIn" delay={100}>
                <Icon name="edit" size={20} color={COLORS.primary} />
              </Animatable.View>
              <Text style={styles.menuItemText}>Edit</Text>
            </TouchableOpacity>

            {/* Delete Button with bounce effect */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                handleDelete(member.id);
                setMenuVisibleFor(null);
              }}>
              <Animatable.View animation="bounceIn" delay={200}>
                <Icon name="delete" size={20} color={COLORS.lightRed} />
              </Animatable.View>
              <Text style={styles.menuItemText}>Delete</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisibleFor(false)}>
      <SafeAreaView style={styles.safeArea}>
        <Animatable.View animation="fadeInDown" duration={800}>
          <ViewHeader headerTitle="Staff" navigateTo="addStaff" />
        </Animatable.View>

        <View style={{ marginTop: SIZES.font }}>
          {members.length === 0 ? (
            <View style={styles.emptyState}>
              <Image source={images.noData} style={styles.noDataImage} />
              <Text style={styles.emptyText}>
                No staff available at the moment
              </Text>
            </View>
          ) : (
            <View>
              {skeletonLoader ? (
                <SkeletonMember />
              ) : (
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  scrollEnabled={true}
                  onScroll={() =>
                    menuVisibleFor != null && setMenuVisibleFor(null)
                  }>
                  <View style={styles.cardWrapper}>
                    {members.map((member, index) => (
                      <View key={member.id} style={styles.cardContainer}>
                        {renderMemberCard(member)}
                      </View>
                    ))}
                  </View>
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
  cardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  cardContainer: {
    width: '49%',
  },
  card: {
    backgroundColor: COLORS.gray1,
    borderRadius: 10,
    padding: 15,
    position: 'relative', // Ensure the parent is positioned for absolute positioning
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circular avatar
  },
  memberDetails: {
    alignItems: 'center',
  },
  memberName: {
    marginVertical: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  memberEmail: {
    fontSize: 14,
    color: COLORS.lightGray4,
  },
  memberPlan: {
    fontSize: 14,
    color: COLORS.lightGray4,
  },
  menuButton: {
    position: 'absolute', // Absolute positioning
    top: 10, // Adjust top to position the menu
    right: 10, // Adjust left to position the menu
  },
  menuDropdown: {
    position: 'absolute',
    right: SIZES.base,
    top: SIZES.base,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    textAlign: 'center',
    padding: SIZES.base,
  },
  menuItemText: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginLeft: SIZES.base,
  },
});

export default ViewStaff;

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
  Platform,
  Alert,
  Dimensions,
  TextInput,
  FlatList
} from 'react-native';
import { COLORS, FONTS, SIZES, images } from '../constants';
import BASE_URL from '../Api/commonApi';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import SkeletonMember from '../components/SkeletonMember';
import { useFocusEffect } from '@react-navigation/native';
import ViewHeader from '../components/ViewHeader';
import * as Animatable from 'react-native-animatable';
import IMAGES_URL from '../Api/ImagesUrl';

const screenWidth = Dimensions.get('window').width;

const ViewMembers = () => {
  const navigation = useNavigation();

  const [members, setMembers] = useState([]);
  const [skeletonLoader, setSkeletonLoader] = useState(true);
  const [menuVisibleFor, setMenuVisibleFor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showActivatedOnly, setShowActivatedOnly] = useState(false);
  const [showDeactivatedOnly, setShowDeactivatedOnly] = useState(false);
  const [expiredMembers, setExpiredMembers] = useState([]);
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);

  const fetchExpiredMembers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/members?expired=true`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setExpiredMembers(data.memberData);
      setSkeletonLoader(false);
    } catch (err) {
      console.error('Expired fetch error:', err);
      setSkeletonLoader(false);
    }
  };

  const membersToShow = showExpiredOnly ? expiredMembers : members;

  const filteredMembers = membersToShow.filter((member) => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const matchesSearch = searchTerms.every((term) =>
      (member.name.toLowerCase().includes(term) || member.surname.toLowerCase().includes(term))
    );

    const matchesActivated = showActivatedOnly ? member.memberStatus === 'Active' : true;
    const matchesDeactivated = showDeactivatedOnly ? member.memberStatus === 'Inactive' : true;

    return matchesSearch && matchesActivated && matchesDeactivated;
  });


  const filterOptions = [
    { label: 'All Members', type: 'All' },
    { label: 'Active Members', type: 'Active' },
    { label: 'Inactive Members', type: 'Inactive' },
    // { label: 'Expired Members', type: 'Expired' },
  ];

  const handleFilterSelect = (type) => {
    if (type === 'Active') {
      setShowActivatedOnly(true);
      setShowDeactivatedOnly(false);
      setShowExpiredOnly(false);
    } else if (type === 'Inactive') {
      setShowActivatedOnly(false);
      setShowDeactivatedOnly(true);
      setShowExpiredOnly(false);
    } else if (type === 'Expired') {
      setShowActivatedOnly(false);
      setShowDeactivatedOnly(false);
      setShowExpiredOnly(true);
      fetchExpiredMembers(); // load expired members when selected
    } else {
      // All selected
      setShowActivatedOnly(false);
      setShowDeactivatedOnly(false);
      setShowExpiredOnly(false);
    }
  };

  const formatFetchedDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const fetchMembers = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/members`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMembers(data.memberData);
      setSkeletonLoader(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setSkeletonLoader(false);
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

  const handleStatusChange = async (member) => {
    const memberId = member.id;
    Alert.alert(
      'Confirm Deactivate',
      'Are you sure you want deactivate this member?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await fetch(
                `${BASE_URL}/edit-membersData?id=${memberId}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    ...member,
                    memberStatus: 'Inactive',
                  }),
                }
              );

              if (!response.ok) {
                throw new Error(
                  `Failed to change status, HTTP error! status: ${response.status}`
                );
              }
              fetchMembers();
            } catch (err) {
              console.error('Staus change error:', err);
              alert('Failed to status of member. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  function renderMemberCard(member, index, navigation) {
    const isMenuVisible = menuVisibleFor === member.id;
    const toggleMenu = () => {
      setMenuVisibleFor(isMenuVisible ? null : member.id);
    };
    return (
      <TouchableOpacity
        onPress={() => {
          if (menuVisibleFor) {
            setMenuVisibleFor(false);
          } else {
            navigation.navigate('profile', { memberId: member.id });
          }
        }}
        activeOpacity={0.9}
        style={styles.cardContainer}>
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          delay={index * 100}
          style={styles.memberCard}>
          {/* Top Row - Avatar, Name, and Package */}
          <View style={styles.topRow}>
            <View
              animation="bounceIn"
              duration={800}
              style={styles.avatarWrapper}>
              <Image
                source={{
                  uri:
                    `${IMAGES_URL}/membersImage/${member.profile_image}` ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgzPKFziefwggi6URHF_ApNhe9okKizqq4lRBjzG9QQ5--_Ch0Iq9IUtPONEw9-SeKlqs&usqp=CAU',
                }}
                style={styles.avatar}
                resizeMode="cover"
              />
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      member.memberStatus === 'Active'
                        ? '#5DBE3F'
                        : COLORS.lightRed,
                  },
                ]}
              />
            </View>

            <View
              animation="fadeIn"
              duration={700}
              style={styles.namePackageContainer}>
              <Text style={styles.memberName}>
                {member.name} {member.surname}
              </Text>
              <Text style={styles.packageText}>{member.package_name}</Text>
            </View>

            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <Icon name="more-vert" size={20} color={COLORS.lightGray2} />
            </TouchableOpacity>
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <View style={styles.row}>
              <View style={styles.column}>
                {/* Contact Info */}
                <View style={styles.infoItem}>
                  <Icon name="email" size={16} color={COLORS.primary} />
                  <Text style={styles.infoText}>{member.email}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Icon
                    name="calendar-today"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text style={styles.infoText}>
                    {formatFetchedDate(member.start_Date)} -{' '}
                    {formatFetchedDate(member.end_date)}
                  </Text>
                </View>

                {/* Location */}
                <View style={styles.infoItem}>
                  <Icon name="location-on" size={16} color={COLORS.primary} />
                  <Text style={styles.infoText}>
                    {member.city}, {member.country}
                  </Text>
                </View>
              </View>

              <View style={styles.column1}>
                {/* Pricing */}
                <View style={styles.infoItem}>
                  <Icon
                    name="currency-rupee"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text style={styles.infoText}>
                    ₹{member.discountFinalPrice || 'N/A'}{' '}
                    <Text style={styles.originalPrice}>
                      ₹{member.packagePrice || 'N/A'}
                    </Text>
                  </Text>
                </View>

                {/* Dates */}

                <View style={styles.infoItem}>
                  <Icon name="phone" size={16} color={COLORS.primary} />
                  <Text style={styles.infoText}>{member.phoneno}</Text>
                </View>

                {/* Gender */}
                <View style={styles.infoItem}>
                  <Icon name="person" size={16} color={COLORS.primary} />
                  <Text style={styles.infoText}>
                    {member.gender.charAt(0).toUpperCase() +
                      member.gender.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Menu Dropdown */}
          {isMenuVisible && (
            <Animatable.View
              animation="fadeInDown"
              duration={200}
              style={styles.menuDropdown}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate('editMember', { memberId: member.id });
                  setMenuVisibleFor(null);
                }}>
                <Animatable.View animation="bounceIn" delay={100}>
                  <Icon name="edit" size={20} color={COLORS.primary} />
                </Animatable.View>
                <Text style={styles.menuItemText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate('history', { memberId: member.id, whatsappContact: member.phoneno });
                  setMenuVisibleFor(null);
                }}>
                <Animatable.View animation="bounceIn" delay={200}>
                  <Icon name="history" size={20} color={COLORS.darkBlue} />
                </Animatable.View>
                <Text style={styles.menuItemText}>View History</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  handleStatusChange(member);
                  setMenuVisibleFor(null);
                }}>
                <Animatable.View animation="bounceIn" delay={200}>
                  <Icon name="cancel" size={20} color={COLORS.lightGray4} />
                </Animatable.View>
                <Text style={styles.menuItemText}>Deactive</Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
        </Animatable.View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisibleFor(false)}>
      <SafeAreaView style={styles.safeArea}>
        <Animatable.View animation="fadeInDown" duration={800}>
          <ViewHeader headerTitle="Members" navigateTo="addMember" />
        </Animatable.View>

        <Animatable.View animation="fadeInDown" duration={800} style={styles.filterContainer}>
          <FlatList
            data={filterOptions}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.type}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleFilterSelect(item.type)}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      (item.type === 'Active' && showActivatedOnly) ||
                        (item.type === 'Inactive' && showDeactivatedOnly) ||
                        (item.type === 'Expired' && showExpiredOnly) ||
                        (item.type === 'All' && !showActivatedOnly && !showDeactivatedOnly && !showExpiredOnly)
                        ? COLORS.primary
                        : COLORS.lightGray4,

                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    {
                      color:
                        (item.type === 'Active' && showActivatedOnly) ||
                          (item.type === 'Inactive' && showDeactivatedOnly) ||
                          (item.type === 'Expired' && showExpiredOnly) ||
                          (item.type === 'All' && !showActivatedOnly && !showDeactivatedOnly && !showExpiredOnly)
                          ? COLORS.white
                          : COLORS.gray,

                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </Animatable.View>

        {filteredMembers && !skeletonLoader && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name..."
              placeholderTextColor={COLORS.lightGray4}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        )}

        {/* Member List */}
        <View style={{ marginTop: SIZES.font }}>
          {(filteredMembers.length === 0 && !skeletonLoader) ? (
            <Animatable.View animation="zoomIn" duration={800} style={styles.emptyState}>
              <Image source={images.noData} style={styles.noDataImage} />
              <Text style={styles.emptyText}>No members available at the moment</Text>
            </Animatable.View>
          ) : (
            <View>
              {skeletonLoader ? (
                <SkeletonMember />
              ) : (
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: Platform.OS === 'ios' ? 120 : 200,
                  }}
                  scrollEnabled={true}
                  onScroll={() => menuVisibleFor != null && setMenuVisibleFor(null)}
                  scrollEventThrottle={16}
                >
                  {filteredMembers.map((member, index) => (
                    <View key={member.id}>{renderMemberCard(member, index, navigation)}</View>
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
  searchContainer: {
    padding: SIZES.font,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: SIZES.font,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005f56', // Match the color of other filters
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: SIZES.base,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  filterIcon: {
    marginLeft: 8,
  },
  searchInput: {
    height: 40,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.base,
    fontSize: FONTS.body3.fontSize || 16,
    color: COLORS.white,
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
  cardContainer: {
    marginHorizontal: SIZES.font,
  },
  memberCard: {
    borderRadius: SIZES.radius * 2,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginBottom: SIZES.font,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.base,
    backgroundColor: '#202428',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: SIZES.font,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  namePackageContainer: {
    flex: 1,
  },
  memberName: {
    ...FONTS.h3,
    color: COLORS.white,
    fontWeight: '700',
  },
  packageText: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: '500',
  },
  menuButton: {
    padding: SIZES.base,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsSection: {
    padding: SIZES.base,
  },
  column: {
    width: '60%',
  },
  column1: {
    width: '40%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  infoText: {
    ...FONTS.body4,
    color: COLORS.white,
    marginLeft: SIZES.base,
    flexShrink: 1,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: COLORS.lightGray4,
    fontSize: 12,
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

export default ViewMembers;

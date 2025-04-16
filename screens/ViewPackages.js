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
  TextInput,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import BASE_URL from '../Api/commonApi';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import SkeletonMember from '../components/SkeletonMember';
import { useFocusEffect } from '@react-navigation/native';
import ViewHeader from '../components/ViewHeader';
import IMAGES_URL from '../Api/ImagesUrl';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ViewPackages = () => {
  const navigation = useNavigation();

  const [members, setMembers] = useState([]);
  const [skeletonLoader, setSkeletonLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisibleFor, setMenuVisibleFor] = useState(null);

  const filteredMembers = members.filter((member) =>
    member.package_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/packages`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMembers(data.packages);
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

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this package?',
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
              const response = await fetch(`${BASE_URL}/delete-package/${id}`);

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
              alert('Failed to delete the package. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  function renderMemberCard(member, index) {
    const isMenuVisible = menuVisibleFor === member.id;

    const toggleMenu = () => {
      setMenuVisibleFor(isMenuVisible ? null : member.id);
    };

    return (
      <TouchableOpacity onPress={() => setMenuVisibleFor(false)}>
        <Animatable.View
          animation="fadeInUp" // Animate each card sliding up
          duration={800}
          delay={index * 100} // Stagger animation for each card
          style={styles.memberCard}>
          {/* Avatar Section */}
          <View activeOpacity={0.8}>
            <View style={styles.avatarContainer}>
              <Image
                animation="zoomIn" // Zoom in effect for avatar
                duration={600}
                source={{
                  uri: `${IMAGES_URL}/packages/${member.image}` || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgzPKFziefwggi6URHF_ApNhe9okKizqq4lRBjzG9QQ5--_Ch0Iq9IUtPONEw9-SeKlqs&usqp=CAU',
                }}
                style={styles.avatar}
                resizeMode="cover"
                onError={(e) =>
                  console.log('Image load error:', e.nativeEvent.error)
                }
              />
            </View>
          </View>

          {/* Member Details Section */}
          <View style={styles.memberDetails} activeOpacity={0.7}>
            <Text
              style={styles.memberName}
              numberOfLines={1}
              ellipsizeMode="tail">
              {member.package_name}
            </Text>
            <Text delay={200} style={styles.memberPlan}>
              Amount: ₹
              {parseFloat(member.package_amount).toLocaleString('en-IN')}
              /-
            </Text>
          </View>

          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Icon name="more-vert" size={20} color={COLORS.lightGray2} />
          </TouchableOpacity>

          {/* Contextual Menu */}
          {isMenuVisible && (
            <Animatable.View
              animation="fadeInDown"
              duration={200}
              style={styles.menuDropdown}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate('editPackage', { packageId: member.id });
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
        </Animatable.View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisibleFor(false)}>
      <SafeAreaView style={styles.safeArea}>
        <Animatable.View animation="fadeInDown" duration={800}>
          <ViewHeader headerTitle="Packages" navigateTo="addPackage" />
        </Animatable.View>

        {filteredMembers && !skeletonLoader && (
          <View
            style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by package name..."
              placeholderTextColor={COLORS.lightGray4}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        )}

        <View style={{ marginTop: SIZES.font }}>
          {(filteredMembers.length === 0 && !skeletonLoader) ? (
            <Animatable.View
              animation="bounceIn" // Bounce in effect for empty state
              duration={1000}
              style={styles.emptyState}>
              <Animatable.Image
                animation="pulse" // Pulse effect for no-data image
                duration={1500}
                iterationCount="infinite"
                source={images.noData}
                style={styles.noDataImage}
              />
              <Animatable.Text
                animation="fadeIn"
                duration={1000}
                delay={300}
                style={styles.emptyText}>
                No packages available at the moment
              </Animatable.Text>
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
                  onScroll={() =>
                    menuVisibleFor != null && setMenuVisibleFor(null)
                  }>
                  {filteredMembers.map((member, index) => (
                    <View key={member.id}>
                      {renderMemberCard(member, index)}
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
  searchContainer: {
    padding: SIZES.font,
  },
  searchInput: {
    height: 40,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.base,
    fontSize: FONTS.body3?.fontSize || 16,
    color: COLORS.white,
  },
  emptyState: {
    marginTop: screenWidth / 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  noDataImage: {
    width: 100,
    height: 100,
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
    alignItems: 'center',
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.font,
    padding: SIZES.font,
    margin: SIZES.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  avatar: {
    width: 60,
    height: 60,
  },
  memberDetails: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  memberPlan: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
  },
  menuButton: {
    padding: SIZES.base,
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

export default ViewPackages;

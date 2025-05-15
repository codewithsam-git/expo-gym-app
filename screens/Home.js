import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import Header from '../components/Header';
import BASE_URL from '../Api/commonApi';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import IMAGES_URL from '../Api/ImagesUrl';

const Home = ({ navigation }) => {

  function renderMyBookSection() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {/* First Row */}
          <LinearGradient
            colors={[COLORS.secondary, COLORS.gray]} // Gradient from dark gray to a slightly lighter gray
            style={{
              width: '48%',
              padding: SIZES.padding,
              borderRadius: 20,
              marginBottom: SIZES.padding,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 8, // Increased elevation for a more pronounced shadow
              shadowColor: COLORS.black,
              shadowOffset: { width: 4, height: 8 },
              shadowOpacity: 1,
              shadowRadius: 6,
              borderWidth: 1,
              borderColor: COLORS.secondary, // Subtle border with primary color
            }}>
              
            <FontAwesome
              name="users"
              size={24}
              color={COLORS.primary}
              style={{ marginBottom: SIZES.base }}
            />
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.white,
                fontWeight: 'bold',
                marginBottom: SIZES.base,                
              }}
              >
              Total Members
            </Text>
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.white,
                fontWeight: 'bold',
              }}>
              {loader ? '•••' : totalCount.membersCount || 0}
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={[COLORS.secondary, COLORS.gray]} // Gradient from dark gray to a slightly lighter gray
            style={{
              width: '48%',
              padding: SIZES.padding,
              borderRadius: 20,
              marginBottom: SIZES.padding,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 8, // Increased elevation for a more pronounced shadow
              shadowColor: COLORS.black,
              shadowOffset: { width: 2, height: 6 },
              shadowOpacity: 1,
              shadowRadius: 6,
              borderWidth: 1,
              borderColor: COLORS.secondary, // Subtle border with primary color
            }}>
            <FontAwesome
              name="archive"
              size={24}
              color={COLORS.primary}
              style={{ marginBottom: SIZES.base }}
            />
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.white,
                fontWeight: 'bold',
                marginBottom: SIZES.base,
              }}>
              Total Packages
            </Text>
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.white,
                fontWeight: 'bold',
              }}>
              {loader ? '•••' : totalCount.packageCount || 0}
            </Text>
          </LinearGradient>

          {/* Second Row */}
          <LinearGradient
            colors={[COLORS.secondary, COLORS.gray]} // Gradient from dark gray to a slightly lighter gray
            style={{
              width: '48%',
              padding: SIZES.padding,
              borderRadius: 20,
              marginBottom: SIZES.padding,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 8, // Increased elevation for a more pronounced shadow
              shadowColor: COLORS.black,
              shadowOffset: { width: 2, height: 6 },
              shadowOpacity: 1,
              shadowRadius: 6,
              borderWidth: 1,
              borderColor: COLORS.secondary, // Subtle border with primary color
            }}>
            <FontAwesome
              name="rupee"
              size={24}
              color={COLORS.primary}
              style={{ marginBottom: SIZES.base }}
            />
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.white,
                fontWeight: 'bold',
                marginBottom: SIZES.base,
              }}>
              Collection
            </Text>
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.white,
                fontWeight: 'bold',
              }}>
              {loader
                ? '•••'
                : '₹ ' + (
                  isNaN(parseFloat(totalCount.collectionCount))
                    ? 0
                    : parseFloat(totalCount.collectionCount).toLocaleString('en-IN')
                )}
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={[COLORS.secondary, COLORS.gray]} // Gradient from dark gray to a slightly lighter gray
            style={{
              width: '48%',
              padding: SIZES.padding,
              borderRadius: 20,
              marginBottom: SIZES.padding,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 8, // Increased elevation for a more pronounced shadow
              shadowColor: COLORS.black,
              shadowOffset: { width: 2, height: 6 },
              shadowOpacity: 1,
              shadowRadius: 6,
              borderWidth: 1,
              borderColor: COLORS.secondary, // Subtle border with primary color
            }}>
            <FontAwesome
              name="cubes"
              size={24}
              color={COLORS.primary}
              style={{ marginBottom: SIZES.base }}
            />
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.white,
                fontWeight: 'bold',
                marginBottom: SIZES.base,
              }}>
              Assets
            </Text>
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.white,
                fontWeight: 'bold',
              }}>
              {loader
                ? '•••'
                : '₹ ' + (
                  isNaN(parseFloat(totalCount.assetsTotal))
                    ? 0
                    : parseFloat(totalCount.assetsTotal).toLocaleString('en-IN')
                )}
            </Text>
          </LinearGradient>
        </View>
      </View>
    );
  }

  function renderPackagesTitleSection() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 15,
          paddingHorizontal: 18,
        }}>
        {/* Left Line */}
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
          }}
        />

        {/* Title Section */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderRadius: 10,
          }}>
          <FontAwesome
            name="tag"
            size={20}
            color="#FFD700" // Gold color for premium look
            style={{ marginRight: 8 }}
          />
          <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>
            Packages
          </Text>
        </View>

        {/* Right Line */}
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
          }}
        />
      </View>
    );
  }

  function renderMemberExpiryTitleSection() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 15,
          paddingHorizontal: 18,
        }}>
        {/* Left Line */}
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
          }}
        />

        {/* Title Section */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderRadius: 10,
          }}>
          <Icon
            name="calendar-outline"
            size={20}
            color="#FFD700" // Gold color for premium look
            style={{ marginRight: 8 }}
          />
          <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>
            New Members
          </Text>
        </View>

        {/* Right Line */}
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
          }}
        />
      </View>
    );
  }

  const [members, setMembers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [totalCount, setTotalCount] = useState([]);
  const [loader, setLoader] = useState(true);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/dashboard`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMembers(data.latestMembers);
      setTotalCount(data);
      setLoader(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoader(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${BASE_URL}/packages`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPackages(data.packages);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchPackages();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMembers();
      fetchPackages();
    }, [])
  );

  const formatFetchedDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  function renderMemberCard(member) {
    return (
      <View style={styles.memberCard}>
        <View style={styles.memberHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: `${IMAGES_URL}/membersImage/${member.profile_image}` || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgzPKFziefwggi6URHF_ApNhe9okKizqq4lRBjzG9QQ5--_Ch0Iq9IUtPONEw9-SeKlqs&usqp=CAU',
              }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>

          <View style={styles.memberDetails}>
            <Text style={styles.memberName}>
              {member.name} {member.surname}
            </Text>
            <Text style={styles.memberPlan}>
              Package: {member.package_name}
            </Text>
            <Text style={styles.memberPlan}>
              Plan: {formatFetchedDate(member.start_Date)} - {formatFetchedDate(member.end_date)}
            </Text>
          </View>
          <View style={styles.expiryContainer}>
            <View></View>
            <View>
              <Text style={styles.createdDate}>{new Date(member.createdAt).toLocaleDateString('en-GB')}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
      <LinearGradient
        colors={[
          COLORS.black,
          COLORS.black,
          COLORS.black,
          COLORS.black,
          COLORS.gray,
          COLORS.black,
          COLORS.black,
          COLORS.black,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
        }}>
        <View>
          <Header headerTitle="Dashboard" />
        </View>

        <ScrollView
          style={{ margin: SIZES.radius }}
          showsVerticalScrollIndicator={false}>
          <View>{renderMyBookSection()}</View>

          <View>
            <View>{renderPackagesTitleSection()}</View>
            <View style={styles.container}>
              {packages.length === 0 ? (
                <Text style={styles.emptyText}>
                  No packages available at the moment
                </Text>
              ) : (
                <FlatList
                  data={packages}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.packageItem}
                      activeOpacity={0.8}
                      onPress={() => {
                        navigation.navigate('editPackage', {
                          packageId: item.id,
                        });
                      }}>
                      <View style={styles.packageContainer}>
                        <Image
                          source={{
                            uri: `${IMAGES_URL}/packages/${item.image}`
                          }}
                          style={styles.itemImage}
                          resizeMode="cover"
                        />
                        <View style={styles.packageContent}>
                          <Text
                            style={styles.packageTitle}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {item.package_name || 'Premium Package'}
                          </Text>
                          <Text style={styles.packageSubtitle}>
                            Amount:{' '}
                            {item.discount || 'Membership Benefits'}
                            /-
                          </Text>
                          {item.price && (
                            <Text style={styles.packagePrice}>
                              ${item.price}/month
                            </Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                />
              )}
            </View>
          </View>

          <View>
            <View>{renderMemberExpiryTitleSection()}</View>
            <View>
              {members.length === 0 && (
                <Text style={styles.emptyText}>
                  No members available at the moment
                </Text>
              )}
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={true}>
                {members.map((member, index) => (
                  <TouchableOpacity
                    key={member.id}
                    onPress={() =>
                      navigation.navigate('profile', { memberId: member.id })
                    }>
                    <View>{renderMemberCard(member)}</View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  memberCard: {
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  memberPlan: {
    fontSize: 14,
    color: 'gray',
  },
  expiryContainer: {
    position: 'absolute',
    right: 0,
    top: 4,
  },
  createdDate: {
    fontSize: 12,
    color: COLORS.lightGreen, // Expiry date in red
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  emptyText: {
    color: COLORS.lightGray,
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
    fontWeight: '500',
  },
  packageItem: {
    marginRight: 20,
    borderRadius: 12
  },
  packageContainer: {
    width: 240,
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  packageContent: {
    padding: 15,
    alignItems: 'center',
  },
  packageTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  packageSubtitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
  },
  packagePrice: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  flatListContent: {},
});

export default Home;

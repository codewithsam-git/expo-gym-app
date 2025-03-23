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

const LineDivider = () => {
  return (
    <View style={{ width: 1, paddingVertical: 18 }}>
      <View
        style={{
          flex: 1,
          borderLeftColor: COLORS.lightGray,
          borderLeftWidth: 1,
        }}></View>
    </View>
  );
};

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
          <View
            style={{
              width: '48%', // 2 boxes per row
              backgroundColor: COLORS.secondary,
              padding: SIZES.padding,
              borderRadius: 20,
              elevation: 5,
              marginBottom: SIZES.padding,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.white,
                fontWeight: 'bold',
                marginBottom: SIZES.base,
              }}>
              Total Members
            </Text>
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.white,
                fontWeight: 'bold',
              }}>
              {totalCount.membersCount}
            </Text>
          </View>

          <View
            style={{
              width: '48%',
              backgroundColor: COLORS.secondary,
              padding: SIZES.padding,
              borderRadius: 20,
              elevation: 5,
              marginBottom: SIZES.padding,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
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
              {totalCount.packageCount}
            </Text>
          </View>

          {/* Second Row */}
          <View
            style={{
              width: '48%',
              backgroundColor: COLORS.secondary,
              padding: SIZES.padding,
              borderRadius: 20,
              elevation: 5,
              marginBottom: SIZES.padding,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
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
              {totalCount.collectionCount}
            </Text>
          </View>

          <View
            style={{
              width: '48%',
              backgroundColor: COLORS.secondary,
              padding: SIZES.padding,
              borderRadius: 20,
              elevation: 5,
              marginBottom: SIZES.padding,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
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
              {totalCount.assetsTotal}
            </Text>
          </View>
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
            Members with Expiring Plans
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

  function renderExpiringMembers() {
    // Example data of expiring members. You can replace this with the data fetched from your API.
    const expiringMembersData = [
      {
        id: 1,
        name: 'John Doe',
        plan: 'Gold Membership',
        expiryDate: '2025-03-14',
        image: images.member1, // Replace with the actual image or add a placeholder
      },
      {
        id: 2,
        name: 'Jane Smith',
        plan: 'Silver Membership',
        expiryDate: '2025-03-15',
        image: images.member2, // Replace with the actual image or add a placeholder
      },
      {
        id: 3,
        name: 'Michael Johnson',
        plan: 'Platinum Membership',
        expiryDate: '2025-03-18',
        image: images.member3, // Replace with the actual image or add a placeholder
      },
    ];

    return (
      <View style={{ marginTop: SIZES.padding }}>
        <FlatList
          data={expiringMembersData}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: COLORS.white,
                padding: SIZES.padding,
                borderRadius: 15,
                elevation: 5,
              }}>
              {/* Member Image */}
              <Image
                source={item.image}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginRight: SIZES.base,
                }}
              />

              {/* Member Details */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    ...FONTS.body2,
                    color: COLORS.black,
                    fontWeight: 'bold',
                  }}>
                  {item.name}
                </Text>
                <Text style={{ ...FONTS.body3, color: COLORS.lightGray }}>
                  {item.plan}
                </Text>
              </View>

              {/* Expiry Date */}
              <View style={{ justifyContent: 'flex-end' }}>
                <Text
                  style={{
                    ...FONTS.body3,
                    color: COLORS.danger, // Red color for expiry notice
                    fontWeight: 'bold',
                  }}>
                  {`Expires: ${item.expiryDate}`}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  }

  const [members, setMembers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [totalCount, setTotalCount] = useState([]);

  const fetchMembers = async () => {
    try {
      console.log(`${BASE_URL}/dashboard`);
      const response = await fetch(`${BASE_URL}/dashboard`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMembers(data.getFilterMembers);
      setTotalCount(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const fetchPackages = async () => {
    try {
      console.log(`${BASE_URL}/packages`);
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

  function renderMemberCard(member) {
    return (
      <View style={styles.memberCard}>
        <View style={styles.memberHeader}>
          {/* Avatar and member details on the left */}
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-260nw-1290556063.jpg',
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
          </View>
          <View style={styles.expiryContainer}>
            <View></View>
            <View>
              <Text style={styles.expiryDate}>{member.end_date}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
      <View
        style={{
          marginTop: Platform.OS === 'ios' ? 10 : 50,
        }}>
        <Header />
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
                    activeOpacity={0.8}>
                    <View style={styles.packageContainer}>
                      <Image
                        source={images.gym1}
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
                          Amount: {item.package_amount || 'Membership Benefits'}
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
                  onPress={() => navigation.navigate('updatePlan')}>
                  <View>{renderMemberCard(member)}</View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
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
    top: 6,
  },
  expiryDate: {
    fontSize: 12,
    color: COLORS.lightRed, // Expiry date in red
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
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  packageContainer: {
    width: 240,
    backgroundColor: '#fff',
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  packageContent: {
    padding: 15,
    alignItems: 'center',
  },
  packageTitle: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  packageSubtitle: {
    color: COLORS.gray,
    fontSize: 14,
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

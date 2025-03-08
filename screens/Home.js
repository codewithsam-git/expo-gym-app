import React, { useEffect, useState } from 'react';
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
  const handleAddMemberClick = () => {
    navigation.navigate('addMember');
  };

  const handleViewMemberClick = () => {
    navigation.navigate('viewMember');
  };

  const profileData = {
    name: 'Username',
    point: 200,
  };

  const bookOtherWordsForHome = {
    id: 1,
    bookName: 'Other Words For Home',
    bookCover: images.gym1,
    rating: 4.5,
    language: 'Eng',
    pageNo: 341,
    author: 'Jasmine Warga',
    genre: ['Romance', 'Adventure', 'Drama'],
    readed: '12k',
    description:
      "Jude never thought she’d be leaving her beloved older brother and father behind, all the way across the ocean in Syria. But when things in her hometown start becoming volatile, Jude and her mother are sent to live in Cincinnati with relatives. At first, everything in America seems too fast and too loud. The American movies that Jude has always loved haven’t quite prepared her for starting school in the US—and her new label of 'Middle Eastern,' an identity she’s never known before. But this life also brings unexpected surprises—there are new friends, a whole new family, and a school musical that Jude might just try out for. Maybe America, too, is a place where Jude can be seen as she really is.",
    backgroundColor: 'rgba(240,240,232,0.9)',
    navTintColor: '#000',
  };

  const bookTheMetropolis = {
    id: 2,
    bookName: 'The Metropolis',
    bookCover: images.gym2,
    rating: 4.1,
    language: 'Eng',
    pageNo: 272,
    author: 'Seith Fried',
    genre: ['Adventure', 'Drama'],
    readed: '13k',
    description:
      "In Metropolis, the gleaming city of tomorrow, the dream of the great American city has been achieved. But all that is about to change, unless a neurotic, rule-following bureaucrat and an irreverent, freewheeling artificial intelligence can save the city from a mysterious terrorist plot that threatens its very existence. Henry Thompson has dedicated his life to improving America's infrastructure as a proud employee of the United States Municipal Survey. So when the agency comes under attack, he dutifully accepts his unexpected mission to visit Metropolis looking for answers. But his plans to investigate quietly, quickly, and carefully are interrupted by his new partner: a day-drinking know-it-all named OWEN, who also turns out to be the projected embodiment of the agency's supercomputer. Soon, Henry and OWEN are fighting to save not only their own lives and those of the city's millions of inhabitants, but also the soul of Metropolis. The Municipalists is a thrilling, funny, and touching adventure story, a tour-de-force of imagination that trenchantly explores our relationships to the cities around us and the technologies guiding us into the future.",
    backgroundColor: 'rgba(247,239,219,0.9)',
    navTintColor: '#000',
  };

  const bookTheTinyDragon = {
    id: 3,
    bookName: 'The Tiny Dragon',
    bookCover: images.gym3,
    rating: 3.5,
    language: 'Eng',
    pageNo: 110,
    author: 'Ana C Bouvier',
    genre: ['Drama', 'Adventure', 'Romance'],
    readed: '13k',
    description:
      'This sketchbook for kids is the perfect tool to improve your drawing skills! Designed to encourage kids around the world to express their uniqueness through drawing, sketching or doodling, this sketch book is filled with 110 high quality blank pages for creations. Add some fun markers, crayons, and art supplies and you have the perfect, easy gift for kids!',
    backgroundColor: 'rgba(119,77,143,0.9)',
    navTintColor: '#FFF',
  };

  const myBooksData = [
    {
      ...bookOtherWordsForHome,
      completion: '75%',
      lastRead: '3d 5h',
    },
    {
      ...bookTheMetropolis,
      completion: '23%',
      lastRead: '10d 5h',
    },
    {
      ...bookTheTinyDragon,
      completion: '10%',
      lastRead: '1d 2h',
    },
  ];

  const categoriesData = [
    {
      id: 1,
      categoryName: 'Cardio Equipment',
      books: [bookOtherWordsForHome, bookTheMetropolis, bookTheTinyDragon],
    },
    {
      id: 2,
      categoryName: 'Strength Training',
      books: [bookTheMetropolis],
    },
    {
      id: 3,
      categoryName: 'Fitness Trends',
      books: [bookTheTinyDragon],
    },
  ];

  const [profile, setProfile] = React.useState(profileData);
  const [myBooks, setMyBooks] = React.useState(myBooksData);
  const [categories, setCategories] = React.useState(categoriesData);
  const [selectedCategory, setSelectedCategory] = React.useState(1);

  const plans = [
    { id: '1', name: 'Basic Plan', image: 'https://example.com/basic.png' },
    { id: '2', name: 'Premium Plan', image: 'https://example.com/premium.png' },
    {
      id: '3',
      name: 'Ultimate Plan',
      image: 'https://example.com/ultimate.png',
    },
    { id: '4', name: 'Family Plan', image: 'https://example.com/family.png' },
    { id: '5', name: 'Student Plan', image: 'https://example.com/student.png' },
  ];

  const renderPlanItem = ({ item }) => (
    <TouchableOpacity
      style={{ marginRight: SIZES.padding, alignItems: 'center' }}>
      <Image
        source={{ uri: item.image }}
        style={{
          width: 180,
          height: 150,
          borderRadius: 16,
          marginBottom: SIZES.base,
          borderWidth: 2,
          borderColor: COLORS.primary,
        }}
      />
      <Text
        style={{ ...FONTS.body3, color: COLORS.white, textAlign: 'center' }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  function renderHeader(profile) {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: SIZES.padding,
          alignItems: 'center',
        }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={icons.menu_icon} // You can use any menu icon for the drawer
              style={styles.menuIcon}
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>Home</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ marginRight: SIZES.padding }}>
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>Hello,</Text>
            <Text style={{ ...FONTS.h2, color: COLORS.white }}>
              {profile.name}
            </Text>
          </View>
        </View>

        {/* Points */}
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            height: 40,
            paddingLeft: 3,
            paddingRight: SIZES.radius,
            borderRadius: 20,
          }}
          // onPress={() => { console.log("Point") }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 30,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 25,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <Image
                source={icons.plus_icon}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </View>

            <Text
              style={{
                marginLeft: SIZES.base,
                color: COLORS.white,
                ...FONTS.body3,
              }}>
              {profile.point} point
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function renderButtonSection() {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', padding: SIZES.padding }}>
        <View
          style={{
            flexDirection: 'row',
            height: 70,
            backgroundColor: COLORS.secondary,
            borderRadius: SIZES.radius,
          }}>
          {/* Claim */}
          <TouchableOpacity
            style={{ flex: 1 }}
            // onPress={() => console.log("Claim")}
            onPress={handleAddMemberClick}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={icons.claim_icon}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                }}
              />
              <Text
                style={{
                  marginLeft: SIZES.base,
                  ...FONTS.body3,
                  color: COLORS.white,
                }}>
                Add
              </Text>
            </View>
          </TouchableOpacity>

          {/* Divider */}
          <LineDivider />

          {/* Get Point */}
          <TouchableOpacity
            style={{ flex: 1 }}
            // onPress={() => console.log("Get Point")}
            onPress={handleViewMemberClick}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={icons.point_icon}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                }}
              />
              <Text
                style={{
                  marginLeft: SIZES.base,
                  ...FONTS.body3,
                  color: COLORS.white,
                }}>
                View
              </Text>
            </View>
          </TouchableOpacity>

          {/* Divider */}
          <LineDivider />

          {/* My Card */}
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => console.log('My Card')}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={icons.card_icon}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                }}
              />
              <Text
                style={{
                  marginLeft: SIZES.base,
                  ...FONTS.body3,
                  color: COLORS.white,
                }}>
                My Card
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderCategoryData = ({ data }) => {
    // Render each item in the list
    const renderItem = ({ item }) => (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.package_name}</Text>
      </View>
    );

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

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
              250
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
              Total Trainers
            </Text>
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.white,
                fontWeight: 'bold',
              }}>
              30
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
              Active Members
            </Text>
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.white,
                fontWeight: 'bold',
              }}>
              200
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
              Inactive Members
            </Text>
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.white,
                fontWeight: 'bold',
              }}>
              50
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
          flex: 1,
          marginVertical: SIZES.base,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            paddingHorizontal: SIZES.base,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <FontAwesome
            name="tag"
            size={20}
            color={COLORS.white}
            style={{ marginRight: SIZES.base }}
          />
          <Text style={{ ...FONTS.h3, color: COLORS.white }}>Packages</Text>
        </View>
      </View>
    );
  }

  function renderMemberExpiryTitleSection() {
    return (
      <View
        style={{
          flex: 1,
          marginVertical: SIZES.base,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            paddingHorizontal: SIZES.base,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon
            name="calendar-outline"
            size={20}
            color={COLORS.white}
            style={{ marginRight: SIZES.base }}
          />
          <Text style={{ ...FONTS.h3, color: COLORS.white }}>
            Members with Expiring Plans
          </Text>
        </View>
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

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        console.log(`${BASE_URL}/members`);
        const response = await fetch(`${BASE_URL}/members`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMembers(data.memberData);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchMembers();
  }, [members]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        console.log(`${BASE_URL}/get-packages`);
        const response = await fetch(`${BASE_URL}/get-packages`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('packages data: ', data.memberData);
        setPackages(data.memberData);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchPackages();
  }, [packages]);

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
            <Text style={styles.memberPlan}>{member.planName}</Text>
          </View>

          <View style={styles.expiryContainer}>
            <View></View>
            <View>
              <Text style={styles.expiryDate}>Expiry: {member.end_date}</Text>
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
        <View>{renderMyBookSection(myBooks)}</View>

        <View>
          <View>{renderPackagesTitleSection()}</View>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {packages.length === 0 ? (
              <Text style={{ color: COLORS.lightGray, textAlign: 'center' }}>
                No packages found
              </Text>
            ) : (
              <FlatList
                data={packages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.packageItem} // Wrap TouchableOpacity for spacing
                  >
                    <View style={styles.packageContainer}>
                      <Image
                        source={images.gym1}
                        style={styles.itemImage}
                        resizeMode="cover"
                      />
                      <Text
                        style={{ color: COLORS.white, textAlign: 'center' }}>
                        {item.package_name || 'Package'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                horizontal={true}
                showsHorizontalScrollIndicator={false} // Optionally hide scroll indicator
                contentContainerStyle={styles.flatListContent} // Add style for content container
              />
            )}
          </View>
        </View>

        <View>
          <View>{renderMemberExpiryTitleSection()}</View>
          <View>
            {members.length === 0 && (
              <Text style={{ color: COLORS.lightGray, textAlign: 'center' }}>
                No members found
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20,
    alignItems: 'center',
    backgroundColor: COLORS.black,
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
  memberCard: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    flexDirection: 'column', // To align content in a vertical direction
  },
  memberHeader: {
    flexDirection: 'row', // Aligns items horizontally
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures space between elements
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  memberDetails: {
    flex: 1, // Allows for flexible space usage
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  memberPlan: {
    fontSize: 14,
    color: COLORS.lightGray,
  },
  expiryContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between', // Aligns expiry text to the right
  },
  expiryDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.lightRed, // A color to stand out
  },
  packageItem: {
    marginHorizontal: 10, // Add spacing between items
    alignItems: 'center', // Center content within TouchableOpacity
  },
  packageContainer: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150, // Adjust the height to your preference
    width: 150, // Adjust the width to your preference
  },
  itemImage: {
    width: '100%',
    height: '70%', // Adjust height as needed
    borderRadius: 10,    
  },
  flatListContent: {
    paddingHorizontal: 15, // Add padding to the left and right for better alignment
  },
});

export default Home;

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
    Alert,
    Dimensions,
    Platform
  } from 'react-native';
  import { COLORS, FONTS, SIZES, icons, images } from '../constants';
  import BASE_URL from '../Api/commonApi';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import { useNavigation } from '@react-navigation/native'; // Import useNavigation
  import { useFocusEffect } from '@react-navigation/native';
  import ViewHeader from '../components/ViewHeader';
  import * as Animatable from 'react-native-animatable'; // Import Animatable

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
    const [menuVisibleFor, setMenuVisibleFor] = useState(null);

    const fetchMembers = async () => {
      try {
        console.log(`${BASE_URL}/assets-details`);
        const response = await fetch(`${BASE_URL}/assets-details`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setMembers(data.accounts);
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
        'Are you sure you want to delete this asset?',
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
                console.log(`${BASE_URL}/delete-assets?id=${id}`);
                const response = await fetch(
                  `${BASE_URL}/delete-assets?id=${id}`
                );

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
                alert('Failed to delete the asset. Please try again.');
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
            animation="fadeInUp"
            duration={800}
            delay={index * 100}
            style={styles.memberCard}>
            {/* Avatar Section */}

            {/* Member Details Section */}
            <Animatable.View style={styles.memberDetails} activeOpacity={0.7}>
              <Animatable.Text
                style={styles.memberName}>
                {member.asset_name}
              </Animatable.Text>
              <Animatable.Text delay={200} style={styles.memberPlan}>
                Type: {member.asset_type}
              </Animatable.Text>
              <Animatable.Text delay={200} style={styles.memberPlan}>
                Date: {member.purchase_date}
              </Animatable.Text>
              <Animatable.Text delay={200} style={styles.memberPlan}>
                Price: {member.purchase_price}
              </Animatable.Text>
            </Animatable.View>

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
                    navigation.navigate('editAsset', { assetId: member.id });
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
            <ViewHeader headerTitle="Asset" navigateTo="addAsset" />
          </Animatable.View>

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
                    contentContainerStyle={{
                      flexGrow: 1,
                      paddingBottom: Platform.OS === 'ios' ? 120 : 200,
                    }}
                    scrollEnabled={true}>
                    {members.map((member, index) => (
                      <View key={member.id}>
                        {renderMemberCard(member, index)}
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
    memberDetails: {
      flex: 1,
      marginLeft: 12,
    },
    memberName: {
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.primary,
    },
    memberPlan: {
      fontSize: 14,
      color: COLORS.lightGray4,
      marginTop: 4,
    },
    menuButton: {
      position: 'absolute',
      top: SIZES.base,
      right: SIZES.base,
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

  export default ViewAssets;

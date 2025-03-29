import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS, FONTS, SIZES } from '../constants';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../Api/commonApi';
import { useFocusEffect } from '@react-navigation/native';

const Profile = ({ route }) => {
  const navigation = useNavigation();
  const { memberId } = route.params;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [planName, setPlanName] = useState('');
  const [charges, setCharges] = useState('123');
  const [address, setAddress] = useState('');
  const [discount, setDiscount] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const fetchMemberById = async () => {
    try {
      console.log(`${BASE_URL}/edit-members?id=${memberId}`);
      const response = await fetch(`${BASE_URL}/edit-members?id=${memberId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const fetchedMember = data.memberDatabyId;
      setFirstName(fetchedMember.name);
      setLastName(fetchedMember.surname);
      setGender(fetchedMember.gender);
      setBirthdate(fetchedMember.birthdate);
      setEmail(fetchedMember.email);
      setMobileNo(fetchedMember.phoneno);
      setCountry(fetchedMember.country);
      setCity(fetchedMember.city);
      setAddress(fetchedMember.address);
      setPlanName(fetchedMember.package_name);
      setCharges(fetchedMember.packagePrice.toString());
      setDiscount(fetchedMember.discountFinalPrice.toString());
      setDuration(fetchedMember.duration);
      setStartDate(fetchedMember.start_Date);
      setEndDate(fetchedMember.end_date);
      setStatus(fetchedMember.memberStatus);
      setImageUri(fetchMemberById.profile_image);
    } catch (err) {
      console.error('Fetch error:', err);
      setSkeletonLoader(false);
    }
  };

  useEffect(() => {
    fetchMemberById();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMemberById();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {/* Header Section */}

        <View style={styles.headerSection}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backIconContainer}>
            <Icon name="arrow-back" size={30} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
          {/* Profile Header Section */}
          <View style={styles.profileHeader}>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgzPKFziefwggi6URHF_ApNhe9okKizqq4lRBjzG9QQ5--_Ch0Iq9IUtPONEw9-SeKlqs&usqp=CAU',
              }}
              style={styles.profileHeaderImage}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.sectionTitle}>{firstName}</Text>
              <Icon
                name="pencil"
                size={20}
                color={COLORS.white}
                onPress={() =>
                  navigation.navigate('editMember', { memberId: memberId })
                }
              />
            </View>
          </View>
          {/* Social Icons Section */}
          {/*<View style={styles.iconContainer}>
            <TouchableOpacity style={styles.iconWrapper}>
              <Icon name="call" size={30} color={COLORS.white} />
              <Text style={styles.iconLabel}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper}>
              <Icon name="logo-whatsapp" size={30} color={COLORS.white} />
              <Text style={styles.iconLabel}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper}>
              <Icon name="reload" size={30} color={COLORS.white} />
              <Text style={styles.iconLabel}>Renew</Text>
            </TouchableOpacity>
          </View>*/}
          <View style={styles.cardContainer}>
            {/* Title Section */}
            <Text style={styles.title}>Personal Info</Text>

            <View style={styles.separator}></View>

            <View style={styles.row}>
              {/* Left Column (4 fields) */}
              <View style={styles.column}>
                <View style={styles.field}>
                  <Icon
                    name="person-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.icon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Full Name:</Text>
                    <Text style={styles.value}>
                      {firstName} {lastName}
                    </Text>
                  </View>
                </View>

                <View style={styles.field}>
                  <Icon
                    name="male-female"
                    size={20}
                    color={COLORS.primary}
                    style={styles.icon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Gender:</Text>
                    <Text style={styles.value}>{gender}</Text>
                  </View>
                </View>
                <View style={styles.field}>
                  <Icon
                    name="calendar-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.icon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Birthdate:</Text>
                    <Text style={styles.value}>{birthdate}</Text>
                  </View>
                </View>
              </View>

              {/* Right Column (4 fields) */}
              <View style={styles.column1}>
                <View style={styles.field}>
                  <Icon
                    name="mail-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.icon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{email}</Text>
                  </View>
                </View>

                <View style={styles.field}>
                  <Icon
                    name="call-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.icon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Phone No:</Text>
                    <Text style={styles.value}>{mobileNo}</Text>
                  </View>
                </View>

                <View style={styles.field}>
                  <FontAwesome
                    name="building"
                    size={20}
                    color={COLORS.primary}
                    style={styles.icon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Location: </Text>
                    <Text style={styles.value}>
                      {country}, {city}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <Text style={styles.title}>Status</Text>
            <View style={styles.separator}></View>
            <View style={styles.row}>
              <View style={styles.column}>
                <View style={styles.field}>
                  <Icon
                    name="alert-circle-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.icon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Status:</Text>
                    <Text style={styles.value}>{status}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <Text style={styles.title}>Plan Dates</Text>
            <View style={styles.separator}></View>
            <View style={styles.row}>
              <View style={styles.column}>
                <View style={styles.field}>
                  <Icon
                    name="calendar-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.icon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Start Date:</Text>
                    <Text style={styles.value}>{startDate}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.column1}>
                <View style={styles.field}>
                  <Icon
                    name="calendar-clear-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.icon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>End Date:</Text>
                    <Text style={styles.value}>{endDate}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <Text style={styles.title}>Payment Details</Text>
            <View style={styles.separator}></View>
            <View style={styles.row}>
              <View style={styles.column}>
                <View style={styles.field}>
                  <Icon
                    name="cash-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.icon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Charges:</Text>
                    <Text style={styles.value}>
                      {parseFloat(charges).toLocaleString('en-IN')}
                      /-
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.column1}>
                <View style={styles.field}>
                  <Icon
                    name="pricetag-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.icon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Discount:</Text>
                    <Text style={styles.value}>
                      {parseFloat(discount).toLocaleString('en-IN')}
                      /-
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerSection: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderBottomLeftRadius: '15%',
    borderBottomRightRadius: '15%',
  },
  backIconContainer: {
    position: 'absolute',
    top: 10, // Position it at the top of the image
    left: 10, // Position it to the left of the image
    zIndex: 1, // Make sure the icon is above the image
  },
  profileHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
  },
  profileImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  profileHeaderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: COLORS.black,
    zIndex: 1,
  },
  userName: {
    ...FONTS.h2,
    color: COLORS.white,
    marginTop: SIZES.base,
  },
  profileContainer: {
    padding: SIZES.base,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLabel: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    padding: SIZES.base,
  },
  cardContainer: {
    borderRadius: 10,
    padding: SIZES.base,
    marginTop: SIZES.font,
    backgroundColor: '#202428',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '40%',
    marginRight: 10, // Space between columns
  },
  column1: {
    width: '60%',
    marginRight: 10, // Space between columns
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {},
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  value: {
    fontSize: 16,
    color: COLORS.white,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.base,
  },
  generateBillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: SIZES.base * 1.5,
    borderRadius: 10,
    marginVertical: SIZES.base,
  },
  generateBillText: {
    ...FONTS.body3,
    color: COLORS.white,
    marginLeft: SIZES.base,
  },
});

export default Profile;

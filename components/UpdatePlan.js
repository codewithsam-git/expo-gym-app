import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS, FONTS, SIZES } from '../constants';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../Api/commonApi';

const UpdatePlan = ({ route }) => {
  const navigation = useNavigation();
  const { memberId } = route.params;

  const [choosePlan, setChoosePlan] = useState([]);
  const [members, setMembers] = useState({});
  const [charges, setCharges] = useState('');
  const [discount, setDiscount] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [planName, setPlanName] = useState('');
  const [isPlanNameFocus, setIsPlanNameFocus] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const fetchMemberById = async () => {
    try {
      const response = await fetch(`${BASE_URL}/update-plan?id=${memberId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const fetchedMember = data.updatePlanData;
      setMembers(data.updatePlanData);
      const packageOptions = data.getPackagesDropdown.map((pkg) => ({
        label: pkg.package_name,
        value: pkg.package_name,
        charges: pkg.package_amount,
        discount: pkg.discount,
        duration: pkg.package_duration,
      }));
      setChoosePlan(packageOptions);
      // setPlanName(data.updatePlanData.package_name);
      setFirstName(fetchedMember.name);
      setLastName(fetchedMember.surname);
      setGender(fetchedMember.gender);
      setBirthdate(fetchedMember.birthdate);
      setEmail(fetchedMember.email);
      setMobileNo(fetchedMember.phoneno);
      setCountry(fetchedMember.country);
      setCity(fetchedMember.city);
      setAddress(fetchedMember.address);
      // setCharges(fetchedMember.packagePrice.toString());
      // setDiscount(fetchedMember.discountFinalPrice.toString());
      setDuration(fetchedMember.duration);
      // setStartDate(fetchedMember.start_Date);
      // setEndDate(fetchedMember.end_date);
      setImageUri(fetchedMember.profile_image);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchMemberById();
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if (!date) return;
    setStartDate(date);
    const formatDate = (dateObj) => {
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${year}-${month}-${day}`;
    };

    const startDateFormatted = formatDate(date);
    setStartDate(startDateFormatted);

    let endDateObj = new Date(date);

    if (duration) {
      const durationMatch = duration.match(/^(\d+)([my])$/);
      if (durationMatch) {
        const durationValue = parseInt(durationMatch[1]);
        const durationUnit = durationMatch[2];

        if (durationUnit === 'm') {
          endDateObj.setMonth(endDateObj.getMonth() + durationValue);
        } else if (durationUnit === 'y') {
          endDateObj.setFullYear(endDateObj.getFullYear() + durationValue);
        }
      }
    }

    setEndDate(formatDate(endDateObj));
    hideDatePicker();
  };

  const handlePackageChange = (item) => {
    setPlanName(item.value);
    setCharges(item.charges.toString());
    setDiscount(item.discount.toString());
    setDuration(item.duration);
    setIsPlanNameFocus(false);

    if (!startDate) return;

    let endDateObj = new Date(startDate);

    if (item.duration) {
      const durationMatch = item.duration.match(/^(\d+)([my])$/);
      if (durationMatch) {
        const durationValue = parseInt(durationMatch[1]);
        const durationUnit = durationMatch[2];

        if (durationUnit === 'm') {
          endDateObj.setMonth(endDateObj.getMonth() + durationValue);
        } else if (durationUnit === 'y') {
          endDateObj.setFullYear(endDateObj.getFullYear() + durationValue);
        }
      }
    }

    const formatDate = (dateObj) => {
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${year}-${month}-${day}`;
    };

    setEndDate(formatDate(endDateObj));
  };

  const memberData = {
    member_id: memberId,
    name: firstName,
    surname: lastName,
    gender: gender,
    birthdate: birthdate,
    email: email,
    phoneno: mobileNo,
    country: country,
    city: city,
    package_name: planName,
    packagePrice: charges,
    discountFinalPrice: discount,
    address: address,
    duration: duration,
    start_Date: startDate,
    end_date: endDate,
    memberStatus: 'Active',
    profile_image: imageUri || 'img.jpg',
  };

  const handleUpdate = async () => {
    if (!planName) {
      Alert.alert("Please Select Your Plan");
      return;
    }

    if (!startDate) {
      Alert.alert("Please Select Start Date");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/update-plan-save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        Alert.alert(
          'Success',
          'Member Updated successfully!',
          [{ text: 'OK' }],
          {
            cancelable: false,
          }
        );
        navigation.goBack();
      } else {
        throw new Error('Failed to add member');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to update member, please try again');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: `https://gym.cronicodigital.com/uploads/membersImage/${imageUri}`,
          }}
          style={styles.profileHeaderImage}
        />
        <View>
          <Text style={styles.sectionTitle}>Samarth Bhandare</Text>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.cardContainer}>
          {/* Title Section */}
          <Text style={styles.title}>Current Plan</Text>

          <View style={styles.separator}></View>

          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.field}>
                <Icon
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Plan Name:</Text>
                  <Text style={styles.value}>{members.package_name}</Text>
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
                  <Text style={styles.value}>{members.gender}</Text>
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
                  <Text style={styles.label}>Start Date:</Text>
                  <Text style={styles.value}>{members.start_Date}</Text>
                </View>
              </View>
            </View>

            {/* Right Column (4 fields) */}
            <View style={styles.column1}>
              {/*<View style={styles.field}>
                <Icon
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Duration:</Text>
                  <Text style={styles.value}>3 Months</Text>
                </View>
              </View>*/}

              <View style={styles.field}>
                <FontAwesome
                  name="rupee"
                  size={20}
                  color={COLORS.primary}
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Charges:</Text>
                  <Text style={styles.value}>{members.packagePrice}</Text>
                </View>
              </View>

              <View style={styles.field}>
                <FontAwesome
                  name="tag"
                  size={20}
                  color={COLORS.primary}
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Discount:</Text>
                  <Text style={styles.value}>{members.discountFinalPrice}</Text>
                </View>
              </View>

              <View style={styles.field}>
                <Icon
                  name="time-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>End Date:</Text>
                  <Text style={styles.value}>{members.end_date}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.formContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Text style={styles.formTitle}>Update Your Plan</Text>
              <View style={styles.inputContainer}>
                <FontAwesome
                  name="credit-card"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <Dropdown
                  style={[styles.input, isPlanNameFocus]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  data={choosePlan}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isPlanNameFocus ? 'Select Plan' : '...'}
                  searchPlaceholder="Search..."
                  value={planName}
                  onFocus={() => setIsPlanNameFocus(true)}
                  onBlur={() => setIsPlanNameFocus(false)}
                  // onChange={(item) => {
                  //   setPlanName(item.value);
                  //   setIsPlanNameFocus(false);
                  // }}
                  onChange={handlePackageChange}
                />
              </View>

              <View style={styles.inputContainer}>
                <FontAwesome
                  name="dollar"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Charges"
                  placeholderTextColor={COLORS.lightGray}
                  value={charges}
                  onChangeText={setCharges}
                  style={styles.input}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <FontAwesome
                  name="tag"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Discount"
                  placeholderTextColor={COLORS.lightGray}
                  value={discount}
                  onChangeText={setDiscount}
                  style={styles.input}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <TouchableOpacity
                  onPress={showDatePicker}
                  style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name="calendar"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  {startDate ? (
                    <Text style={[styles.input, { color: COLORS.white }]}>
                      {startDate || 'Select Start Date'}{' '}
                    </Text>
                  ) : (
                    <Text style={[styles.input, { color: COLORS.lightGray }]}>
                      {startDate || 'Select Start Date'}{' '}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name="calendar"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  {endDate ? (
                    <Text style={[styles.input, { color: COLORS.white }]}>
                      {endDate || 'Select End Date'}{' '}
                    </Text>
                  ) : (
                    <Text style={[styles.input, { color: COLORS.lightGray }]}>
                      {endDate || 'Select End Date'}{' '}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.downloadButton]}
          onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  profileHeader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: COLORS.black,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    padding: SIZES.base,
  },
  cardContainer: {
    borderRadius: 10,
    padding: SIZES.radius,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.lightGray4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '60%',
    marginRight: 10, // Space between columns
  },
  column1: {
    width: '40%',
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
  formTitle: {
    fontSize: 20, // Title size
    fontWeight: 'bold',
    color: COLORS.lightGray4,
    marginVertical: SIZES.font,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    paddingVertical: 10,
    color: COLORS.white,
    ...FONTS.body3,
  },
  expirationMessage: {
    padding: SIZES.base,
  },
  expiryText: {
    fontSize: 14,
    color: COLORS.lightRed,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    margin: SIZES.font,
    height: 'auto',
  },
  placeholderStyle: {
    fontSize: 16,
    color: COLORS.lightGray,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: COLORS.white,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: '#202428',
  },
  actionButton: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#444',
  },
  downloadButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
});

export default UpdatePlan;

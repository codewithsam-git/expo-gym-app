import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS, FONTS, SIZES } from '../constants';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Header from './Header';
import { useNavigation } from '@react-navigation/native';

const UpdatePlan = () => {
  const navigation = useNavigation();
  const [choosePlan, setChoosePlan] = useState('Gold');
  const [charges, setCharges] = useState('299');
  const [discount, setDiscount] = useState('50');
  const [duration, setDuration] = useState('3 months');
  const [startDate, setStartDate] = useState('01/03/2025');
  const [endDate, setEndDate] = useState('01/04/2025');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDurationFocus, setIsDurationFocus] = useState(false);
  const [planName, setPlanName] = useState('');
  const [isPlanNameFocus, setIsPlanNameFocus] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDurationChange = (item) => {
    setDuration(item.value);
    setIsDurationFocus(false);

    if (!startDate) return; // Only update endDate if startDate is selected

    const startDateObj = new Date(startDate.split('-').reverse().join('-')); // Convert "DD-MM-YYYY" to "YYYY-MM-DD"

    if (isNaN(startDateObj)) {
      console.log('Invalid start date');
      return;
    }

    let endDateObj = new Date(startDateObj);

    if (item.value.endsWith('month') || item.value.endsWith('months')) {
      const monthsToAdd = parseInt(item.value);
      endDateObj.setMonth(endDateObj.getMonth() + monthsToAdd);
    } else if (item.value.endsWith('year')) {
      const yearsToAdd = parseInt(item.value);
      endDateObj.setFullYear(endDateObj.getFullYear() + yearsToAdd);
    }

    const formatDate = (dateObj) => {
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = dateObj.getFullYear();
      return `${day}-${month}-${year}`;
    };

    setEndDate(formatDate(endDateObj));
  };

  const handleConfirm = (date) => {
    if (!date) return;

    const startDateObj = new Date(date);
    if (isNaN(startDateObj)) {
      console.log('Invalid date');
      return;
    }

    const formatDate = (dateObj) => {
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = dateObj.getFullYear();
      return `${day}-${month}-${year}`;
    };

    setStartDate(formatDate(startDateObj));

    let endDateObj = new Date(startDateObj);

    if (duration.endsWith(' month') || duration.endsWith(' months')) {
      const monthsToAdd = parseInt(
        duration.replace(' month', '').replace(' months', '').trim()
      );
      endDateObj.setMonth(endDateObj.getMonth() + monthsToAdd);
    } else if (duration.endsWith('year')) {
      const yearsToAdd = parseInt(
        duration.replace(' year', '').replace(' years', '').trim()
      );
      endDateObj.setFullYear(endDateObj.getFullYear() + yearsToAdd);
    }

    setEndDate(formatDate(endDateObj));

    hideDatePicker();
  };

  const handleUpdate = () => {
    alert('Plan Updated Successfully');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgzPKFziefwggi6URHF_ApNhe9okKizqq4lRBjzG9QQ5--_Ch0Iq9IUtPONEw9-SeKlqs&usqp=CAU',
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
                  <Text style={styles.value}>Silver</Text>
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
                  <Text style={styles.label}>Charges:</Text>
                  <Text style={styles.value}>2999/-</Text>
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
                  <Text style={styles.value}>01 Jan 2025</Text>
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
                  <Text style={styles.label}>Duration:</Text>
                  <Text style={styles.value}>3 Months</Text>
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
                  <Text style={styles.label}>Discount:</Text>
                  <Text style={styles.value}>20%</Text>
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
                  <Text style={styles.label}>Start Date:</Text>
                  <Text style={styles.value}>01 Apr 2025</Text>
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
                  data={[
                    { label: 'Silver', value: 'Silver' },
                    { label: 'Gold', value: 'Gold' },
                    { label: 'Diamond', value: 'Diamond' },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isPlanNameFocus ? 'Select Plan' : '...'}
                  searchPlaceholder="Search..."
                  value={planName}
                  onFocus={() => setIsPlanNameFocus(true)}
                  onBlur={() => setIsPlanNameFocus(false)}
                  onChange={(item) => {
                    setPlanName(item.value);
                    setIsPlanNameFocus(false);
                  }}
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
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon
                  name="calendar"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <Dropdown
                  style={[styles.input, isDurationFocus]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  data={[
                    { label: '1 month', value: '1 month' },
                    { label: '3 months', value: '3 months' },
                    { label: '6 months', value: '6 months' },
                    { label: '1 year', value: '1 year' },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isDurationFocus ? 'Select Duration' : '...'}
                  searchPlaceholder="Search..."
                  value={duration}
                  onFocus={() => setIsDurationFocus(true)}
                  onBlur={() => setIsDurationFocus(false)}
                  onChange={handleDurationChange}
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
            console.log(navigation);
            navigation.goBack();
          }}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.downloadButton]}
          onPress={() => console.log('update')}>
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
    marginTop: 20,
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

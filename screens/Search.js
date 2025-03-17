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
import { COLORS, FONTS, SIZES, icons } from '../constants';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; // Make sure to install expo-linear-gradient
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'; // For animations

const Search = () => {
  const navigation = useNavigation();
  const [packageName, setPackageName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showDatePicker1 = () => {
    setDatePickerVisibility1(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideDatePicker1 = () => {
    setDatePickerVisibility1(false);
  };

  const handleConfirm = (date) => {
    if (!date) return;

    const startDateObj = new Date(date);
    const formatDate = (dateObj) => {
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}-${month}-${year}`;
    };

    setStartDate(formatDate(startDateObj));
    hideDatePicker();
  };

  const handleConfirm1 = (date) => {
    if (!date) return;

    const endDateObj = new Date(date);
    const formatDate = (dateObj) => {
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}-${month}-${year}`;
    };

    setEndDate(formatDate(endDateObj));
    hideDatePicker1();
  };

  const calculateRevenue = () => {
    let revenue = 0;
    let packageDetails = {
      Silver: { charges: 1000 },
      Gold: { charges: 2000 },
      Diamond: { charges: 5000 },
    };

    if (packageName) {
      revenue = packageDetails[packageName].charges;
    }

    // Example: If we are calculating for a specific period, you can multiply by months or years.
    if (startDate && endDate) {
      const start = new Date(startDate.split('-').reverse().join('-'));
      const end = new Date(endDate.split('-').reverse().join('-'));

      const diffInTime = end.getTime() - start.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24); // Difference in days
      const diffInMonths = Math.floor(diffInDays / 30); // Approximate months

      revenue *= diffInMonths; // Calculate revenue for the specified time period.
    }

    return revenue;
  };

  const revenue = calculateRevenue();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={{
          marginTop: Platform.OS === 'ios' ? 20 : 60,
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: SIZES.padding,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                source={icons.menu_icon} // You can use any menu icon for the drawer
                style={styles.menuIcon}
              />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.header}> </Text>
          </View>

          <View style={styles.headerSection}>
            <Text style={styles.header}>Revenue</Text>
          </View>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.cardContainer}>
          <View style={styles.formContainer}>
            <ScrollView contentContainerStyle={styles.scrollView}>
              <Text style={styles.title}>Select Plan & Date</Text>
              <View style={styles.separator}></View>

              {/* Package Dropdown */}
              <View style={styles.inputContainer}>
                <FontAwesome
                  name="credit-card"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <Dropdown
                  style={styles.input}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={[
                    { label: 'Silver', value: 'Silver' },
                    { label: 'Gold', value: 'Gold' },
                    { label: 'Diamond', value: 'Diamond' },
                  ]}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Plan"
                  value={packageName}
                  onChange={(item) => setPackageName(item.value)}
                />
              </View>

              {/* Start and End Date Pickers */}
              <View style={styles.date}>
                {/* Start Date Picker */}
                <View style={[styles.dateInput, { marginRight: 5 }]}>
                  <TouchableOpacity
                    onPress={() => showDatePicker()}
                    style={styles.touchable}>
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
                      <Text style={[styles.input, { color: COLORS.lightGray4 }]}>
                        {startDate || 'Select Start Date'}{' '}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/* End Date Picker */}
                <View style={[styles.dateInput, { marginLeft: 5 }]}>
                  <TouchableOpacity
                    onPress={() => showDatePicker1()}
                    style={styles.touchable}>
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
                      <Text style={[styles.input, { color: COLORS.lightGray4 }]}>
                        {endDate || 'Select End Date'}{' '}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date Picker Modal */}
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />

              <DateTimePickerModal
                isVisible={isDatePickerVisible1}
                mode="date"
                onConfirm={handleConfirm1}
                onCancel={hideDatePicker1}
              />

              {/* Selected Filter Section */}
              <View style={styles.revenueContainer}>
                <Text style={styles.title}>Selected Filter</Text>
                <View style={styles.separator}></View>

                {/* Selected Package */}
                <View style={styles.revenueCard}>
                  <Text style={styles.revenueLabel}>Selected Package:</Text>
                  <Text style={styles.revenueValue}>
                    {packageName || 'All'}
                  </Text>
                </View>

                {/* Start Date */}
                <View style={styles.revenueCard}>
                  <Text style={styles.revenueLabel}>Start Date:</Text>
                  <Text style={styles.revenueValue}>
                    {startDate || 'Not Specified'}
                  </Text>
                </View>

                {/* End Date */}
                <View style={styles.revenueCard}>
                  <Text style={styles.revenueLabel}>End Date:</Text>
                  <Text style={styles.revenueValue}>
                    {endDate || 'Not Specified'}
                  </Text>
                </View>
              </View>

              {/* Revenue Calculation Section */}
              <View style={styles.revenueContainer}>
                <Text style={styles.title}>Revenue Calculation</Text>
                <View style={styles.separator}></View>

                {/* Total Revenue */}
                <View style={styles.totalRevenueCard}>
                  <Text style={styles.totalRevenueLabel}>Total Revenue:</Text>
                  <Text style={styles.totalRevenueValue}>999/-</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
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
  headerSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    ...FONTS.h2,
    color: COLORS.white,
  },

  cardContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  formContainer: {
    padding: 20,
  },
  scrollView: {
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.lightGray4,
    marginTop: 8,
    marginBottom: 8,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: COLORS.white,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,    
    marginBottom: 10,
    padding: 10,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.secondary
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.black,
  },
  placeholderStyle: {
    color: COLORS.lightGray4,
  },
  selectedTextStyle: {
    color: COLORS.white,
  },
  date: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.secondary
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
  },
  revenueContainer: {
    marginBottom: 20,
  },
  revenueCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  revenueLabel: {
    fontSize: 16,
    color: COLORS.white,
  },
  revenueValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.lightGray4,
  },
  totalRevenueCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalRevenueLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  totalRevenueValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default Search;

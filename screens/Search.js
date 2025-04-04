import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS, FONTS, SIZES } from '../constants';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Header from '../components/Header';
import BASE_URL from '../Api/commonApi';
import { LinearGradient } from 'expo-linear-gradient';

const Search = () => {
  const [packageName, setPackageName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [packages, setPackages] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState('0');
  const fetchPackages = async () => {
    try {
      console.log(`${BASE_URL}/packages`);
      const response = await fetch(`${BASE_URL}/packages`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const packageOptions = data.packages.map((pkg) => ({
        label: pkg.package_name,
        value: pkg.package_name,
      }));
      setPackages(packageOptions);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

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

  const formatDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleConfirm = (date) => {
    if (!date) return;
    const startDateObj = new Date(date);
    setStartDate(formatDate(startDateObj));
    hideDatePicker();
  };

  const handleConfirm1 = (date) => {
    if (!date) return;
    const endDateObj = new Date(date);
    setEndDate(formatDate(endDateObj));
    hideDatePicker1();
  };

  const fetchData = async () => {
    try {
      console.log(
        `${BASE_URL}/revenue?package_name=${packageName}&start_date=${startDate}&end_date=${endDate}`
      );
      const response = await fetch(
        `${BASE_URL}/revenue?package_name=${packageName}&start_date=${startDate}&end_date=${endDate}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTotalRevenue(data.totalRevenue);
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [packageName, startDate, endDate]);

  return (
    <SafeAreaView style={styles.safeArea}>
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
          <Header headerTitle="Revenue" />
        </View>

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView>
            <View style={styles.cardContainer}>
              <View style={styles.formContainer}>
                <Text style={styles.title}>Plan & Date</Text>
                <View style={styles.separator}></View>

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
                    data={packages}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Plan"
                    value={packageName}
                    onChange={(item) => setPackageName(item.value)}
                  />
                </View>

                <View style={styles.date}>
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
                        <Text
                          style={[styles.input, { color: COLORS.lightGray4 }]}>
                          {startDate || 'Select Start Date'}{' '}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>

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
                        <Text
                          style={[styles.input, { color: COLORS.lightGray4 }]}>
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

                <View style={styles.revenueContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.title}>Selected Filters</Text>
                    <Text
                      style={styles.removeFilterTitle}
                      onPress={() => {
                        setPackageName('');
                        setStartDate('');
                        setEndDate('');
                      }}>
                      Remove Filter
                    </Text>
                  </View>
                  <View style={styles.separator}></View>

                  <View style={styles.revenueCard}>
                    <Text style={styles.revenueLabel}>Selected Package:</Text>
                    <Text style={styles.revenueValue}>
                      {packageName || 'All'}
                    </Text>
                  </View>

                  <View style={styles.revenueCard}>
                    <Text style={styles.revenueLabel}>Start Date:</Text>
                    <Text style={styles.revenueValue}>
                      {startDate || 'Not Specified'}
                    </Text>
                  </View>

                  <View style={styles.revenueCard}>
                    <Text style={styles.revenueLabel}>End Date:</Text>
                    <Text style={styles.revenueValue}>
                      {endDate || 'Not Specified'}
                    </Text>
                  </View>
                </View>

                <View style={styles.revenueContainer}>
                  <Text style={styles.title}>Revenue Calculation</Text>
                  <View style={styles.separator}></View>

                  <View style={styles.totalRevenueCard}>
                    <Text style={styles.totalRevenueLabel}>Total Revenue:</Text>
                    <Text style={styles.totalRevenueValue}>
                      {parseFloat(totalRevenue).toLocaleString('en-IN')}
                      /-
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </LinearGradient>
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
  removeFilterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.lightRed,
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
    backgroundColor: COLORS.secondary,
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
    backgroundColor: COLORS.secondary,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
  },
  revenueContainer: {
    marginVertical: 20,
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
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: SIZES.base,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Search;

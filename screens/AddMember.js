import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Platform,
  SafeAreaView,
  Dimensions,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { COLORS, FONTS, SIZES, icons } from '../constants';
import Header from '../components/Header';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-date-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import BASE_URL from '../Api/commonApi';
import MemberBill from '../components/MemberBill';
import { useNavigation } from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AddMember = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCountryFocus, setIsCountryFocus] = useState(false);
  const [isGenderFocus, setIsGenderFocus] = useState(false);
  const [isPlanNameFocus, setIsPlanNameFocus] = useState(false);
  const [isDurationFocus, setIsDurationFocus] = useState(false);
  const steps = ['Step 1', 'Step 2'];

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showDatePicker1 = () => {
    setDatePickerVisibility1(true);
  };

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideDatePicker1 = () => {
    setDatePickerVisibility1(false);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
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

  const handleConfirm1 = (date) => {
    setEndDate(date.toLocaleDateString());
    hideDatePicker1();
  };

  const handleConfirm2 = (date) => {
    setBirthdate(date.toLocaleDateString());
    hideDatePicker2();
  };

  const countries = [
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'India', value: 'IN' },
    { label: 'Australia', value: 'AU' },
    { label: 'United Kingdom', value: 'UK' },
  ];

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [planName, setPlanName] = useState('');
  const [charges, setCharges] = useState('');
  const [discount, setDiscount] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState('');
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFirstName('');
    setLastName('');
    setGender('');
    setBirthdate('');
    setEmail('');
    setMobileNo('');
    setCountry('');
    setCity('');
    setPlanName('');
    setCharges('');
    setDiscount('');
    setDuration('');
    setStartDate('');
    setEndDate('');
  }, []);

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const memberData = {
    name: firstName,
    surname: lastName,
    gender: gender,
    birthdate: birthdate,
    email: email,
    phoneno: mobileNo,
    country: country,
    city: city,
    planName: planName,
    charges: charges,
    discount: discount,
    duration: duration,
    start_Date: startDate,
    end_date: endDate,
    status: 1,
    profile_image: 'img.jpg',
  };

  const handleSubmit = async () => {
    if (!memberData.email) {
      Alert.alert('Missing Data', ' Email is mandatory');
      return;
    }

    if (
      memberData.email &&
      !/^[a-z0-9._%+-]+@[a-z]+\.[a-z]{2,4}(\.[a-z]{2,4})?$/.test(
        memberData.email
      )
    ) {
      Alert.alert('Invalid Data', 'Please enter a valid Email Id.');
      return;
    }

    if (!memberData.phoneno) {
      Alert.alert('Missing Data', 'Phone number is mandatory');
      return;
    }

    if (memberData.phoneno && !/^[6-9]\d{9}$/.test(memberData.phoneno)) {
      Alert.alert(
        'Invalid Mobile Number',
        'Please enter a valid phone number.'
      );
      return;
    }
    setLoading(true);
    try {
      console.log(`${BASE_URL}/save-members`);
      const response = await fetch(`${BASE_URL}/save-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      console.log('response: ', response);

      if (response.status === 200) {
        Alert.alert('Success', 'Member added successfully!', [{ text: 'OK' }], {
          cancelable: false,
        });
        console.log('memberData', memberData);

        setFirstName('');
        setLastName('');
        setGender('');
        setBirthdate('');
        setEmail('');
        setMobileNo('');
        setCountry('');
        setCity('');
        setPlanName('');
        setCharges('');
        setDiscount('');
        setDuration('');
        setStartDate('');
        setEndDate('');
        setCurrentStep(0);
        setShowBillingModal(true);
        setLoading(false);
        navigation.navigate('memberBill');
      } else {
        throw new Error('Failed to add member');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to add member, please try again');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ marginTop: Platform.OS === 'ios' ? 20 : 60 }}>
        <Header />
      </View>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.formContainer}>
              {/* Step Indicator */}
              <StepIndicator
                customStyles={{
                  stepIndicatorSize: 40,
                  currentStepIndicatorSize: 50,
                  separatorStrokeWidth: 3,
                  currentStepStrokeWidth: 4,
                  stepStrokeWidth: 3,
                  labelColor: COLORS.white,
                  stepStrokeCurrentColor: '#F1A800', // Light Yellow for current step stroke
                  stepIndicatorCurrentColor: '#F1A800', // Light Yellow for current step
                  stepIndicatorColor: '#F1A800', // Light Yellow for inactive steps
                }}
                stepCount={steps.length}
                currentPosition={currentStep}
                labels={steps}
                onPress={handleStepClick}
              />

              <View style={styles.stepContent}>
                {currentStep === 0 && (
                  <View>
                    <View style={styles.inputContainer}>
                      <Icon
                        name="user"
                        size={20}
                        color={COLORS.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="First Name"
                        placeholderTextColor={COLORS.lightGray}
                        value={firstName}
                        onChangeText={setFirstName}
                        style={styles.input}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Icon
                        name="user"
                        size={20}
                        color={COLORS.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="Last Name"
                        placeholderTextColor={COLORS.lightGray}
                        value={lastName}
                        onChangeText={setLastName}
                        style={styles.input}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Icon
                        name="gender"
                        size={20}
                        color={COLORS.primary}
                        style={styles.inputIcon}
                      />
                      <Dropdown
                        style={[styles.input, isGenderFocus]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={[
                          { label: 'Male', value: 'Male' },
                          { label: 'Female', value: 'Female' },
                          { label: 'Other', value: 'Other' },
                        ]}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isGenderFocus ? 'Select Gender' : '...'}
                        searchPlaceholder="Search..."
                        value={gender}
                        onFocus={() => setIsGenderFocus(true)}
                        onBlur={() => setIsGenderFocus(false)}
                        onChange={(item) => {
                          setGender(item.value);
                          setIsGenderFocus(false);
                        }}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <TouchableOpacity
                        onPress={showDatePicker2}
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                          name="calendar"
                          size={20}
                          color={COLORS.primary}
                          style={styles.inputIcon}
                        />
                        <Text
                          style={[styles.input, { color: COLORS.lightGray }]}>
                          {birthdate || 'Select Birthdate'}{' '}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <DateTimePickerModal
                      isVisible={isDatePickerVisible2}
                      mode="date"
                      onConfirm={handleConfirm2}
                      onCancel={hideDatePicker2}
                    />

                    <View style={styles.inputContainer}>
                      <Icon
                        name="mail"
                        size={20}
                        color={COLORS.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="Email"
                        placeholderTextColor={COLORS.lightGray}
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Icon
                        name="phone"
                        size={20}
                        color={COLORS.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="Mobile No"
                        placeholderTextColor={COLORS.lightGray}
                        value={mobileNo}
                        onChangeText={setMobileNo}
                        style={styles.input}
                        keyboardType="phone-pad"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Icon
                        name="global"
                        size={20}
                        color={COLORS.primary}
                        style={styles.inputIcon}
                      />
                      <Dropdown
                        style={[styles.input, isCountryFocus]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={countries}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isCountryFocus ? 'Select Country' : '...'}
                        searchPlaceholder="Search..."
                        value={country}
                        onFocus={() => setIsCountryFocus(true)}
                        onBlur={() => setIsCountryFocus(false)}
                        onChange={(item) => {
                          setCountry(item.value);
                          setIsCountryFocus(false);
                        }}
                      />
                    </View>
                  </View>
                )}

                {currentStep === 1 && (
                  <View>
                    <View style={styles.inputContainer}>
                      <Icon
                        name="city"
                        size={20}
                        color={COLORS.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="City"
                        placeholderTextColor={COLORS.lightGray}
                        value={city}
                        onChangeText={setCity}
                        style={styles.input}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Icon
                        name="creditcard"
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
                      <Icon
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
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Icon
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
                        placeholder={
                          !isDurationFocus ? 'Select Duration' : '...'
                        }
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
                          <Text
                            style={[styles.input, { color: COLORS.lightGray }]}>
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
                          <Text
                            style={[styles.input, { color: COLORS.lightGray }]}>
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

                    {/*<DateTimePickerModal
                      isVisible={isDatePickerVisible1}
                      mode="date"
                      onConfirm={handleConfirm1}
                      onCancel={hideDatePicker1}
                    />*/}
                  </View>
                )}
              </View>

              <View style={styles.buttons}>
                {/* Navigation Buttons */}
                <TouchableOpacity
                  onPress={prevStep}
                  disabled={currentStep === 0}>
                  <Text
                    style={[
                      { opacity: currentStep === 0 ? 0.5 : 1 },
                      styles.buttonText,
                    ]}>
                    Previous
                  </Text>
                </TouchableOpacity>

                {currentStep < steps.length - 1 ? (
                  <TouchableOpacity onPress={nextStep} disabled={loading}>
                    <Text style={styles.buttonText}>Next</Text>
                  </TouchableOpacity>
                ) : (
                  // Displaying the 'Save & Generate Bill' button or 'Generating...' message
                  <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                    {loading ? (
                      <Text style={[styles.buttonText, {opacity: loading ? 0.5 : 1}]}>Generating...</Text>
                    ) : (
                      <Text style={styles.buttonText}>
                        Save & Generate Bill
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  formContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding2,
    padding: SIZES.font,
    margin: SIZES.padding,
    height: 'auto',
  },
  stepContent: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: COLORS.white,
    borderColor: COLORS.lightGray,
    ...FONTS.body3,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
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
});

export default AddMember;

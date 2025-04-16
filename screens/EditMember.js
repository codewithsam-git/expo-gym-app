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
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Image,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { COLORS, FONTS, SIZES } from '../constants';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import BASE_URL from '../Api/commonApi';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import IMAGES_URL from '../Api/ImagesUrl';

const EditMember = ({ route }) => {
  const { memberId } = route.params;
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCountryFocus, setIsCountryFocus] = useState(false);
  const [isGenderFocus, setIsGenderFocus] = useState(false);
  const [isPlanNameFocus, setIsPlanNameFocus] = useState(false);
  const steps = ['Step 1', 'Step 2', 'Step3'];

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };

  const handleConfirm = (date) => {
    if (!date) return;
    setStartDate(date);

    const startDateFormatted = formatDate(date);
    setDisplayStartDate(formatDisplayDate(date));
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

    setDisplayEndDate(formatDisplayDate(endDateObj));
    setEndDate(formatDate(endDateObj));
    hideDatePicker();
  };

  const handleConfirm2 = (date) => {
    setDisplayBirthDate(formatDisplayDate(date));
    setBirthdate(formatDate(date));
    hideDatePicker2();
  };

  const [countries, setCountries] = useState([]);

  const fetchCountries = async () => {
    try {
      const response = await fetch(
        `https://countriesnow.space/api/v0.1/countries/positions`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const countriesOptions = data.data.map((country) => ({
        label: country.name,
        value: country.name,
      }));
      setCountries(countriesOptions);
    } catch (err) {
      console.log('Error: ', err.message);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const [packages, setPackages] = useState([]);
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
  const [displayStartDate, setDisplayStartDate] = useState();
  const [displayEndDate, setDisplayEndDate] = useState();
  const [displayBirthDate, setDisplayBirthDate] = useState();
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fetchedImg, setFetchedImg] = useState(false);
  const [fetchedImageUri, setFetchedImageUri] = useState('');
  const [fetchedImage, setFetchedImage] = useState(false);

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${BASE_URL}/packages`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const packageOptions = data.packages.map((pkg) => ({
        label: pkg.package_name,
        value: pkg.package_name,
        charges: pkg.package_amount,
        discount: pkg.discount,
        duration: pkg.package_duration,
      }));
      setPackages(packageOptions);
    } catch (err) {
      console.error('Fetch error:', err);
      setSkeletonLoader(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const formatFetchedDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const fetchMemberById = async () => {
    try {
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
      setDisplayBirthDate(formatFetchedDate(fetchedMember.birthdate));

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
      setDisplayStartDate(formatFetchedDate(fetchedMember.start_Date));

      setEndDate(fetchedMember.end_date);
      setDisplayEndDate(formatFetchedDate(fetchedMember.end_date));

      setFetchedImageUri(fetchedMember.profile_image);
      setFetchedImage(true);
    } catch (err) {
      console.error('Fetch error:', err);
      setSkeletonLoader(false);
    }
  };

  useEffect(() => {
    fetchMemberById();
  }, []);

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

    setDisplayEndDate(formatDisplayDate(endDateObj));
    setEndDate(formatDate(endDateObj));
  };

  const formatDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const memberData = {
    id: memberId,
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
  };

  const handleSubmit = async () => {
    if (!memberData.email) {
      Alert.alert('Missing Data', 'Email is mandatory');
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

    const formData = new FormData();

    for (const key in memberData) {
      formData.append(key, memberData[key]);
    }

    if (imageUri) {
      const imageName = imageUri.split('/').pop();
      const imageType = imageUri.split('.').pop();
      formData.append('profile_image', {
        uri: imageUri,
        name: imageName,
        type: `image/${imageType}`,
      });
    }

    try {
      const response = await fetch(`${BASE_URL}/edit-membersData`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Alert.alert(
          'Success',
          'Member updated successfully!',
          [{ text: 'OK' }],
          {
            cancelable: false,
          }
        );
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
        navigation.goBack();
      } else {
        throw new Error('Failed to update member');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to update member, please try again');
      setLoading(false);
    }
  };

  const requestPermission = async (type) => {
    let permissionResult;

    if (type === 'camera') {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.status === 'granted') {
      return true;
    } else {
      Alert.alert(
        'Permission Denied',
        `To access the ${type}, enable permissions in your device settings.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }
  };

  const pickImage = async (source) => {
    const hasPermission = await requestPermission(source);
    if (!hasPermission) return;

    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
    }

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setFetchedImg(true);
      setFetchedImage(false);
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.formContainerWrapper}>
              <View style={styles.formContainer}>
                <StepIndicator
                  customStyles={{
                    stepIndicatorSize: 40,
                    currentStepIndicatorSize: 50,
                    separatorStrokeWidth: 3,
                    currentStepStrokeWidth: 4,
                    stepStrokeWidth: 3,
                    labelColor: COLORS.white,
                    stepStrokeCurrentColor: '#F1A800',
                    stepIndicatorCurrentColor: '#F1A800',
                    stepIndicatorColor: '#F1A800',
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
                          name="venus-mars"
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
                        <Icon
                          name="globe"
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
                          placeholder={
                            !isCountryFocus ? 'Select Country' : '...'
                          }
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

                      <View style={styles.inputContainer}>
                        <TouchableOpacity
                          onPress={showDatePicker2}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Icon
                            name="calendar"
                            size={20}
                            color={COLORS.primary}
                            style={styles.inputIcon}
                          />
                          {birthdate ? (
                            <Text
                              style={[styles.input, { color: COLORS.white }]}>
                              {displayBirthDate || 'Birth Date (dd/mm/yyyy)'}{' '}
                            </Text>
                          ) : (
                            <Text
                              style={[
                                styles.input,
                                { color: COLORS.lightGray },
                              ]}>
                              {displayBirthDate || 'Birth Date (dd/mm/yyyy)'}{' '}
                            </Text>
                          )}
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
                          name="envelope"
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

                    </View>
                  )}

                  {currentStep === 1 && (
                    <View>
                      <View style={styles.inputContainer}>
                        <Icon
                          name="building"
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
                          name="map-marker"
                          size={20}
                          color={COLORS.primary}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          placeholder="Address"
                          placeholderTextColor={COLORS.lightGray}
                          value={address}
                          onChangeText={setAddress}
                          style={styles.input}
                          multiline={true}
                        />
                      </View>

                      <View style={styles.inputContainer}>
                        <Icon
                          name="suitcase"
                          size={20}
                          color={COLORS.primary}
                          style={styles.inputIcon}
                        />
                        <Dropdown
                          style={[styles.input, isPlanNameFocus]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          data={packages}
                          search
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder={!isPlanNameFocus ? 'Select Plan' : '...'}
                          searchPlaceholder="Search..."
                          value={planName}
                          onFocus={() => setIsPlanNameFocus(true)}
                          onBlur={() => setIsPlanNameFocus(false)}
                          onChange={handlePackageChange}
                        />
                      </View>

                      <View style={styles.inputContainer}>
                        <MaterialIcon
                          name="currency-rupee"
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
                          editable={false}
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
                          editable={false}
                        />
                      </View>

                      <View style={styles.inputContainer}>
                        <TouchableOpacity
                          onPress={showDatePicker}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Icon
                            name="calendar"
                            size={20}
                            color={COLORS.primary}
                            style={styles.inputIcon}
                          />
                          {startDate ? (
                            <Text
                              style={[styles.input, { color: COLORS.white }]}>
                              {displayStartDate || 'Start Date (dd/mm/yyyy)'}{' '}
                            </Text>
                          ) : (
                            <Text
                              style={[
                                styles.input,
                                { color: COLORS.lightGray },
                              ]}>
                              {displayStartDate || 'Start Date (dd/mm/yyyy)'}{' '}
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>

                      <View style={styles.inputContainer}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Icon
                            name="calendar"
                            size={20}
                            color={COLORS.primary}
                            style={styles.inputIcon}
                          />
                          {endDate ? (
                            <Text
                              style={[styles.input, { color: COLORS.white }]}>
                              {displayEndDate || 'End Date (dd/mm/yyyy)'}{' '}
                            </Text>
                          ) : (
                            <Text
                              style={[
                                styles.input,
                                { color: COLORS.lightGray },
                              ]}>
                              {displayEndDate || 'End Date (dd/mm/yyyy)'}{' '}
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
                    </View>
                  )}

                  {currentStep === 2 && (
                    <View>
                      <View style={styles.imageContainer}>
                        <TouchableOpacity
                          onPress={() => setModalVisible(true)}
                          style={styles.image}>
                          <View style={styles.iconWrapper}>
                            <Icon
                              name="camera"
                              size={22}
                              color={COLORS.white}
                              style={styles.imageIcon}
                            />
                          </View>
                          <Text style={styles.imageText}>Change Profile</Text>
                        </TouchableOpacity>
                      </View>

                      {fetchedImage && (
                        <View style={styles.imagePreviewContainer}>
                          <Image
                            source={{
                              uri: `${IMAGES_URL}/membersImage/${fetchedImageUri}`,
                            }}
                            style={styles.imagePreview}
                          />                          
                        </View>
                      )}

                      {fetchedImg && (
                        <View style={styles.imagePreviewContainer}>
                          <Image
                            source={{ uri: imageUri }}
                            style={styles.imagePreview}
                          />
                        </View>
                      )}

                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}>
                        <View style={styles.modalContainer}>
                          <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                              Choose an option
                            </Text>
                            <TouchableOpacity
                              style={styles.modalButton}
                              onPress={() => pickImage('camera')}>
                              <Icon
                                name="camera"
                                size={22}
                                color={COLORS.primary}
                              />
                              <Text style={styles.modalButtonText}>
                                Take a Photo
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.modalButton}
                              onPress={() => pickImage('gallery')}>
                              <Icon
                                name="image"
                                size={22}
                                color={COLORS.primary}
                              />
                              <Text style={styles.modalButtonText}>
                                Choose from Gallery
                              </Text>
                            </TouchableOpacity>
                            {imageUri && (
                              <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                  setImageUri(null);
                                  setModalVisible(false);
                                }}>
                                <Icon name="trash" size={22} color="red" />
                                <Text
                                  style={[
                                    styles.modalButtonText,
                                    { color: 'red' },
                                  ]}>
                                  Remove Photo
                                </Text>
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity
                              style={styles.cancelButton}
                              onPress={() => setModalVisible(false)}>
                              <Text style={styles.cancelButtonText}>
                                Cancel
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  )}
                </View>

                <View style={styles.buttons}>
                  {currentStep === 0 ? (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={prevStep}>
                      <Text
                        style={[
                          { opacity: currentStep === 0 ? 0.5 : 1 },
                          styles.buttonText,
                        ]}>
                        Previous
                      </Text>
                    </TouchableOpacity>
                  )}

                  {currentStep < steps.length - 1 ? (
                    <TouchableOpacity onPress={nextStep} disabled={loading}>
                      <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                      {loading ? (
                        <Text
                          style={[
                            styles.buttonText,
                            { opacity: loading ? 0.5 : 1 },
                          ]}>
                          Updating...
                        </Text>
                      ) : (
                        <Text style={styles.buttonText}>Update</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
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
  formContainerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding2,
    padding: SIZES.padding,
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
  downloadButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText1: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
  },
  image: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '80%',
  },
  iconWrapper: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 50,
    marginRight: 12,
  },

  imageIcon: {
    marginRight: 0,
  },
  imageText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  imagePreviewContainer: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: SIZES.base,
  },
  imagePreview: {
    width: 250,
    height: 250,
    borderRadius: SIZES.radius,
  },
  imageDescription: {
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: COLORS.white,
    borderColor: COLORS.lightGray,
    ...FONTS.body3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalButtonText: { fontSize: 16, marginLeft: 10 },
  cancelButton: { marginTop: 10, padding: 10 },
  cancelButtonText: { fontSize: 16, color: 'gray' },
});

export default EditMember;

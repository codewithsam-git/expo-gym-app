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
  Image,
} from 'react-native';
import { COLORS, FONTS, SIZES, icons } from '../constants';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

import BASE_URL from '../Api/commonApi';

const EditStaff = ({ route }) => {
  const { staffId } = route.params;
  const navigation = useNavigation();

  const [isRoleFocus, setIsRoleFocus] = useState(false);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [mobNo, setMobNo] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const fetchStaffById = async () => {
    try {
      console.log(`${BASE_URL}/get-staff?id=${staffId}`);
      const response = await fetch(`${BASE_URL}/get-staff?id=${staffId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const fetchedStaff = data.data;
      console.log('fetchedStaff: ', fetchedStaff);
      setFullName(fetchedStaff.full_name);
      setRole(fetchedStaff.role);
      setMobNo(fetchedStaff.mob_no.toString());
      setImageUri(fetchedStaff.profile_photo || 'profile.jpg');
    } catch (err) {
      console.error('Fetch error:', err);
      setSkeletonLoader(false);
    }
  };

  useEffect(() => {
    fetchStaffById();
  }, []);

  const staffData = {
    id: staffId,
    full_name: fullName,
    role: role,
    mob_no: mobNo,
    profile_photo: imageUri || 'profile.jpg',
  };

  const handleSubmit = async () => {
    try {
      console.log(`${BASE_URL}/edit-staff`);
      console.log('staffData: ', staffData);
      const response = await fetch(`${BASE_URL}/edit-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staffData),
      });

      console.log('response: ', response);

      if (response.status === 200) {
        Alert.alert(
          'Success',
          'staff updated successfully!',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
        navigation.goBack();
      } else {
        throw new Error('Failed to add staff');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to add staff, please try again');
    }
  };

  const onCancel = () => {
    navigation.goBack();
  };

  const pickImage = async () => {
    // Ask for permission to access the media library (required on iOS)
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images, // Only pick images
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Get the URI of the picked image
    } else {
      console.log('Image picker was canceled');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.formContainerWrapper}>
              <View style={styles.formContainer}>
                <Text style={styles.title}>Update staff</Text>
                <View>
                  {/* Full Name Input */}
                  <View style={styles.inputContainer}>
                    <Icon
                      name="user"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Full Name"
                      placeholderTextColor={COLORS.lightGray}
                      value={fullName}
                      onChangeText={setFullName}
                      style={styles.input}
                    />
                  </View>

                  {/* Role Dropdown */}
                  <View style={styles.inputContainer}>
                    <Icon
                      name="briefcase"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <Dropdown
                      style={[styles.input, isRoleFocus]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      data={[
                        { label: 'Admin', value: 'Admin' },
                        { label: 'Manager', value: 'Manager' },
                        { label: 'Staff', value: 'Staff' },
                      ]}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isRoleFocus ? 'Select Role' : '...'}
                      searchPlaceholder="Search..."
                      value={role}
                      onFocus={() => setIsRoleFocus(true)}
                      onBlur={() => setIsRoleFocus(false)}
                      onChange={(item) => {
                        setRole(item.value);
                        setIsRoleFocus(false);
                      }}
                    />
                  </View>

                  {/* Mobile Number Input */}
                  <View style={styles.inputContainer}>
                    <Icon
                      name="phone"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Mobile Number"
                      placeholderTextColor={COLORS.lightGray}
                      value={mobNo}
                      onChangeText={setMobNo}
                      style={styles.input}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Icon
                      name="camera"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TouchableOpacity onPress={pickImage} style={styles.input}>
                      <Text style={styles.imagePickerText}>
                        {imageUri ? 'Change Photo' : 'Select Photo'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {imageUri && (
                    <View style={styles.imagePreviewContainer}>
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.imagePreview}
                      />
                    </View>
                  )}

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={onCancel}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleSubmit}>
                      <Text style={styles.submitButtonText}>Update</Text>
                    </TouchableOpacity>
                  </View>
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
  title: {
    ...FONTS.h2,
    color: COLORS.white,
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  formContainerWrapper: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  formContainer: {
    width: '90%',
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding2,
    padding: SIZES.padding,
    margin: SIZES.padding,
    height: 'auto',
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: COLORS.white,
    borderColor: COLORS.lightGray,
    ...FONTS.body3,
  },
  inputIcon: {
    marginRight: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    margin: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.font,
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    margin: SIZES.base,
    borderRadius: SIZES.radius,
    padding: SIZES.font,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
  },
  submitButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
  },
  imagePickerText: {
    color: COLORS.lightGray,
    fontSize: 16,
  },
  imagePreviewContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius,
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
});

export default EditStaff;

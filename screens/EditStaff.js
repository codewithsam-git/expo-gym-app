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
  Image,
} from 'react-native';
import { COLORS, FONTS, SIZES, icons } from '../constants';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

import BASE_URL from '../Api/commonApi';
import IMAGES_URL from '../Api/ImagesUrl';

const EditStaff = ({ route }) => {
  const { staffId } = route.params;
  const navigation = useNavigation();

  const [isRoleFocus, setIsRoleFocus] = useState(false);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [mobNo, setMobNo] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [fetchedImg, setFetchedImg] = useState(false);
  const [fetchedImageUri, setFetchedImageUri] = useState('');
  const [fetchedImage, setFetchedImage] = useState(false);

  const fetchStaffById = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get-staff?id=${staffId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const fetchedStaff = data.data;
      setFullName(fetchedStaff.full_name);
      setRole(fetchedStaff.role);
      setSalary(fetchedStaff.salary);
      setMobNo(fetchedStaff.mob_no.toString());
      setFetchedImageUri(fetchedStaff.profile_photo);
      setFetchedImage(true);
    } catch (err) {
      console.error('Fetch error:', err);
      setSkeletonLoader(false);
    }
  };

  useEffect(() => {
    fetchStaffById();
  }, []);

  const handleSubmit = async () => {
    if (!fullName || !role || !mobNo ||!salary) {
      Alert.alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('role', role);
    formData.append('salary', salary);
    formData.append('mob_no', mobNo);
    formData.append('id', staffId);

    if (imageUri) {
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const file = {
        uri: imageUri,
        type: `image/${fileType}`,
        name: `staff_image.${fileType}`,
      };
      formData.append('profile_photo', file);
    }

    try {
      const response = await fetch(`${BASE_URL}/edit-staff`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Staff updated successfully');
        setFullName('');
        setRole('');
        setSalary('');
        setMobNo('');
        setImageUri(null);
        navigation.goBack();
      } else {
        Alert.alert(
          'Failed to update staff',
          result.message || 'Please try again.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the staff.');
    }
  };

  const onCancel = () => {
    navigation.goBack();
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setFetchedImg(true);
      setFetchedImage(false);
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

                  <View style={styles.inputContainer}>
                    <MaterialIcon
                      name="currency-rupee"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Staff Salary"
                      placeholderTextColor={COLORS.lightGray}
                      value={salary}
                      onChangeText={setSalary}
                      style={styles.input}
                      keyboardType="phone-pad"
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
                      <Text style={styles.imagePickerText}>Change Photo</Text>
                    </TouchableOpacity>
                  </View>

                  {fetchedImage && (
                    <View style={styles.imagePreviewContainer}>
                      <Image
                        source={{
                          uri: `${IMAGES_URL}/staffImage/${fetchedImageUri}`,
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
    justifyContent: 'center',
    alignItems: 'center',
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
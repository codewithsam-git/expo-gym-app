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
import { COLORS, FONTS, SIZES } from '../constants';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BASE_URL from '../Api/commonApi';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const EditPackage = ({ route }) => {
  const { packageId } = route.params;
  const navigation = useNavigation();

  const [isDurationFocus, setIsDurationFocus] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [packageName, setPackageName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [duration, setDuration] = useState('');
  const [fetchedImg, setFetchedImg] = useState(false);
  const [fetchedImageUri, setFetchedImageUri] = useState('');
  const [fetchedImage, setFetchedImage] = useState(false);

  const fetchPackageById = async () => {
    try {
      const response = await fetch(`${BASE_URL}/edit-packages?id=${packageId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const fetchedPackage = data.data;
      setPackageName(fetchedPackage.package_name);
      setDuration(fetchedPackage.package_duration);
      setPrice(fetchedPackage.package_amount.toString());
      setDiscount(fetchedPackage.discount.toString());
      setFetchedImageUri(fetchedPackage.image);
      setFetchedImage(true);
    } catch (err) {
      console.error('Fetch error:', err);
      setSkeletonLoader(false);
    }
  };

  useEffect(() => {
    fetchPackageById();
  }, []);

  const handleSubmit = async () => {
    if (!packageName || !duration || !price || !discount) {
      Alert.alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('package_name', packageName);
    formData.append('package_duration', duration);
    formData.append('package_amount', price);
    formData.append('discount', discount);
    formData.append('id', packageId);

    if (imageUrl) {
      const uriParts = imageUrl.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const file = {
        uri: imageUrl,
        type: `image/${fileType}`,
        name: `package_image.${fileType}`,
      };
      formData.append('image', file);
    }

    try {
      const response = await fetch(`${BASE_URL}/update-packages`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Package updated successfully');
        setPackageName('');
        setDuration('');
        setPrice('');
        setDiscount('');
        setImageUrl(null);
        navigation.goBack();
      } else {
        Alert.alert(
          'Failed to update package',
          result.message || 'Please try again.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the package.');
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
      setImageUrl(result.assets[0].uri);
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
                <Text style={styles.title}>Update Package</Text>
                <View>
                  <View style={styles.inputContainer}>
                    <Icon
                      name="tag"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Enter Package Name"
                      placeholderTextColor={COLORS.lightGray}
                      value={packageName}
                      onChangeText={setPackageName}
                      style={styles.input}
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
                        { label: '1 Month', value: '1m' },
                        { label: '3 Months', value: '3m' },
                        { label: '6 Months', value: '6m' },
                        { label: '1 Year', value: '1y' },
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
                      onChange={(item) => {
                        setDuration(item.value);
                        setIsDurationFocus(false);
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
                      placeholder="Enter Amount (In Rupees)"
                      placeholderTextColor={COLORS.lightGray}
                      value={price}
                      onChangeText={setPrice}
                      style={styles.input}
                      keyboardType="phone-pad"
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
                      placeholder="Enter Discount (In Rupees)"
                      placeholderTextColor={COLORS.lightGray}
                      value={discount}
                      onChangeText={setDiscount}
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
                          uri: `https://gym.cronicodigital.com/uploads/packages/${fetchedImageUri}`,
                        }}
                        style={styles.imagePreview}
                      />
                    </View>
                  )}

                  {fetchedImg && (
                    <View style={styles.imagePreviewContainer}>
                      <Image
                        source={{ uri: imageUrl }}
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

export default EditPackage;

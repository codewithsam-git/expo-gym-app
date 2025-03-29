import React, { useState } from 'react';
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
import BASE_URL from '../Api/commonApi';
import * as ImagePicker from 'expo-image-picker';

const AddPackage = ({ navigation }) => {
  const [isDurationFocus, setIsDurationFocus] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [packageName, setPackageName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [duration, setDuration] = useState('');

  const packageData = {
    package_name: packageName,
    package_duration: duration,
    package_amount: price,
    discount: discount,
    image: "imageUrl.jpg", 
  };

  const handleSubmit = async () => {
    try {
      console.log(`${BASE_URL}/save-packages`);
      console.log('packageData: ', packageData);
      const response = await fetch(`${BASE_URL}/save-packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData),
      });

      console.log('response: ', response);

      if (response.status === 200) {
        Alert.alert(
          'Success',
          'Package added successfully!',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
        setPackageName('');
        setDuration('');
        setPrice('');
        setDiscount('');
        setImageUrl(null);
      } else {
        throw new Error('Failed to add package');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to add package, please try again');
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
      setImageUrl(result.assets[0].uri); // Get the URI of the picked image
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
                <Text style={styles.title}>Add New Package</Text>
                <View>
                  {/* Price Input */}
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

                  {/* Duration Dropdown */}
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
                      placeholder="Enter Discount (Final Price)"
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
                      <Text style={styles.imagePickerText}>
                        {imageUrl ? 'Change Photo' : 'Select Photo'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {imageUrl && (
                    <View style={styles.imagePreviewContainer}>
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.imagePreview}
                      />
                    </View>
                  )}

                  {/* Buttons */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={onCancel}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleSubmit}>
                      <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      {/*<View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.downloadButton]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText1}>View Packages</Text>
        </TouchableOpacity>
      </View>*/}
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
    flex: 1, // Make input field take up the remaining space
    borderBottomWidth: 1,
    paddingVertical: 12, // Increased padding for better alignment
    paddingHorizontal: 10,
    marginBottom: 20,
    color: COLORS.white,
    borderColor: COLORS.lightGray,
    ...FONTS.body3,
  },
  inputIcon: {
    marginRight: 10, // Space between icon and input field
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
  button: {
    flex: 1,
    backgroundColor: COLORS.primary,
    margin: SIZES.base,
    borderRadius: SIZES.radius,
    padding: SIZES.font,
    alignItems: 'center',
  },
  buttonText: {
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

export default AddPackage;

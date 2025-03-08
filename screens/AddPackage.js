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
import Header from '../components/Header';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker'; // Import the image picker
import BASE_URL from '../Api/commonApi';

const AddPackage = ({ navigation }) => {
  const [isPlanNameFocus, setIsPlanNameFocus] = useState(false);
  const [isDurationFocus, setIsDurationFocus] = useState(false);
  const [staff, setStaff] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [packageName, setPackageName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  const packageData = {
    packageName: packageName,
    price: price,
    duration: duration,
    staff: staff,
    imageUrl: imageUrl,
  };

  const handleSubmit = async () => {
    try {
      console.log(`${BASE_URL}/save-package`);
      console.log('packageData: ', packageData);
      const response = await fetch(`http://192.168.31.132:9000/save-package`, {
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
        setPrice('');
        setDuration('');
        setStaff('');
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

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImageUrl(response.assets[0].uri); // Set the selected image URI
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ marginTop: Platform.OS === 'ios' ? 20 : 60 }}>
        <Header />
      </View>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Add New Package</Text>
              <View>
                {/* Package Name Dropdown */}
                <View style={styles.inputContainer}>
                  <Icon
                    name="tag"
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
                    value={packageName}
                    onFocus={() => setIsPlanNameFocus(true)}
                    onBlur={() => setIsPlanNameFocus(false)}
                    onChange={(item) => {
                      setPackageName(item.value);
                      setIsPlanNameFocus(false);
                    }}
                  />
                </View>

                {/* Price Input */}
                <View style={styles.inputContainer}>
                  <Icon
                    name="dollar"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Price"
                    placeholderTextColor={COLORS.lightGray}
                    value={price}
                    onChangeText={setPrice}
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
                    onChange={(item) => {
                      setDuration(item.value);
                      setIsDurationFocus(false);
                    }}
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
                    placeholder="Staff Name"
                    placeholderTextColor={COLORS.lightGray}
                    value={staff}
                    onChangeText={setStaff}
                    style={styles.input}
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
                      {imageUrl ? 'Change Image' : 'Select Image'}
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
  formContainer: {
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
});

export default AddPackage;

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
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker

import BASE_URL from '../Api/commonApi';

const AddInventory = ({ navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [useFor, setUseFor] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const inventoryData = {
    name: name,
    price: price,
    useFor: useFor,
    image: imageUri || 'inventory.jpg',
  };

  const handleSubmit = async () => {
    try {
      console.log(`${BASE_URL}/save-inventory`);
      console.log('inventoryData: ', inventoryData);
      const response = await fetch(`${BASE_URL}/save-inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventoryData),
      });

      console.log('response: ', response);

      if (response.status === 200) {
        Alert.alert(
          'Success',
          'Inventory item added successfully!',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
        setName('');
        setPrice('');
        setUseFor('');
        setImageUri(null);
      } else {
        throw new Error('Failed to add inventory');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to add inventory, please try again');
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
                <Text style={styles.title}>Add New Inventory Item</Text>
                <View>
                  {/* Name Input */}
                  <View style={styles.inputContainer}>
                    <Icon
                      name="tag"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Item Name"
                      placeholderTextColor={COLORS.lightGray}
                      value={name}
                      onChangeText={setName}
                      style={styles.input}
                    />
                  </View>

                  {/* Price Input */}
                  <View style={styles.inputContainer}>
                    <MaterialIcon
                      name="currency-rupee"
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
                      keyboardType="numeric"
                    />
                  </View>

                  {/* Use For Input */}
                  <View style={styles.inputContainer}>
                    <Icon
                      name="rocket"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Use For (e.g., Food, Clothing, Electronics)"
                      placeholderTextColor={COLORS.lightGray}
                      value={useFor}
                      onChangeText={setUseFor}
                      style={styles.input}
                    />
                  </View>

                  {/* Image Picker */}
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
      {/* <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.downloadButton]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText1}>View Inventory</Text>
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

export default AddInventory;

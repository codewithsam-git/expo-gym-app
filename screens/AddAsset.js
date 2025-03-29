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
import { COLORS, FONTS, SIZES, icons } from '../constants';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BASE_URL from '../Api/commonApi';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const AddAsset = ({ navigation }) => {
  const [isAssetTypeFocus, setIsAssetTypeFocus] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const assetData = {
    asset_name: assetName,
    asset_type: assetType,
    purchase_date: purchaseDate,
    purchase_price: purchasePrice,
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const formatDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleConfirm = (date) => {
    setPurchaseDate(formatDate(date));
    hideDatePicker();
  };

  const handleSubmit = async () => {
    try {
      console.log(`${BASE_URL}/save-asset`);
      console.log('assetData: ', assetData);
      const response = await fetch(`${BASE_URL}/save-assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assetData),
      });

      console.log('response: ', response);

      if (response.status === 200) {
        Alert.alert(
          'Success',
          'Asset added successfully!',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
        setAssetName('');
        setAssetType('');
        setPurchaseDate('');
        setPurchasePrice('');
        navigation.goBack();
      } else {
        throw new Error('Failed to add asset');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to add asset, please try again');
    }
  };

  const onCancel = () => {
    navigation.goBack();
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
                <Text style={styles.title}>Add New Asset</Text>
                <View>
                  {/* Asset Name Input */}
                  <View style={styles.inputContainer}>
                    <Icon
                      name="tag"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Asset Name"
                      placeholderTextColor={COLORS.lightGray}
                      value={assetName}
                      onChangeText={setAssetName}
                      style={styles.input}
                    />
                  </View>

                  {/* Asset Type Dropdown */}
                  <View style={styles.inputContainer}>
                    <Icon
                      name="th-list"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <Dropdown
                      style={[styles.input, isAssetTypeFocus]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      data={[
                        { label: 'Furniture', value: 'Furniture' },
                        { label: 'Electronics', value: 'Electronics' },
                        { label: 'Vehicles', value: 'Vehicles' },
                      ]}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={
                        !isAssetTypeFocus ? 'Select Asset Type' : '...'
                      }
                      searchPlaceholder="Search..."
                      value={assetType}
                      onFocus={() => setIsAssetTypeFocus(true)}
                      onBlur={() => setIsAssetTypeFocus(false)}
                      onChange={(item) => {
                        setAssetType(item.value);
                        setIsAssetTypeFocus(false);
                      }}
                    />
                  </View>

                  {/* Purchase Date Input */}
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
                      {purchaseDate ? (
                        <Text style={[styles.input, { color: COLORS.white }]}>
                          {purchaseDate || 'Select Purchase Date'}{' '}
                        </Text>
                      ) : (
                        <Text
                          style={[styles.input, { color: COLORS.lightGray }]}>
                          {purchaseDate || 'Select Purchase Date'}{' '}
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

                  {/* Purchase Price Input */}
                  <View style={styles.inputContainer}>
                    <MaterialIcon
                      name="currency-rupee"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Purchase Price"
                      placeholderTextColor={COLORS.lightGray}
                      value={purchasePrice}
                      onChangeText={setPurchasePrice}
                      style={styles.input}
                      keyboardType="phone-pad"
                    />
                  </View>

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
          <Text style={styles.buttonText1}>View Assets</Text>
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

export default AddAsset;

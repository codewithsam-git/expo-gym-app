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
import Header from '../components/Header';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
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

  const handleConfirm = (date) => {
    setPurchaseDate(date.toLocaleDateString());
    hideDatePicker();
  };

  const handleSubmit = async () => {
    try {
      console.log(`${BASE_URL}/save-asset`);
      console.log('assetData: ', assetData);
      const response = await fetch(`http://192.168.31.132:9000/save-asset`, {
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
      <View style={{ marginTop: Platform.OS === 'ios' ? 20 : 60 }}>
        <Header />
      </View>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
                    <Text style={[styles.input, { color: COLORS.lightGray }]}>
                      {purchaseDate || 'Select Purchase Date'}{' '}
                    </Text>
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
                  <Icon
                    name="dollar"
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
});

export default AddAsset;

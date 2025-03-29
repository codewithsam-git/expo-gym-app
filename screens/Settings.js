import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('Chetan Gujar');
  const [email, setEmail] = useState('chetan@cronico.co');
  const [phone, setPhone] = useState('8788298673');
  const [password, setPassword] = useState('chetan@123');
  const [role, setRole] = useState('Admin');
  const [description, setDescription] = useState('Admin managing gym operations efficiently.');
  
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning !';
    if (hours < 18) return 'Good Afternoon !';
    return 'Good Evening !';
  };

  const handleSubmit = () => {
    Alert.alert('Success', 'Settings updated successfully!');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
          <View style={styles.headerSection}>
            <Text style={styles.header}>{getGreeting()}</Text>
            <Text style={styles.subHeader}>
              Manage your profile and platform settings
            </Text>
          </View>

          <View style={styles.profileHeader}>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgzPKFziefwggi6URHF_ApNhe9okKizqq4lRBjzG9QQ5--_Ch0Iq9IUtPONEw9-SeKlqs&usqp=CAU',
              }}
              style={styles.profileHeaderImage}
            />
          </View>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Header Section */}

            {/* Profile Section */}

            {/* Input Fields */}
            <View style={styles.inputContainer}>
              <Icon
                name="person-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor={COLORS.lightGray}
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="mail-outline"
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
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="call-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Phone No"
                placeholderTextColor={COLORS.lightGray}
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="lock-closed-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor={COLORS.lightGray}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="people-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Role"
                placeholderTextColor={COLORS.lightGray}
                value={role}
                onChangeText={setRole}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="chatbubble-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Description"

                placeholderTextColor={COLORS.lightGray}
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Submit Button */}
            {/*<TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <View style={styles.submitButtonContent}>
                <Text style={styles.submitButtonText}>Update</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}>
              <View style={styles.cancelButtonContent}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </View>
            </TouchableOpacity>*/}
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerSection: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: Platform.OS === 'ios' ? 80 : 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 185,
    borderBottomRightRadius: 185,
  },
  header: {
    ...FONTS.h1,
    color: COLORS.white,
    marginTop: Platform.OS === 'ios' ? -30 : -10,
  },
  subHeader: {
    ...FONTS.body3,
    color: COLORS.white,
  },
  profileHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
    marginBottom: SIZES.padding,
  },
  profileHeaderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: COLORS.white,
    zIndex: 1,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  inputIcon: {
    marginRight: 10,
  },
  submitButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    ...FONTS.body2,
  },
  cancelButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cancelButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.white,
    ...FONTS.body2,
  },
});

export default Settings;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing FontAwesome icons
import { COLORS, FONTS, SIZES, icons } from '../constants'; // Assuming these constants are pre-defined

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // if (!email || !password) {
    //   console.log("all fields are mandatory")
    //     Alert.alert('Error', 'Please enter both email and password');
    //     return;
    // }

    // try {
    //     const response = await fetch('http://192.168.31.132:3000/api/users/login', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ email, password }),
    //     });

    //     const data = await response.json();
    //     console.log("data: ", data);
    //     if (response.ok) {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
    //     } else {
    //         Alert.alert('Login Failed', data.responseMessage);
    //     }
    // } catch (error) {
    //   console.log(error.message);
    //     Alert.alert('Error', 'An error occurred. Please try again later.');
    // }
  };

  const onForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerSection}>
        <Text style={styles.header}>Welcome Back!</Text>
        <Text style={styles.subHeader}>Login to your account</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Icon
            name="envelope"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Icon
            name="lock"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity onPress={onForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
               
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerSection: {
    height: 250,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    // borderBottomLeftRadius: SIZES.radius,
    // borderBottomRightRadius: SIZES.radius,
  },
  header: {
    ...FONTS.h1,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 50,
  },
  subHeader: {
    ...FONTS.body3,
    color: COLORS.white,
    marginTop: SIZES.base,
  },
  formContainer: {
    flex: 1,
    padding: SIZES.padding,
    marginTop: -SIZES.radius,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.font,
    borderTopRightRadius: SIZES.font,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
  },
  inputIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
  },
  input: {
    flex: 1,
    height: 50,
    paddingLeft: SIZES.padding,
    ...FONTS.body3,
    color: COLORS.black,
  },
  forgotPassword: {
    color: COLORS.primary,
    textAlign: 'right',
    marginTop: SIZES.base,
    ...FONTS.body4,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.font,
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  buttonText: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.base,
  },
  signUpText: {
    ...FONTS.body4,
    color: COLORS.black,
  },
  signUpLink: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
});

export default Login;

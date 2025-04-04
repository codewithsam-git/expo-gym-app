import React, { useState } from 'react'; 
import {   
  View,   
  Text,   
  TextInput,   
  TouchableOpacity,   
  TouchableWithoutFeedback,   
  Keyboard,   
  StyleSheet,   
  SafeAreaView,   
  Alert,   
  Image, 
} from 'react-native'; 
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { COLORS, FONTS, SIZES, images } from '../constants'; 
import BASE_URL from '../Api/commonApi';

const Login = ({ navigation }) => {   
  const [email, setEmail] = useState('admin@gmail.com');   
  const [password, setPassword] = useState('1234');   

  const handleLogin = async () => {
    // if (!email || !password) {
    //   Alert.alert("Error", "Please enter both email and password.");
    //   return;
    // }

    // const requestBody = {
    //   email: email,
    //   password: password,
    // };

    // try {
    //   const response = await fetch(`${BASE_URL}/login`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(requestBody),
    //   });

    //   const data = await response.json();
    //   console.log("data", data);
    //   if (response.ok) {
    //     Alert.alert("Success", "Login successful!");
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
    //   } else {
    //     Alert.alert("Error", data.message || "Invalid email or password.");
    //   }
    // } catch (error) {
    //   console.error("Login error:", error);
    //   Alert.alert("Error", "Something went wrong. Please try again.");
    // }
  };

  const onForgotPassword = () => {     
    console.log('Forgot password clicked');   
  };

  return (     
    <SafeAreaView style={styles.safeArea}>       
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>         
        <View style={styles.container}>           
          <View style={styles.headerSection}>             
            {/* Logo */}             
            <View style={styles.imageHeader}>               
              <Image source={images.gymLogo} style={styles.logo} />             
            </View>           
          </View>            

          <View style={styles.formContainer}>             
            <Text style={styles.header}>Welcome to One Hour Fitness Club</Text>             
            <Text style={styles.subHeader}>               
              Login To Manage Your Gym Operations             
            </Text>              

            {/* Email Input */}             
            <View style={styles.inputContainer}>               
              <Icon                 
                name="envelope"                 
                size={20}                 
                color={COLORS.black}                 
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
                color={COLORS.black}                 
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

            {/* Login Button */}             
            <TouchableOpacity style={styles.button} onPress={handleLogin}>               
              <Text style={styles.buttonText}>Login</Text>             
            </TouchableOpacity>           
          </View>         
        </View>       
      </TouchableWithoutFeedback>     
    </SafeAreaView>   
  ); 
};  

const styles = StyleSheet.create({   
  safeArea: {     
    flex: 1,     
    backgroundColor: COLORS.black,   
  },   
  container: {     
    flex: 1,   
  },   
  headerSection: {     
    height: 200,     
    backgroundColor: COLORS.black,     
    justifyContent: 'center',     
    alignItems: 'center',   
  },   
  imageHeader: {     
    alignItems: 'center',   
  },   
  logo: {     
    width: 150, // Adjust logo size     
    height: 150, // Adjust logo size     
    marginBottom: 20, // Add some space between logo and header text   
  },   
  header: {     
    fontSize: 28, // Slightly smaller but impactful     
    fontWeight: 'bold', // Bold to make the text stand out     
    color: COLORS.primary, // Use a bright color for emphasis     
    textAlign: 'center',     
    marginTop: SIZES.font,     
    letterSpacing: 2, // Space out the letters for readability and modern style     
    textTransform: 'capitalize', // Capitalize the first letter of each word     
    textShadowColor: COLORS.black, // White shadow for a glowing effect (use primary if you prefer)     
    textShadowOffset: { width: 1, height: 1 },     
    textShadowRadius: 2, // Slightly soft shadow radius for depth     
  },    

  subHeader: {     
    fontSize: 10, // Slightly smaller than the header for balance     
    fontWeight: '500', // Medium weight for a clean look     
    color: COLORS.lightGray, // Light color for subtlety     
    textAlign: 'center',     
    marginVertical: SIZES.base,     
    marginBottom: SIZES.padding2,     
    letterSpacing: 1, // Subtle letter spacing for a modern feel     
    textTransform: 'capitalize', // Optional, to give each word a capital letter     
    opacity: 0.8, // Slight opacity to add depth and a modern touch     
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Soft shadow to add depth     
    textShadowOffset: { width: 1, height: 1 },     
    textShadowRadius: 4, // Soft shadow radius for depth   
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
});

export default Login;

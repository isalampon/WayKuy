import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native'
import { FIREBASE_AUTH } from './FirebaseConfig';

const LoginPhone = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      // Handle successful login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Login</Text>
        <Text style={styles.headerSubtitle}>Login to make your life easier.</Text>
      </View>

      {/* <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('./assets/user-icon.png')}
            style={styles.avatarIcon}
          />
        </View>
      </View> */}

      <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number<Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity style={styles.alternateLogin}>
            <Text style={styles.alternateLoginText}>Or Login With Email</Text>
          </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password<Text style={styles.required}>*</Text></Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              {/* <Image
                source={require('./assets/eye-icon.png')}
                style={styles.icon}
              /> */}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        {/* <Text style={styles.languageText}>Language</Text>
        <View style={styles.languageFlags}>
          <TouchableOpacity style={styles.flagContainer}>
            <Image
              source={require('./assets/flag-th.png')}
              style={styles.flagIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.flagContainer}>
            <Image
              source={require('./assets/flag-us.png')}
              style={styles.flagIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.flagContainer}>
            <Image
              source={require('./assets/flag-ae.png')}
              style={styles.flagIcon}
            />
          </TouchableOpacity>
        </View>
        <Image
          source={require('./assets/halal-way-logo.png')}
          style={styles.logo}
        /> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 30,
    backgroundColor: '#014737',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom : 30,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: 20,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6E6E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    width: 40,
    height: 40,
  },
  formSection: {
    paddingHorizontal: 24,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  required: {
    color: '#FF0000',
    marginLeft: 4,
  },
  input: {
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  alternateLogin: {
    alignItems: 'center',
    marginVertical: 16,
  },
  alternateLoginText: {
    color: '#FFC107',
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    height: 48,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#014737',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#014737',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#333333',
    fontSize: 14,
  },
  signupLink: {
    color: '#014737',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  languageText: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 12,
  },
  languageFlags: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  flagContainer: {
    width: 32,
    height: 32,
  },
  flagIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  logo: {
    height: 40,
    resizeMode: 'contain',
  },
});

export default LoginPhone;
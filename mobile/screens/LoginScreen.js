import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import HapticButton from '../components/ui/HapticButton';
import { AuthContext } from '../context/AuthContext';
import { Spacing, Radii } from '../theme/colors';
import GlassCard from '../components/GlassCard';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'your-google-web-client-id.apps.googleusercontent.com',
  offlineAccess: true,
});

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useContext(AuthContext);
  const theme = useTheme();
  const customColors = theme.colors.custom;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (!success) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken || userInfo.idToken;
      if (!idToken) {
        Alert.alert('Error', 'No ID token received from Google.');
        return;
      }
      setIsLoading(true);
      const success = await loginWithGoogle(idToken);
      setIsLoading(false);
      if (!success) {
        Alert.alert('Login Failed', 'Authentication with SplitSmart server failed.');
      }
    } catch (error) {
      setIsLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // In progress
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Google Play Services', 'Play services not available or outdated.');
      } else {
        Alert.alert('Google Login Error', error.message || 'An error occurred during Google Sign-In.');
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: Spacing.lg,
    },
    brandContainer: {
      alignItems: 'center',
      marginBottom: 32,
    },
    logoText: {
      fontSize: 38,
      fontWeight: '900',
      color: theme.colors.primary,
      letterSpacing: -1.5,
    },
    subtitle: {
      fontSize: 15,
      color: customColors.textMuted,
      marginTop: 8,
      textAlign: 'center',
      fontWeight: '500',
    },
    formCard: {
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: Radii.xl,
    },
    title: {
      textAlign: 'center',
      marginBottom: 20,
      fontWeight: '800',
      color: theme.colors.onBackground,
    },
    input: {
      marginBottom: 16,
      backgroundColor: theme.colors.background,
    },
    button: {
      marginTop: 8,
      borderRadius: Radii.md,
      paddingVertical: 6,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.outline,
    },
    dividerText: {
      marginHorizontal: 8,
      fontSize: 12,
      color: customColors.textMuted,
      fontWeight: '600',
    },
    googleButton: {
      borderRadius: Radii.md,
      paddingVertical: 6,
      borderColor: theme.colors.outline,
    },
    googleButtonText: {
      color: theme.colors.onBackground,
      fontWeight: '700',
    },
    signUpButton: {
      marginTop: 16,
    },
    signUpText: {
      color: theme.colors.primary,
      fontWeight: '700',
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.brandContainer}>
          <Text style={styles.logoText}>SplitSmart</Text>
          <Text style={styles.subtitle}>Split bills smartly with friends & groups</Text>
        </View>

        <GlassCard style={styles.formCard} variant="elevated">
          <Text variant="headlineSmall" style={styles.title}>Welcome Back</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            activeOutlineColor={theme.colors.primary}
            outlineColor={theme.colors.outline}
            accessibilityLabel="Email address"
          />
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            mode="outlined"
            activeOutlineColor={theme.colors.primary}
            outlineColor={theme.colors.outline}
            accessibilityLabel="Password"
          />

          <HapticButton
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
            accessibilityLabel="Login to your account"
            accessibilityRole="button"
          >
            Login
          </HapticButton>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <HapticButton
            mode="outlined"
            onPress={handleGoogleLogin}
            style={styles.googleButton}
            labelStyle={styles.googleButtonText}
            icon="google"
            loading={isLoading}
            disabled={isLoading}
            accessibilityLabel="Continue with Google"
            accessibilityRole="button"
          >
            Continue with Google
          </HapticButton>
        </GlassCard>

        <HapticButton
          onPress={() => navigation.navigate("Signup")}
          style={styles.signUpButton}
          labelStyle={styles.signUpText}
          disabled={isLoading}
          accessibilityLabel="Go to sign up screen"
          accessibilityRole="button"
          accessibilityHint="Navigates to the account creation screen"
        >
          Don't have an account? Sign Up
        </HapticButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

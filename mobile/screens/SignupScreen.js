import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import HapticButton from '../components/ui/HapticButton';
import { AuthContext } from '../context/AuthContext';
import { Spacing, Radii } from '../theme/colors';
import GlassCard from '../components/GlassCard';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const theme = useTheme();
  const customColors = theme.colors.custom;

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match!");
      return;
    }
    setIsLoading(true);
    const success = await signup(name, email, password);
    setIsLoading(false);
    if (!success) {
      Alert.alert('Signup Failed', 'An error occurred. Please try again.');
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
      marginBottom: 24,
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
      marginBottom: 16,
      fontWeight: '800',
      color: theme.colors.onBackground,
    },
    input: {
      marginBottom: 14,
      backgroundColor: theme.colors.background,
    },
    button: {
      marginTop: 10,
      borderRadius: Radii.md,
      paddingVertical: 6,
    },
    loginButton: {
      marginTop: 14,
    },
    loginText: {
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
          <Text style={styles.subtitle}>Join us to start splitting expenses easily</Text>
        </View>

        <GlassCard style={styles.formCard} variant="elevated">
          <Text variant="headlineSmall" style={styles.title}>Create Account</Text>

          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            autoCapitalize="words"
            mode="outlined"
            activeOutlineColor={theme.colors.primary}
            outlineColor={theme.colors.outline}
            accessibilityLabel="Full Name"
          />

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

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry
            mode="outlined"
            activeOutlineColor={theme.colors.primary}
            outlineColor={theme.colors.outline}
            accessibilityLabel="Confirm Password"
          />

          <HapticButton
            mode="contained"
            onPress={handleSignup}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
            accessibilityLabel="Create account"
            accessibilityRole="button"
          >
            Sign Up
          </HapticButton>
        </GlassCard>

        <HapticButton
          onPress={() => navigation.navigate("Login")}
          style={styles.loginButton}
          labelStyle={styles.loginText}
          disabled={isLoading}
          accessibilityLabel="Go to login screen"
          accessibilityRole="button"
          accessibilityHint="Navigates to the login screen"
        >
          Already have an account? Log In
        </HapticButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;


import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import HapticButton from '../components/ui/HapticButton';
import { AuthContext } from '../context/AuthContext';
import { Spacing, Radii } from '../theme/colors';
import GlassCard from '../components/GlassCard';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
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

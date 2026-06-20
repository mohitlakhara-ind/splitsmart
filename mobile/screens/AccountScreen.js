import React, { useContext } from "react";
import { Alert, StyleSheet, View, ScrollView } from "react-native";
import { Appbar, Avatar, Divider, List, Text, Switch, useTheme } from "react-native-paper";
import { HapticListItem } from '../components/ui/HapticList';
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Spacing, Radii } from "../theme/colors";
import GlassCard from "../components/GlassCard";

const AccountScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { themeMode, isDarkMode, toggleThemeMode } = useContext(ThemeContext);
  const theme = useTheme();
  const customColors = theme.colors.custom;

  const handleLogout = () => {
    logout();
  };

  const handleComingSoon = () => {
    Alert.alert("Coming Soon", "This feature is not yet implemented.");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: Spacing.md,
      paddingBottom: 140,
    },
    profileCard: {
      alignItems: "center",
      marginBottom: 16,
      paddingVertical: 32,
      paddingHorizontal: Spacing.md,
    },
    avatarContainer: {
      padding: 4,
      borderRadius: Radii.full,
      borderWidth: 2.5,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    name: {
      marginTop: 16,
      fontWeight: '800',
      color: theme.colors.onBackground,
      letterSpacing: -0.3,
    },
    email: {
      marginTop: 4,
      color: customColors.textMuted,
      fontSize: 14,
      fontWeight: '500',
    },
    sectionLabel: {
      fontSize: 11.5,
      fontWeight: '700',
      textTransform: 'uppercase',
      color: customColors.textMuted,
      marginLeft: 8,
      marginTop: 24,
      marginBottom: 8,
      letterSpacing: 1.2,
    },
    firstSectionLabel: {
      marginTop: 16,
    },
    listSection: {
      marginBottom: 0,
      borderRadius: Radii.lg,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      overflow: 'hidden',
    },
    listItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    versionText: {
      textAlign: 'center',
      fontSize: 12,
      color: customColors.textMuted,
      marginTop: 36,
      marginBottom: 12,
      letterSpacing: 0.5,
      opacity: 0.7,
    }
  });

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="Account" titleStyle={{ fontWeight: 'bold', color: theme.colors.onSurface }} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.profileCard} variant="elevated">
          <View style={styles.avatarContainer}>
            {user?.imageUrl && /^(https?:|data:image)/.test(user.imageUrl) ? (
              <Avatar.Image size={96} source={{ uri: user.imageUrl }} />
            ) : (
              <Avatar.Text 
                size={96} 
                label={user?.name?.charAt(0) || "A"} 
                style={{ backgroundColor: customColors.glassStrong }}
                labelStyle={{ color: theme.colors.primary, fontWeight: '700', fontSize: 36 }}
              />
            )}
          </View>
          <Text variant="headlineSmall" style={styles.name}>
            {user?.name}
          </Text>
          <Text variant="bodyLarge" style={styles.email}>
            {user?.email}
          </Text>
        </GlassCard>

        <Text style={[styles.sectionLabel, styles.firstSectionLabel]}>Profile & Style</Text>
        <GlassCard padding={0} style={styles.listSection}>
          <HapticListItem
            title="Edit Profile"
            description="Change your name and avatar"
            descriptionStyle={{ color: customColors.textMuted, fontSize: 12 }}
            titleStyle={{ color: theme.colors.onSurface, fontWeight: '600' }}
            left={() => <List.Icon icon="account-edit-outline" color={theme.colors.primary} />}
            right={() => <List.Icon icon="chevron-right" color={customColors.textMuted} />}
            onPress={() => navigation.navigate("EditProfile")}
            style={styles.listItem}
            accessibilityLabel="Edit Profile"
            accessibilityRole="button"
          />
          <Divider style={{ backgroundColor: theme.colors.outline }} />
          <HapticListItem
            title="Dark Mode"
            description="Toggle app appearance"
            descriptionStyle={{ color: customColors.textMuted, fontSize: 12 }}
            titleStyle={{ color: theme.colors.onSurface, fontWeight: '600' }}
            left={() => <List.Icon icon="theme-light-dark" color={theme.colors.primary} />}
            right={() => (
              <Switch
                value={isDarkMode}
                onValueChange={toggleThemeMode}
                color={theme.colors.primary}
              />
            )}
            style={styles.listItem}
            accessibilityLabel="Toggle Dark Mode"
          />
          <Divider style={{ backgroundColor: theme.colors.outline }} />
          <HapticListItem
            title="Email Settings"
            description="Manage your notifications"
            descriptionStyle={{ color: customColors.textMuted, fontSize: 12 }}
            titleStyle={{ color: theme.colors.onSurface, fontWeight: '600' }}
            left={() => <List.Icon icon="email-outline" color={theme.colors.primary} />}
            right={() => <List.Icon icon="chevron-right" color={customColors.textMuted} />}
            onPress={handleComingSoon}
            style={styles.listItem}
            accessibilityLabel="Email Settings"
            accessibilityRole="button"
          />
        </GlassCard>

        <Text style={styles.sectionLabel}>Tools & Integrations</Text>
        <GlassCard padding={0} style={styles.listSection}>
          <HapticListItem
            title="Import from Splitwise"
            description="Sync your existing groups & balances"
            descriptionStyle={{ color: customColors.textMuted, fontSize: 12 }}
            titleStyle={{ color: theme.colors.onSurface, fontWeight: '600' }}
            left={() => <List.Icon icon="import" color={theme.colors.primary} />}
            right={() => <List.Icon icon="chevron-right" color={customColors.textMuted} />}
            onPress={() => navigation.navigate("SplitwiseImport")}
            style={styles.listItem}
            accessibilityLabel="Import from Splitwise"
            accessibilityRole="button"
          />
        </GlassCard>

        <Text style={styles.sectionLabel}>Support</Text>
        <GlassCard padding={0} style={styles.listSection}>
          <HapticListItem
            title="Send Feedback"
            description="Report issues or suggest features"
            descriptionStyle={{ color: customColors.textMuted, fontSize: 12 }}
            titleStyle={{ color: theme.colors.onSurface, fontWeight: '600' }}
            left={() => <List.Icon icon="message-alert-outline" color={theme.colors.primary} />}
            right={() => <List.Icon icon="chevron-right" color={customColors.textMuted} />}
            onPress={handleComingSoon}
            style={styles.listItem}
            accessibilityLabel="Send Feedback"
            accessibilityRole="button"
          />
        </GlassCard>

        <Text style={styles.sectionLabel}>Account</Text>
        <GlassCard padding={0} style={styles.listSection}>
          <HapticListItem
            title="Logout"
            description="Sign out of your account safely"
            descriptionStyle={{ color: customColors.negative + '99', fontSize: 12 }}
            titleStyle={{ color: customColors.negative, fontWeight: '600' }}
            left={() => <List.Icon icon="logout" color={customColors.negative} />}
            onPress={handleLogout}
            style={styles.listItem}
            accessibilityLabel="Logout"
            accessibilityRole="button"
            accessibilityHint="Logs you out of the application"
          />
        </GlassCard>

        <Text style={styles.versionText}>SplitSmart v1.0.0</Text>
      </ScrollView>
    </View>
  );
};


export default AccountScreen;

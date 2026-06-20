import { useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import {
    Appbar,
    Card,
    IconButton,
    List,
    Text,
    useTheme,
} from "react-native-paper";
import HapticButton from '../components/ui/HapticButton';
import { HapticAppbarBackAction } from '../components/ui/HapticAppbar';
import { getSplitwiseAuthUrl } from "../api/client";
import { Spacing, Radii } from "../theme/colors";

const SplitwiseImportScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const customColors = theme.colors.custom;

  const handleOAuthImport = async () => {
    setLoading(true);
    try {
      const response = await getSplitwiseAuthUrl();
      const { authorization_url } = response.data;

      const supported = await Linking.canOpenURL(authorization_url);
      if (supported) {
        await Linking.openURL(authorization_url);
        Alert.alert(
          "Authorization Started",
          "Please complete the authorization in your browser. Once done, the import will start automatically.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert("Error", "Unable to open authorization link");
        setLoading(false);
      }
    } catch (error) {
      console.error("OAuth error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.detail || "Failed to initiate authorization"
      );
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: Spacing.md,
    },
    card: {
      marginBottom: Spacing.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: Radii.md,
    },
    title: {
      marginBottom: 8,
      textAlign: "center",
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    subtitle: {
      marginBottom: 24,
      textAlign: "center",
      color: customColors.textSecondary,
    },
    helperText: {
      marginTop: 16,
      textAlign: "center",
      color: customColors.textMuted,
    },
    button: {
      paddingVertical: 4,
      borderRadius: Radii.md,
    },
    infoCard: {
      marginBottom: Spacing.md,
      backgroundColor: theme.dark ? "rgba(33, 150, 243, 0.15)" : "#E3F2FD",
      borderWidth: 1,
      borderColor: theme.dark ? "rgba(33, 150, 243, 0.3)" : "#B3E5FC",
      borderRadius: Radii.md,
    },
    warningCard: {
      marginBottom: Spacing.md,
      backgroundColor: theme.dark ? "rgba(255, 152, 0, 0.15)" : "#FFF3E0",
      borderWidth: 1,
      borderColor: theme.dark ? "rgba(255, 152, 0, 0.3)" : "#FFE0B2",
      borderRadius: Radii.md,
    },
    warningText: {
      marginBottom: 4,
      color: theme.colors.onSurface,
    },
    listItemText: {
      color: theme.colors.onSurface,
      fontSize: 14,
    }
  });

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <HapticAppbarBackAction color={theme.colors.onSurface} onPress={() => navigation.goBack()} />
        <Appbar.Content title="Import from Splitwise" titleStyle={{ fontWeight: 'bold', color: theme.colors.onSurface }} />
      </Appbar.Header>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 140 }}>
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Import Your Splitwise Data
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Import all your friends, groups, and expenses with one click
            </Text>

            <HapticButton
              mode="contained"
              onPress={handleOAuthImport}
              disabled={loading}
              style={styles.button}
              icon={loading ? undefined : "login"}
              loading={loading}
              accessibilityLabel="Connect with Splitwise"
              accessibilityRole="button"
              accessibilityHint="Opens Splitwise in your browser to authorize access"
            >
              {loading ? "Connecting..." : "Connect with Splitwise"}
            </HapticButton>

            <Text variant="bodySmall" style={styles.helperText}>
              You'll be redirected to Splitwise to authorize access
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard} mode="outlined">
          <Card.Title
            title="What will be imported?"
            titleStyle={{ color: theme.colors.onSurface, fontWeight: '700' }}
            left={(props) => <IconButton {...props} icon="information" iconColor={theme.colors.primary} />}
          />
          <Card.Content>
            <List.Item
              title="All your friends and their details"
              titleStyle={styles.listItemText}
              left={(props) => <List.Icon {...props} icon="account-group" color={customColors.textSecondary} />}
            />
            <List.Item
              title="All your groups with members"
              titleStyle={styles.listItemText}
              left={(props) => <List.Icon {...props} icon="account-multiple" color={customColors.textSecondary} />}
            />
            <List.Item
              title="All expenses with split details"
              titleStyle={styles.listItemText}
              left={(props) => <List.Icon {...props} icon="currency-usd" color={customColors.textSecondary} />}
            />
            <List.Item
              title="All balances and settlements"
              titleStyle={styles.listItemText}
              left={(props) => <List.Icon {...props} icon="scale-balance" color={customColors.textSecondary} />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.warningCard} mode="outlined">
          <Card.Title
            title="Important Note"
            titleStyle={{ color: theme.colors.onSurface, fontWeight: '700' }}
            left={(props) => <IconButton {...props} icon="alert" iconColor={customColors.warning} />}
          />
          <Card.Content>
            <Text variant="bodySmall" style={styles.warningText}>
              After authorizing in your browser, please return to the app.
            </Text>
            <Text variant="bodySmall" style={styles.warningText}>
              The import will start automatically and may take a few minutes.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default SplitwiseImportScreen;

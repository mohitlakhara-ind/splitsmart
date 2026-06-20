import { useContext, useState } from "react";
import { Alert, StyleSheet, View, ScrollView } from "react-native";
import { Appbar, TextInput, Title, useTheme } from "react-native-paper";
import HapticButton from '../components/ui/HapticButton';
import { HapticAppbarBackAction } from '../components/ui/HapticAppbar';
import { joinGroup } from "../api/groups";
import { AuthContext } from "../context/AuthContext";
import { Spacing, Radii } from "../theme/colors";

const JoinGroupScreen = ({ navigation, route }) => {
  const { token } = useContext(AuthContext);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const { onGroupJoined } = route.params;
  const theme = useTheme();

  const handleJoinGroup = async () => {
    if (!joinCode) {
      Alert.alert("Error", "Please enter a join code.");
      return;
    }
    setIsJoining(true);
    try {
      await joinGroup(joinCode);
      Alert.alert("Success", "Successfully joined the group.");
      onGroupJoined(); 
      navigation.goBack();
    } catch (error) {
      console.error("Failed to join group:", error);
      Alert.alert(
        "Error",
        "Failed to join group. Please check the code and try again."
      );
    } finally {
      setIsJoining(false);
    }
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
    title: {
      fontWeight: 'bold',
      color: theme.colors.onBackground,
      marginBottom: 20,
    },
    input: {
      marginBottom: 20,
      backgroundColor: theme.colors.surface,
    },
    button: {
      marginTop: 8,
      borderRadius: Radii.md,
      paddingVertical: 4,
    },
  });

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <HapticAppbarBackAction color={theme.colors.onSurface} onPress={() => navigation.goBack()} />
        <Appbar.Content title="Join a Group" titleStyle={{ fontWeight: 'bold', color: theme.colors.onSurface }} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Title style={styles.title}>Enter Group Code</Title>
        <TextInput
          label="Join Code"
          value={joinCode}
          onChangeText={setJoinCode}
          style={styles.input}
          autoCapitalize="characters"
          mode="outlined"
          activeOutlineColor={theme.colors.primary}
          outlineColor={theme.colors.outline}
          accessibilityLabel="Group Join Code"
        />
        <HapticButton
          mode="contained"
          onPress={handleJoinGroup}
          loading={isJoining}
          disabled={isJoining}
          style={styles.button}
          accessibilityLabel="Join Group"
          accessibilityRole="button"
        >
          Join Group
        </HapticButton>
      </ScrollView>
    </View>
  );
};

export default JoinGroupScreen;

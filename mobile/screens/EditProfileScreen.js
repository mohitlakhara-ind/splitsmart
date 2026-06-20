import * as ImagePicker from "expo-image-picker";
import { useContext, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Appbar, Avatar, TextInput, Title, useTheme } from "react-native-paper";
import HapticButton from '../components/ui/HapticButton';
import { HapticAppbarBackAction } from '../components/ui/HapticAppbar';
import { updateUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { Spacing, Radii } from "../theme/colors";

const EditProfileScreen = ({ navigation }) => {
  const { user, token, updateUserInContext } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [pickedImage, setPickedImage] = useState(null); // { uri, base64 }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();
  const customColors = theme.colors.custom;

  const handleUpdateProfile = async () => {
    if (!name) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    try {
      const updates = { name };

      if (pickedImage?.base64) {
        const mime =
          pickedImage.mimeType && /image\//.test(pickedImage.mimeType)
            ? pickedImage.mimeType
            : "image/jpeg"; // fallback
        updates.imageUrl = `data:${mime};base64,${pickedImage.base64}`;
      }

      const response = await updateUser(updates);
      updateUserInContext(response.data);
      Alert.alert("Success", "Profile updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need media library permission to select an image."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      let mimeType = asset.mimeType || asset.type;
      if (mimeType && !/image\//.test(mimeType)) {
        if (mimeType === 'image') mimeType = 'image/jpeg';
      }
      if (!mimeType || !/image\//.test(mimeType)) {
        const ext = (asset.uri || "").split(".").pop()?.toLowerCase();
        if (ext === "png") mimeType = "image/png";
        else if (ext === "webp") mimeType = "image/webp";
        else if (ext === "gif") mimeType = "image/gif";
        else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
        else mimeType = "image/jpeg";
      }
      setPickedImage({ uri: asset.uri, base64: asset.base64, mimeType });
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
    profilePictureSection: {
      alignItems: "center",
      marginBottom: 24,
    },
    imageButton: {
      marginTop: 12,
      borderColor: theme.colors.primary,
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
        <Appbar.Content title="Edit Profile" titleStyle={{ fontWeight: 'bold', color: theme.colors.onSurface }} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Title style={styles.title}>Edit Your Details</Title>

        <View style={styles.profilePictureSection}>
          {pickedImage?.uri ? (
            <Avatar.Image size={100} source={{ uri: pickedImage.uri }} />
          ) : user?.imageUrl && /^(https?:|data:image)/.test(user.imageUrl) ? (
            <Avatar.Image size={100} source={{ uri: user.imageUrl }} />
          ) : (
            <Avatar.Text 
              size={100} 
              label={(user?.name || "?").charAt(0)} 
              style={{ backgroundColor: customColors.glassStrong }}
              labelStyle={{ color: theme.colors.primary, fontWeight: '700' }}
            />
          )}
          <HapticButton
            mode="outlined"
            onPress={pickImage}
            icon="camera"
            style={styles.imageButton}
            textColor={theme.colors.primary}
            accessibilityLabel="Change profile picture"
            accessibilityRole="button"
            accessibilityHint="Opens your media library to select a new photo"
          >
            {pickedImage ? "Change Photo" : "Add Photo"}
          </HapticButton>
        </View>

        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          activeOutlineColor={theme.colors.primary}
          outlineColor={theme.colors.outline}
          accessibilityLabel="Full Name"
        />
        <HapticButton
          mode="contained"
          onPress={handleUpdateProfile}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.button}
          accessibilityLabel="Save Changes"
          accessibilityRole="button"
        >
          Save Changes
        </HapticButton>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

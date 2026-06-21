import * as ImagePicker from "expo-image-picker";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Card,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import HapticButton from '../components/ui/HapticButton';
import HapticIconButton from '../components/ui/HapticIconButton';
import { HapticListItem } from '../components/ui/HapticList';
import {
  deleteGroup as apiDeleteGroup,
  leaveGroup as apiLeaveGroup,
  removeMember as apiRemoveMember,
  updateGroup as apiUpdateGroup,
  getGroupById,
  getGroupMembers,
  getOptimizedSettlements,
} from "../api/groups";
import { AuthContext } from "../context/AuthContext";
import { Spacing, Radii, Shadows } from "../theme/colors";

const ICON_CHOICES = ["👥", "🏠", "🎉", "🧳", "🍽️", "🚗", "🏖️", "🎮", "💼"];

const GroupSettingsScreen = ({ route, navigation }) => {
  const { groupId } = route.params;
  const { token, user } = useContext(AuthContext);
  const theme = useTheme();
  const customColors = theme.colors.custom;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState([]);
  const [group, setGroup] = useState(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [pickedImage, setPickedImage] = useState(null); // { uri, base64 }

  const isAdmin = useMemo(() => {
    const me = members.find((m) => m.userId === user?._id);
    return me?.role === "admin";
  }, [members, user?._id]);

  const load = async () => {
    try {
      setLoading(true);
      const [gRes, mRes] = await Promise.all([
        getGroupById(groupId),
        getGroupMembers(groupId),
      ]);
      setGroup(gRes.data);
      setName(gRes.data.name);
      setIcon(gRes.data.imageUrl || gRes.data.icon || "");
      setMembers(mRes.data);
    } catch (e) {
      console.error("Failed to load group settings", e);
      Alert.alert("Error", "Failed to load group settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && groupId) load();
  }, [token, groupId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Group Settings",
      headerStyle: { backgroundColor: theme.colors.surface },
      headerTintColor: theme.colors.onSurface,
    });
  }, [navigation, theme]);

  const onSave = async () => {
    if (!isAdmin) return;
    const updates = {};
    if (name && name !== group?.name) updates.name = name;

    if (pickedImage?.base64) {
      updates.imageUrl = `data:image/jpeg;base64,${pickedImage.base64}`;
    } else if (icon && icon !== (group?.imageUrl || group?.icon || "")) {
      const isEmoji = ICON_CHOICES.includes(icon);
      if (isEmoji) {
        updates.imageUrl = icon;
      } else {
        updates.imageUrl = icon;
      }
    }

    if (Object.keys(updates).length === 0)
      return Alert.alert("Nothing to update");
    try {
      setSaving(true);
      const res = await apiUpdateGroup(groupId, updates);
      setGroup(res.data);
      if (pickedImage) setPickedImage(null);
      Alert.alert("Updated", "Group updated successfully.");
    } catch (e) {
      console.error("Update failed", e);
      Alert.alert(
        "Error",
        e.response?.data?.detail || "Failed to update group"
      );
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    if (!isAdmin) return;
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
      setPickedImage({ uri: asset.uri, base64: asset.base64 });
    }
  };

  const onShareInvite = async () => {
    try {
      const code = group?.joinCode;
      if (!code) return;
      await Share.share({
        message: `Join my group on Splitwiser! Use code ${code}`,
      });
    } catch (e) {
      console.error("Share failed", e);
    }
  };

  const onKick = (memberId, name) => {
    if (!isAdmin) return;
    if (memberId === user?._id) return;
    Alert.alert("Remove member", `Are you sure you want to remove ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            const settlementsRes = await getOptimizedSettlements(groupId);
            const settlements =
              settlementsRes?.data?.optimizedSettlements || [];
            const hasUnsettled = settlements.some(
              (s) =>
                (s.fromUserId === memberId || s.toUserId === memberId) &&
                (s.amount || 0) > 0
            );
            if (hasUnsettled) {
              Alert.alert(
                "Cannot remove",
                "This member has unsettled balances in the group."
              );
              return;
            }
            await apiRemoveMember(groupId, memberId);
            await load();
          } catch (e) {
            console.error("Remove failed", e);
            Alert.alert(
              "Error",
              e.response?.data?.detail || "Failed to remove member"
            );
          }
        },
      },
    ]);
  };

  const onLeave = () => {
    Alert.alert(
      "Leave group",
      "You can leave only when your balances are settled. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            try {
              await apiLeaveGroup(groupId);
              Alert.alert("Left group");
              navigation.popToTop();
            } catch (e) {
              console.error("Leave failed", e);
              Alert.alert(
                "Cannot leave",
                e.response?.data?.detail || "Please settle balances first"
              );
            }
          },
        },
      ]
    );
  };

  const onDeleteGroup = () => {
    if (!isAdmin) return;
    const others = members.filter((m) => m.userId !== user?._id);
    if (others.length > 0) {
      Alert.alert(
        "Cannot delete",
        "Remove all members first, or transfer admin."
      );
      return;
    }
    Alert.alert(
      "Delete group",
      "This will permanently delete the group. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiDeleteGroup(groupId);
              Alert.alert("Group deleted");
              navigation.popToTop();
            } catch (e) {
              console.error("Delete failed", e);
              Alert.alert(
                "Error",
                e.response?.data?.detail || "Failed to delete group"
              );
            }
          },
        },
      ]
    );
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
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    card: {
      marginBottom: Spacing.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: Radii.lg,
      elevation: 2,
      shadowColor: customColors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.dark ? 0.3 : 0.05,
      shadowRadius: 6,
    },
    cardTitle: {
      color: theme.colors.onSurface,
      fontWeight: '700',
      fontSize: 18,
    },
    iconRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 12,
    },
    iconBtn: {
      marginRight: 8,
      marginBottom: 8,
      borderRadius: Radii.sm,
    },
    membersSection: {
      gap: 8,
      marginTop: 8,
    },
    joinCodeText: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
      color: theme.colors.onSurface,
    },
    btnDangerOutline: {
      borderColor: customColors.negative,
      borderRadius: Radii.md,
      paddingVertical: 4,
    },
    btnDangerContained: {
      marginTop: 12,
      backgroundColor: customColors.negative,
      borderRadius: Radii.md,
      paddingVertical: 4,
    }
  });

  const renderMemberItem = (m) => {
    const isSelf = m.userId === user?._id;
    const displayName = m.user?.name || "Unknown";
    const imageUrl = m.user?.imageUrl;
    return (
      <HapticListItem
        key={m.userId}
        title={displayName}
        titleStyle={{ color: theme.colors.onSurface, fontWeight: '600' }}
        description={m.role === "admin" ? "Admin" : undefined}
        descriptionStyle={{ color: customColors.textMuted }}
        left={() =>
          imageUrl ? (
            <Avatar.Image size={40} source={{ uri: imageUrl }} />
          ) : (
            <Avatar.Text 
              size={40} 
              label={(displayName || "?").charAt(0)} 
              style={{ backgroundColor: customColors.glassStrong }}
              labelStyle={{ color: theme.colors.primary, fontWeight: '700' }}
            />
          )
        }
        right={() =>
          isAdmin && !isSelf ? (
            <HapticIconButton
              icon="account-remove"
              onPress={() => onKick(m.userId, displayName)}
              accessibilityLabel={`Remove ${displayName} from group`}
              accessibilityRole="button"
              accessibilityHint="Removes this member from the group"
              iconColor={customColors.negative}
            />
          ) : null
        }
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card} mode="outlined">
          <Card.Title title="Group Info" titleStyle={styles.cardTitle} />
          <Card.Content>
            <TextInput
              label="Group Name"
              value={name}
              onChangeText={setName}
              editable={!!isAdmin}
              style={{ marginBottom: 16, backgroundColor: theme.colors.background }}
              mode="outlined"
              activeOutlineColor={theme.colors.primary}
              outlineColor={theme.colors.outline}
              accessibilityLabel="Group Name"
            />
            <Text style={{ marginBottom: 8, fontWeight: '600', color: theme.colors.onSurface }}>Icon Choice</Text>
            <View style={styles.iconRow}>
              {ICON_CHOICES.map((i) => (
                <HapticButton
                  key={i}
                  mode={icon === i ? "contained" : "outlined"}
                  style={styles.iconBtn}
                  onPress={() => setIcon(i)}
                  disabled={!isAdmin}
                  accessibilityLabel={`Select icon ${i}`}
                  accessibilityRole="button"
                >
                  {i}
                </HapticButton>
              ))}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
              <HapticButton
                mode="outlined"
                onPress={pickImage}
                disabled={!isAdmin}
                icon="image"
                style={{ marginRight: 12 }}
                accessibilityLabel="Change group image"
                accessibilityRole="button"
              >
                {pickedImage ? "Change Image" : "Upload Image"}
              </HapticButton>
              {pickedImage?.uri ? (
                <Image
                  source={{ uri: pickedImage.uri }}
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                />
              ) : group?.imageUrl &&
                /^(https?:|data:image)/.test(group.imageUrl) ? (
                <Image
                  source={{ uri: group.imageUrl }}
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                />
              ) : group?.imageUrl ? (
                <Text style={{ fontSize: 32 }}>{group.imageUrl}</Text>
              ) : null}
            </View>
            {isAdmin && (
              <HapticButton
                mode="contained"
                style={{ marginTop: 18, borderRadius: Radii.md }}
                loading={saving}
                disabled={saving}
                onPress={onSave}
                accessibilityLabel="Save Changes"
                accessibilityRole="button"
              >
                Save Changes
              </HapticButton>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="outlined">
          <Card.Title title="Members" titleStyle={styles.cardTitle} />
          <Card.Content style={styles.membersSection}>
            {members.map(renderMemberItem)}
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="outlined">
          <Card.Title title="Invite Code" titleStyle={styles.cardTitle} />
          <Card.Content>
            <Text style={styles.joinCodeText}>
              Join Code: {group?.joinCode}
            </Text>
            <HapticButton
              mode="outlined"
              onPress={onShareInvite}
              icon="share-variant"
              accessibilityLabel="Share invite code"
              accessibilityRole="button"
              style={{ borderRadius: Radii.md }}
            >
              Share Invite
            </HapticButton>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="outlined">
          <Card.Title title="Danger Zone" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View>
              <HapticButton
                mode="outlined"
                textColor={customColors.negative}
                onPress={onLeave}
                icon="logout-variant"
                style={styles.btnDangerOutline}
                accessibilityLabel="Leave Group"
                accessibilityRole="button"
                accessibilityHint="You must settle balances before leaving"
              >
                Leave Group
              </HapticButton>
              {isAdmin && (
                <HapticButton
                  mode="contained"
                  onPress={onDeleteGroup}
                  icon="delete"
                  style={styles.btnDangerContained}
                  textColor="#FFFFFF"
                  accessibilityLabel="Delete Group"
                  accessibilityRole="button"
                  accessibilityHint="Permanently deletes the group and all data"
                >
                  Delete Group
                </HapticButton>
              )}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default GroupSettingsScreen;

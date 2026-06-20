import { useIsFocused } from "@react-navigation/native";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Animated, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import {
  Appbar,
  Avatar,
  Divider,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import HapticIconButton from '../components/ui/HapticIconButton';
import { HapticListAccordion } from '../components/ui/HapticList';
import { triggerPullRefreshHaptic } from '../components/ui/hapticUtils';
import { getFriendsBalance, getGroups } from "../api/groups";
import { AuthContext } from "../context/AuthContext";
import { formatCurrency } from "../utils/currency";
import { Spacing, Radii } from "../theme/colors";
import GlassCard from "../components/GlassCard";

const FriendsScreen = () => {
  const { token, user } = useContext(AuthContext);
  const theme = useTheme();
  const customColors = theme.colors.custom;
  
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const isFocused = useIsFocused();

  const fetchData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const friendsResponse = await getFriendsBalance();
      const friendsData = friendsResponse.data.friendsBalance || [];
      const groupsResponse = await getGroups();
      const groups = groupsResponse?.data?.groups || [];
      const groupMeta = new Map(
        groups.map((g) => [g._id, { name: g.name, imageUrl: g.imageUrl }])
      );

      const transformedFriends = friendsData.map((friend) => ({
        id: friend.userId,
        name: friend.userName,
        imageUrl: friend.userImageUrl || null,
        netBalance: friend.netBalance,
        groups: (friend.breakdown || []).map((group) => ({
          id: group.groupId,
          name: group.groupName,
          balance: group.balance,
          imageUrl: groupMeta.get(group.groupId)?.imageUrl || null,
        })),
      }));

      setFriends(transformedFriends);
    } catch (error) {
      console.error("Failed to fetch friends balance data:", error);
      Alert.alert("Error", "Failed to load friends balance data.");
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await triggerPullRefreshHaptic();
    await fetchData(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (token && isFocused) {
      fetchData();
    }
  }, [token, isFocused]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    explanationContainer: {
      margin: Spacing.sm,
      borderColor: theme.colors.outline,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    explanationContent: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    explanationText: {
      fontSize: 12,
      color: customColors.textSecondary,
      lineHeight: 18,
      flex: 1,
      paddingRight: 8,
    },
    closeButton: {
      margin: 0,
      marginTop: -4,
    },
    emptyText: {
      textAlign: "center",
      marginTop: 60,
      color: customColors.textMuted,
      fontSize: 16,
      fontWeight: "500",
    },
    skeletonContainer: {
      padding: Spacing.md,
    },
    skeletonRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    skeletonAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.outline,
    },
    skeletonLine: {
      height: 14,
      backgroundColor: theme.colors.outline,
      borderRadius: 6,
      marginBottom: 6,
    },
    skeletonLineSmall: {
      height: 12,
      backgroundColor: theme.colors.outline,
      borderRadius: 6,
    },
  });

  const renderFriend = ({ item }) => {
    const balanceColor = item.netBalance < 0 ? customColors.negative : customColors.positive;
    const balanceText =
      item.netBalance < 0
        ? `You owe ${formatCurrency(Math.abs(item.netBalance))}`
        : `Owes you ${formatCurrency(item.netBalance)}`;

    const hasImage = !!item.imageUrl;
    let imageUri = null;
    if (hasImage) {
      if (
        /^data:image/.test(item.imageUrl) ||
        /^https?:\/\//.test(item.imageUrl)
      ) {
        imageUri = item.imageUrl;
      } else if (/^[A-Za-z0-9+/=]+$/.test(item.imageUrl.substring(0, 50))) {
        imageUri = `data:image/jpeg;base64,${item.imageUrl}`;
      }
    }

    return (
      <HapticListAccordion
        title={item.name}
        titleStyle={{ color: theme.colors.onSurface, fontWeight: '600' }}
        description={item.netBalance !== 0 ? balanceText : "Settled up"}
        descriptionStyle={{
          color: item.netBalance !== 0 ? balanceColor : customColors.textMuted,
          fontWeight: '500',
        }}
        accessibilityRole="button"
        accessibilityLabel={`Friend ${item.name}. ${
          item.netBalance !== 0 ? balanceText : "Settled up"
        }`}
        accessibilityHint="Double tap to see balance breakdown"
        style={{ backgroundColor: theme.colors.surface }}
        left={(props) =>
          imageUri ? (
            <Avatar.Image {...props} size={40} source={{ uri: imageUri }} />
          ) : (
            <Avatar.Text
              {...props}
              size={40}
              label={(item.name || "?").charAt(0)}
              style={{ backgroundColor: customColors.glassStrong }}
              labelStyle={{ color: theme.colors.primary, fontWeight: '700' }}
            />
          )
        }
      >
        {item.groups.map((group) => {
          const groupBalanceColor = group.balance < 0 ? customColors.negative : customColors.positive;
          const groupBalanceText =
            group.balance < 0
              ? `You owe ${formatCurrency(Math.abs(group.balance))}`
              : `Owes you ${formatCurrency(group.balance)}`;

          let groupImageUri = null;
          if (group.imageUrl) {
            if (
              /^data:image/.test(group.imageUrl) ||
              /^https?:\/\//.test(group.imageUrl)
            ) {
              groupImageUri = group.imageUrl;
            } else if (
              /^[A-Za-z0-9+/=]+$/.test(group.imageUrl.substring(0, 50))
            ) {
              groupImageUri = `data:image/jpeg;base64,${group.imageUrl}`;
            }
          }

          return (
            <List.Item
              key={group.id}
              title={group.name}
              titleStyle={{ color: theme.colors.onSurface, fontWeight: '500' }}
              description={groupBalanceText}
              descriptionStyle={{ color: groupBalanceColor, fontWeight: '500' }}
              left={(props) =>
                groupImageUri ? (
                  <Avatar.Image
                    {...props}
                    size={36}
                    source={{ uri: groupImageUri }}
                  />
                ) : (
                  <Avatar.Text
                    {...props}
                    size={36}
                    label={(group.name || "?").charAt(0)}
                    style={{ backgroundColor: theme.colors.outline }}
                    labelStyle={{ color: customColors.textSecondary }}
                  />
                )
              }
            />
          );
        })}
      </HapticListAccordion>
    );
  };

  // Shimmer skeleton components
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacityAnim]);

  const SkeletonRow = () => (
    <View style={styles.skeletonRow}>
      <Animated.View
        style={[styles.skeletonAvatar, { opacity: opacityAnim }]}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Animated.View
          style={[styles.skeletonLine, { width: "60%", opacity: opacityAnim }]}
        />
        <Animated.View
          style={[
            styles.skeletonLineSmall,
            { width: "40%", opacity: opacityAnim },
          ]}
        />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
          <Appbar.Content title="Friends" titleStyle={{ fontWeight: 'bold', color: theme.colors.onSurface }} />
        </Appbar.Header>
        <View
          style={styles.skeletonContainer}
          accessibilityLabel="Loading friends list"
          accessibilityRole="progressbar"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="Friends" titleStyle={{ fontWeight: 'bold', color: theme.colors.onSurface }} />
      </Appbar.Header>
      {showTooltip && (
        <GlassCard style={styles.explanationContainer} variant="default" padding={12}>
          <View style={styles.explanationContent}>
            <Text style={styles.explanationText}>
              💡 These amounts show your direct balance with each friend across
              all shared groups. Check individual group details for optimized
              settlement suggestions.
            </Text>
            <HapticIconButton
              icon="close"
              size={16}
              onPress={() => setShowTooltip(false)}
              style={styles.closeButton}
              iconColor={customColors.textMuted}
              accessibilityLabel="Close tooltip"
              accessibilityRole="button"
            />
          </View>
        </GlassCard>
      )}
      <FlatList
        data={friends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider style={{ backgroundColor: theme.colors.outline }} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No balances with friends yet.</Text>
        }
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
};

export default FriendsScreen;


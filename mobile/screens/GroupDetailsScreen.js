import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import {
  ActivityIndicator,
  Paragraph,
  Title,
  useTheme,
} from "react-native-paper";
import HapticCard from '../components/ui/HapticCard';
import HapticFAB from '../components/ui/HapticFAB';
import HapticIconButton from '../components/ui/HapticIconButton';
import * as Haptics from "expo-haptics";
import {
  getGroupExpenses,
  getGroupMembers,
  getOptimizedSettlements,
} from "../api/groups";
import { AuthContext } from "../context/AuthContext";
import { formatCurrency } from "../utils/currency";
import { Spacing, Radii, Shadows } from "../theme/colors";

const GroupDetailsScreen = ({ route, navigation }) => {
  const { groupId, groupName } = route.params;
  const { token, user } = useContext(AuthContext);
  const theme = useTheme();
  const customColors = theme.colors.custom;
  
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Currency configuration
  const currency = "₹"; 

  const formatCurrencyLocal = (amount) => `${currency}${amount.toFixed(2)}`;

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const [membersResponse, expensesResponse, settlementsResponse] =
        await Promise.all([
          getGroupMembers(groupId),
          getGroupExpenses(groupId),
          getOptimizedSettlements(groupId),
        ]);
      setMembers(membersResponse.data);
      setExpenses(expensesResponse.data.expenses);
      setSettlements(settlementsResponse.data.optimizedSettlements || []);
    } catch (error) {
      console.error("Failed to fetch group details:", error);
      Alert.alert("Error", "Failed to fetch group details.");
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchData(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    navigation.setOptions({
      title: groupName,
      headerRight: () => (
        <HapticIconButton
          icon="cog"
          onPress={() => navigation.navigate("GroupSettings", { groupId })}
          accessibilityLabel="Group settings"
          accessibilityRole="button"
          iconColor={theme.colors.onSurface}
        />
      ),
    });
    if (token && groupId) {
      fetchData();
    }
  }, [token, groupId]);

  const getMemberName = (userId) => {
    const member = members.find((m) => m.userId === userId);
    return member ? member.user.name : "Unknown";
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      flex: 1,
      padding: Spacing.md,
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
    expensesTitle: {
      marginTop: 16,
      marginBottom: 8,
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.onBackground,
    },
    fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 96, // Lifted above floating tab bar
      backgroundColor: theme.colors.primary,
      elevation: 4,
    },
    settlementContainer: {
      marginBottom: 8,
    },
    settledContainer: {
      alignItems: "center",
      paddingVertical: 12,
    },
    settledText: {
      fontSize: 16,
      color: customColors.positive,
      fontWeight: "700",
    },
    owedSection: {
      backgroundColor: theme.dark ? "rgba(239, 68, 68, 0.08)" : "rgba(239, 68, 68, 0.04)",
      borderRadius: Radii.md,
      padding: 12,
      borderLeftWidth: 4,
      borderLeftColor: customColors.negative,
      borderWidth: 1,
      borderColor: theme.dark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.08)",
      marginBottom: 12,
    },
    receiveSection: {
      backgroundColor: theme.dark ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.04)",
      borderRadius: Radii.md,
      padding: 12,
      borderLeftWidth: 4,
      borderLeftColor: customColors.positive,
      borderWidth: 1,
      borderColor: theme.dark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.08)",
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "700",
      marginBottom: 8,
      color: theme.colors.onSurface,
    },
    amountOwed: {
      color: customColors.negative,
      fontWeight: "bold",
    },
    amountReceive: {
      color: customColors.positive,
      fontWeight: "bold",
    },
    settlementItem: {
      marginVertical: 4,
    },
    personInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 2,
    },
    personName: {
      fontSize: 14,
      color: customColors.textSecondary,
      fontWeight: "500",
      flex: 1,
    },
    settlementAmount: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.onSurface,
    },
    emptyText: {
      fontSize: 14,
      color: customColors.textMuted,
      paddingVertical: 8,
    },
  });

  const renderExpense = ({ item }) => {
    const userSplit = item.splits.find((s) => s.userId === user._id);
    const userShare = userSplit ? userSplit.amount : 0;
    const paidByMe = (item.paidBy || item.createdBy) === user._id;
    const net = paidByMe ? item.amount - userShare : -userShare;

    let balanceText;
    let balanceColor = theme.colors.onSurface;

    if (net > 0) {
      balanceText = `You are owed ${formatCurrencyLocal(net)}`;
      balanceColor = customColors.positive;
    } else if (net < 0) {
      balanceText = `You borrowed ${formatCurrencyLocal(Math.abs(net))}`;
      balanceColor = customColors.negative;
    } else {
      balanceText = "You are settled for this expense.";
    }

    return (
      <HapticCard
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`Expense: ${item.description}, Amount: ${formatCurrencyLocal(
          item.amount
        )}. Paid by ${getMemberName(item.paidBy || item.createdBy)}. ${balanceText}`}
      >
        <HapticCard.Content>
          <Title style={{ color: theme.colors.onSurface, fontWeight: '700', fontSize: 17 }}>{item.description}</Title>
          <Paragraph style={{ color: customColors.textSecondary, fontSize: 14 }}>Amount: {formatCurrencyLocal(item.amount)}</Paragraph>
          <Paragraph style={{ color: customColors.textSecondary, fontSize: 14 }}>
            Paid by: {getMemberName(item.paidBy || item.createdBy)}
          </Paragraph>
          <Paragraph style={{ color: balanceColor, fontWeight: '700', marginTop: 4, fontSize: 14 }}>{balanceText}</Paragraph>
        </HapticCard.Content>
      </HapticCard>
    );
  };

  const renderSettlementSummary = () => {
    const userOwes = settlements.filter((s) => s.fromUserId === user._id);
    const userIsOwed = settlements.filter((s) => s.toUserId === user._id);
    const totalOwed = userOwes.reduce((sum, s) => sum + s.amount, 0);
    const totalToReceive = userIsOwed.reduce((sum, s) => sum + s.amount, 0);

    if (userOwes.length === 0 && userIsOwed.length === 0) {
      return (
        <View style={styles.settledContainer}>
          <Text style={styles.settledText}>✓ You are all settled up!</Text>
        </View>
      );
    }

    return (
      <View style={styles.settlementContainer}>
        {totalOwed > 0 && (
          <View style={styles.owedSection}>
            <Text style={styles.sectionTitle}>
              You need to pay:{" "}
              <Text style={styles.amountOwed}>{formatCurrencyLocal(totalOwed)}</Text>
            </Text>
            {userOwes.map((s, index) => (
              <View key={`owes-${index}`} style={styles.settlementItem}>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>
                    {getMemberName(s.toUserId)}
                  </Text>
                  <Text style={styles.settlementAmount}>
                    {formatCurrencyLocal(s.amount)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {totalToReceive > 0 && (
          <View style={styles.receiveSection}>
            <Text style={styles.sectionTitle}>
              You will receive:{" "}
              <Text style={styles.amountReceive}>
                {formatCurrencyLocal(totalToReceive)}
              </Text>
            </Text>
            {userIsOwed.map((s, index) => (
              <View key={`is-owed-${index}`} style={styles.settlementItem}>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>
                    {getMemberName(s.fromUserId)}
                  </Text>
                  <Text style={styles.settlementAmount}>
                    {formatCurrencyLocal(s.amount)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderHeader = () => (
    <>
      <HapticCard style={styles.card}>
        <HapticCard.Content>
          <Title style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 12 }}>Settlement Summary</Title>
          {renderSettlementSummary()}
        </HapticCard.Content>
      </HapticCard>

      <Title style={styles.expensesTitle}>Expenses</Title>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.contentContainer}
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No expenses recorded yet.</Text>
        }
        contentContainerStyle={{ paddingBottom: 180 }}  
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />

      <HapticFAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("AddExpense", { groupId: groupId })}
        accessibilityLabel="Add expense"
        accessibilityRole="button"
        color="#FFFFFF"
      />
    </View>
  );
};

export default GroupDetailsScreen;

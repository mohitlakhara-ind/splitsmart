import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Image,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../theme/colors';
import GlassCard from '../components/GlassCard';

// Feature: AI Bill Scanner using camera + OCR
// Uses expo-camera to capture receipt, sends to free OCR Space API
// Auto-populates expense amount and description fields

interface ScannedBillData {
  totalAmount: number;
  description: string;
  merchantName: string;
  date: string;
  items: Array<{ name: string; price: number }>;
}

const BillScannerScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedBillData | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  };

  const requestPermission = async () => {
    // Simulate permission request — in real app uses expo-camera
    // const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(true);
  };

  const scanReceipt = async (imageUri: string) => {
    setIsScanning(true);
    startPulse();

    try {
      // OCR Space API integration (free tier)
      const formData = new FormData();
      formData.append('base64Image', `data:image/jpeg;base64,${imageUri}`);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          apikey: 'K85697564188957', // free tier key
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      const text = result?.ParsedResults?.[0]?.ParsedText || '';

      // Parse OCR text for amounts using regex
      const parsed = parseReceiptText(text);
      setScannedData(parsed);
    } catch (error) {
      Alert.alert('Scan Failed', 'Could not parse receipt. Please enter manually.');
    } finally {
      setIsScanning(false);
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  };

  const parseReceiptText = (text: string): ScannedBillData => {
    // Extract total amount using regex — matches common receipt formats
    const amountRegex = /(?:total|grand total|amount|subtotal)[^\d]*(\d+[.,]\d{2})/gi;
    const merchantRegex = /^([A-Z][A-Z\s&]+)(?:\n|$)/m;
    const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/;
    const itemRegex = /(.+?)\s+(\d+\.\d{2})$/gm;

    const amountMatch = amountRegex.exec(text);
    const merchantMatch = merchantRegex.exec(text);
    const dateMatch = dateRegex.exec(text);

    const items: Array<{ name: string; price: number }> = [];
    let itemMatch;
    while ((itemMatch = itemRegex.exec(text)) !== null) {
      const price = parseFloat(itemMatch[2]);
      if (price > 0 && price < 10000) {
        items.push({ name: itemMatch[1].trim(), price });
      }
    }

    return {
      totalAmount: amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : 0,
      description: 'Scanned Receipt',
      merchantName: merchantMatch ? merchantMatch[1].trim() : 'Unknown Merchant',
      date: dateMatch ? dateMatch[1] : new Date().toLocaleDateString(),
      items,
    };
  };

  const useScannedData = () => {
    if (scannedData) {
      navigation.navigate('AddExpense', {
        prefill: {
          amount: scannedData.totalAmount,
          description: `${scannedData.merchantName} — ${scannedData.date}`,
          items: scannedData.items,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Scan Receipt</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Camera Viewfinder */}
      <View style={styles.viewfinderContainer}>
        <View style={styles.viewfinder}>
          {capturedImage ? (
            <Image source={{ uri: capturedImage }} style={styles.capturedImg} />
          ) : (
            <View style={styles.scannerUI}>
              {/* Corner brackets */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              {isScanning ? (
                <Animated.View style={[styles.scanLine, { transform: [{ scaleX: pulseAnim }] }]} />
              ) : (
                <Text style={styles.scanPrompt}>📄 Point at a receipt</Text>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Scan Result */}
      {scannedData && !isScanning && (
        <GlassCard style={styles.resultCard} variant="accent">
          <Text style={styles.resultTitle}>✅ Receipt Scanned</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Merchant</Text>
            <Text style={styles.resultValue}>{scannedData.merchantName}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Date</Text>
            <Text style={styles.resultValue}>{scannedData.date}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Amount</Text>
            <Text style={[styles.resultValue, styles.totalAmount]}>
              ₹{scannedData.totalAmount.toFixed(2)}
            </Text>
          </View>
          {scannedData.items.length > 0 && (
            <View style={styles.itemsList}>
              <Text style={styles.itemsTitle}>Line Items ({scannedData.items.length})</Text>
              {scannedData.items.slice(0, 3).map((item, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
                </View>
              ))}
              {scannedData.items.length > 3 && (
                <Text style={styles.moreItems}>+{scannedData.items.length - 3} more items</Text>
              )}
            </View>
          )}
          <TouchableOpacity style={styles.useBtn} onPress={useScannedData}>
            <Text style={styles.useBtnText}>Use This Data →</Text>
          </TouchableOpacity>
        </GlassCard>
      )}

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        {isScanning ? (
          <View style={styles.scanningState}>
            <ActivityIndicator color={Colors.accent} size="small" />
            <Text style={styles.scanningText}>Analyzing receipt...</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.captureBtn}
              onPress={() => {
                // In real app: camera.takePictureAsync() then scanReceipt()
                // Demo: use mock data
                const mockImage = null;
                scanReceipt('mockImageBase64Data');
              }}
            >
              <View style={styles.captureBtnInner} />
            </TouchableOpacity>
            <Text style={styles.captureLabel}>Tap to capture receipt</Text>
          </>
        )}
      </View>

      {/* Tip */}
      <GlassCard style={styles.tipCard} variant="default" padding={12}>
        <Text style={styles.tipText}>
          💡 Tip: Lay receipt flat in good lighting for best accuracy
        </Text>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    backgroundColor: Colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  backIcon: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.textPrimary,
  },
  viewfinderContainer: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  viewfinder: {
    width: 300,
    height: 220,
    borderRadius: Radii.lg,
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    overflow: 'hidden',
    ...Shadows.card,
  },
  capturedImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scannerUI: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: Colors.accent,
    borderWidth: 3,
  },
  cornerTL: { top: 12, left: 12, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 12, right: 12, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 12, left: 12, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 12, right: 12, borderLeftWidth: 0, borderTopWidth: 0 },
  scanLine: {
    position: 'absolute',
    width: '80%',
    height: 2,
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  scanPrompt: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily.medium,
    textAlign: 'center',
  },
  resultCard: {
    marginBottom: Spacing.md,
  },
  resultTitle: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  resultLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.regular,
  },
  resultValue: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.medium,
  },
  totalAmount: {
    fontSize: Typography.sizes.md,
    color: Colors.positive,
    fontFamily: Typography.fontFamily.bold,
  },
  itemsList: {
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
    paddingTop: Spacing.sm,
  },
  itemsTitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  itemName: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.regular,
  },
  itemPrice: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.medium,
    marginLeft: 8,
  },
  moreItems: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.regular,
    marginTop: 4,
  },
  useBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.accent,
    borderRadius: Radii.md,
    paddingVertical: 12,
    alignItems: 'center',
    ...Shadows.glow,
  },
  useBtnText: {
    fontSize: Typography.sizes.md,
    color: Colors.textInverse,
    fontFamily: Typography.fontFamily.semiBold,
  },
  actionRow: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  scanningState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  scanningText: {
    color: Colors.accent,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily.medium,
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.glass,
    borderWidth: 3,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glow,
  },
  captureBtnInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.accent,
  },
  captureLabel: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.regular,
  },
  tipCard: {
    marginBottom: Spacing.lg,
  },
  tipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default BillScannerScreen;

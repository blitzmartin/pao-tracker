import React from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import { Card, Divider, List, Text } from "react-native-paper";

export default function AboutScreen() {
  const appVersion = "1.0.0";
  const buildNumber = "1";

  const handleContactSupport = () => {
    const email = "paperboardlabs@gmail.com"; // Replace with your actual email
    const subject = "Beauty Tracker Support Request";
    const body = `App Version: ${appVersion} (${buildNumber})\nDevice: Mobile\n\nDescribe your issue or feedback:\n`;

    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailto).catch(() => {
      Alert.alert(
        "Email not configured",
        "Please send your feedback to paperboardlabs@gmail.com"
      );
    });
  };

  const handleReportBug = () => {
    const email = "paperboardlabs@gmail.com"; // Replace with support@paperboardlabs.com when ready
    const subject = "Beauty Tracker Bug Report";
    const body = `App Version: ${appVersion} (${buildNumber})\nDevice: Mobile\n\nSteps to reproduce:\n1. \n2. \n3. \n\nExpected behavior:\n\nActual behavior:\n\nAdditional notes:\n`;

    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailto).catch(() => {
      Alert.alert(
        "Email not configured",
        "Please send your bug report to paperboardlabs@gmail.com"
      );
    });
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      "Privacy Policy",
      "Beauty Tracker stores all data locally on your device. No personal information is collected or transmitted to external servers."
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Our Mission
            </Text>
            <Text variant="bodyMedium" style={styles.missionText}>
              Beauty Tracker helps you reduce waste and save money by tracking
              expiry dates and PAO (Period After Opening) for your beauty products. Our goal
              is to make it easy for everyone to manage their cosmetics and skincare
              efficiently and sustainably.
            </Text>
            <Divider style={styles.divider} />
            <Text variant="bodyMedium" style={styles.featuresTitle}>
              Key Features:
            </Text>
            <View style={styles.featuresList}>
              <Text variant="bodySmall" style={styles.featureItem}>
                • Track beauty products and cosmetics
              </Text>
              <Text variant="bodySmall" style={styles.featureItem}>
                • Smart expiry notifications
              </Text>
              <Text variant="bodySmall" style={styles.featureItem}>
                • Organize items by categories
              </Text>
              <Text variant="bodySmall" style={styles.featureItem}>
                • PAO (Period After Opening) tracking for beauty products
              </Text>
              <Text variant="bodySmall" style={styles.featureItem}>
                • Local storage - your data stays private
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Support & Feedback
            </Text>

            <List.Item
              title="Contact Support"
              description="Get help with using Beauty Tracker"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              onPress={handleContactSupport}
              style={styles.listItem}
            />

            <List.Item
              title="Report a Bug"
              description="Found an issue? Let us know!"
              left={(props) => <List.Icon {...props} icon="bug" />}
              onPress={handleReportBug}
              style={styles.listItem}
            />

            <List.Item
              title="Privacy Policy"
              description="Learn how we protect your data"
              left={(props) => <List.Icon {...props} icon="shield-check" />}
              onPress={handlePrivacyPolicy}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Technical Information
            </Text>
            <View style={styles.techInfo}>
              <View style={styles.techRow}>
                <Text variant="bodyMedium" style={styles.techLabel}>
                  Version
                </Text>
                <Text variant="bodyMedium" style={styles.techValue}>
                  {appVersion} (Build {buildNumber})
                </Text>
              </View>
              <View style={styles.techRow}>
                <Text variant="bodyMedium" style={styles.techLabel}>
                  Platform:
                </Text>
                <Text variant="bodyMedium" style={styles.techValue}>
                  React Native
                </Text>
              </View>
              <View style={styles.techRow}>
                <Text variant="bodyMedium" style={styles.techLabel}>
                  Storage:
                </Text>
                <Text variant="bodyMedium" style={styles.techValue}>
                  Local Device Only
                </Text>
              </View>
              <View style={styles.techRow}>
                <Text variant="bodyMedium" style={styles.techLabel}>
                  Data Sync:
                </Text>
                <Text variant="bodyMedium" style={styles.techValue}>
                  None (Privacy First)
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  appName: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  version: {
    textAlign: "center",
    color: "#6B7280",
  },
  sectionTitle: {
    color: "#1F2937",
    marginBottom: 12,
    fontWeight: "600",
  },
  missionText: {
    lineHeight: 22,
    color: "#374151",
    marginBottom: 16,
  },
  divider: {
    marginVertical: 12,
  },
  featuresTitle: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  featuresList: {
    paddingLeft: 8,
  },
  featureItem: {
    color: "#6B7280",
    marginBottom: 4,
    lineHeight: 18,
  },
  listItem: {
    paddingVertical: 4,
  },
  techInfo: {
    marginTop: 8,
  },
  techRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  techLabel: {
    color: "#6B7280",
    fontWeight: "500",
  },
  techValue: {
    color: "#374151",
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
});

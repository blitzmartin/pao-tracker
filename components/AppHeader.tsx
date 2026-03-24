import { AppColors, Colors } from '@/constants/Theme';
import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Simple icon-based logo for Beauty Tracker
const BeautyTrackerLogo = () => (
  <Avatar.Icon
    size={40}
    icon="face-woman-shimmer-outline"
    style={{
      backgroundColor: AppColors.beauty,
    }}
  />
);

export function AppHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: '#fff',
          paddingTop: insets.top + 16,
        },
      ]}
    >
      <View style={styles.headerContent}>
        <BeautyTrackerLogo />
        <Text
          variant="headlineMedium"
          style={[styles.title, { color: Colors.light.brand }]}
        >
          PAO Tracker
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
  },
});

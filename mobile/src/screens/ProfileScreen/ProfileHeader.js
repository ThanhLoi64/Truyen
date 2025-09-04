import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Header = () => {
  return (
    <View style={styles.header}>
      <Ionicons
        name="logo-designernews"
        size={32}
        color="red"
        style={styles.logo}
      />
      <Text style={{ fontSize: 18, fontWeight: "bold", }}>Profile</Text>
      <Ionicons name="notifications-outline" size={24} color="black" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logo: {
    marginRight: 10,
  },
  icon: {
    marginLeft: 10,
  },
});

export default Header;

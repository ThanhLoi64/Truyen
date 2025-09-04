import React from "react";
import { View, TextInput, StyleSheet, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Header = () => {
  return (
    <View style={styles.header}>
      <Ionicons name="logo-designernews" size={32} style={styles.logo} />
     
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="#888"
        />
        <Ionicons name="search" size={24} color="black" style={styles.icon} />
      </View>
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
    borderBottomColor: "#fff",
  },
  logo: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    paddingVertical: 8,
  },
  icon: {
    marginLeft: 10,
  },
});

export default Header;


import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeStackNavigator from "./HomeStackNavigator";
import ProfileScreen from "../screens/ProfileScreen";
import { View, StyleSheet, TextInput, SafeAreaView } from "react-native";
import SearchBar from '../components/Search/search'
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          return <Ionicons
            name={iconName}
            size={size}
            color={color}
          />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: '#ffff',
          padding: 8,
          borderTopColor: '#333'
        },
        header: (props) => {
          if (route.name === "Home") {
            return <SearchBar />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  navbar: {
    padding: 10,
    backgroundColor: '#fff',

  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,

  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,

  },
});

export default MainTabNavigator;

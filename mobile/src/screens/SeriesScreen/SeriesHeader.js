import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
const SeriesHeader = ({ categoryName }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-3 z-50">
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1,justifyContent:'center' ,zIndex:12}}>

        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>{categoryName}</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  icon: {
    marginRight: 15,
  },
});

export default SeriesHeader;

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const Genres = ({ genres, onCategoryPress }) => {
  const navigation = useNavigation();
  return (
    <View className="m-2.5" >
      <View style={styles.header}>
        <Text style={styles.headerText}>Danh mục</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AllCategoriesScreen")}>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList className=""
        data={genres}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onCategoryPress(item)}>
            <View className="p-2.5 bg-gray-200 mr-2.5 rounded-lg">
              <Text className="text-base">{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  reloadButton: {
    padding: 10,
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  reloadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,

  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default Genres;

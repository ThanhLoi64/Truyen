import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { searchPost } from "../../api/user";
import { showMessageError } from "../../../showMessage";

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [titles, setTitles] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      setSearchInput("");
    }, [])
  );

  const handleSearch = async (input) => {
    const trimmedInput = input.trim().replace(/\s+/g, " ");
    if (trimmedInput.length === 0) {
      setTitles([]);
      return;
    }
    try {
      const data = await searchPost(trimmedInput);
      if (data && data.items && data.items.length > 0) {
        setTitles(data.items);
      } else {
        setTitles([]); 
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleChangeText = (text) => {
    setSearchInput(text);
    handleSearch(text);
  };

  const handleSearchSubmit = () => {
    if (searchInput.trim() !== "") {
      navigation.navigate("SearchResults", { searchTerm: searchInput });
    }
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSearchSubmit(item)}
    >
      {item.thumbnailImg?.url && (
        <Image
          source={{ uri: item.thumbnailImg.url }}
          style={styles.thumbnail}
        />
      )}
      <Text style={styles.title}>{item.title}</Text>

    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View
        style={[
          styles.common,
          Platform.OS === 'ios' ? styles.iosSpecific : styles.androidSpecific
        ]}
      >
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        {Platform.OS === 'android' && <StatusBar barStyle="dark-content" backgroundColor='#fff' />}

        <View style={styles.container}>
          <Ionicons
            name="search-outline"
            size={24}
            color="gray"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Tìm kiếm..."
            placeholderTextColor="gray"
            value={searchInput}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSearchSubmit}
          />
        </View>
        <FlatList
          data={titles}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  common: {

  },
  iosSpecific: {
    paddingTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  androidSpecific: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
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
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "gray",
  },
  dropdown: {
    position: "absolute",
    top: 100,
    left: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 1000,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    color: "black",
    paddingLeft: 16,
  },
});

export default SearchBar;

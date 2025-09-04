import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { CategoryList } from "../../api/user";
import SeriesHeader from "./SeriesHeader";

const SeriesScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoryId) {
      fetchCategories(categoryId);
    }
  }, [categoryId]);

  const fetchCategories = async (CategoryId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await CategoryList(CategoryId);
      if (response && response.items) {
        setCategories(response.items);
      } else {
        setError("Invalid data format from API");
      }
    } catch (error) {
      setError("Failed to fetch data from API");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const handleNovelPress = (novel) => {
    navigation.navigate("NovelDetail", { novel });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      className="flex-row mb-2 bg-white p-2 rounded-lg shadow-md"
      onPress={() => handleNovelPress(item)}
    >
      <Image
        source={{
          uri: item.thumbnailImg ? item.thumbnailImg.url : "https://via.placeholder.com/150",
        }}
        className="w-24 h-36 rounded-lg"
      />
      <View className="flex-1 ml-2">
        <Text className="text-xl font-bold">{item.title}</Text>
        <Text className="text-lg mt-1">Tác giả: {item.author}</Text>
        <Text className="text-sm mt-1">Lượt vote: {item.voteCount}</Text>
        <Text className="text-sm mt-1" numberOfLines={2} ellipsizeMode="tail">
          Mô tả: {item.summary}
        </Text>
        <Text className="text-xs mt-1 text-gray-500">Ngày tạo: {formatDate(item.createdDate)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <SeriesHeader categoryName={categoryName} />
      {categories.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("../../assets/Images/empty.png")}
            className="w-48 h-48"
            style={{ resizeMode: "contain" }}
          />
          <Text>Danh mục chưa có truyện </Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
};

const LoadingIndicator = () => (
  <SafeAreaView className="flex-1 justify-center items-center">
    <Text>Loading...</Text>
  </SafeAreaView>
);

const ErrorMessage = ({ message }) => (
  <SafeAreaView className="flex-1 justify-center items-center">
    <Text className="text-red-500">{message}</Text>
  </SafeAreaView>
);

export default SeriesScreen;

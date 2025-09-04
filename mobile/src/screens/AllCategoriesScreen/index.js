import React, { Component } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from "react-native";
import { fetchAllCategories } from "../../api/user";
import Icon from "react-native-vector-icons/Ionicons"; 

class AllCategoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
  }

  componentDidMount = async () => {
    await this.fetchData();
  };

  fetchData = async () => {
    try {
      const categoriesData = await fetchAllCategories();
      this.setState({
        categories: categoriesData,
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API: ", error);
    }
  };

  handleCategoryPress = (category) => {
    this.props.navigation.navigate("SeriesScreen", {
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  handleBackPress = () => {
    this.props.navigation.goBack();  
  };

  render() {
    const { categories } = this.state;
    const sortedCategories = categories.sort((a, b) => a.name.length - b.name.length);

    return (
      <SafeAreaView className ="flex-1">
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={this.handleBackPress} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Tất cả thể loại</Text>
          </View>
          <ScrollView contentContainerStyle={styles.categoriesContainer}>
            {sortedCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryButton}
                onPress={() => this.handleCategoryPress(category)}
              >
                <Text
                  style={styles.categoryText}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 10,
  },
  headerText: {
    fontSize: 24,

    textAlign: "center",
  },
  categoriesContainer: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 25,
    marginVertical: 5,
    width: Dimensions.get('window').width * 0.8,
    alignItems: "center",
  },
  categoryText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default AllCategoriesScreen;

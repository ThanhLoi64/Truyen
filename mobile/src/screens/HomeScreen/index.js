import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  StatusBar,
} from "react-native";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setIsLoggedIn } from "../../redux/actions/login";
import Ionicons from "react-native-vector-icons/Ionicons";
import VoteNovels from "./ListBookHome/VoteNovels";
import UpdateNovels from "./ListBookHome/UpdateNovels";
import Genres from "./ListBookHome/Genres";
import { fetch5Categories, listBookUpdateNovels } from "../../api/user";
import HotNovel from "./ListBookHome/HotNovel";
import SuggestNovels from "./ListBookHome/SuggestNovels";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenExpiredDate: null,
      genres: [],
      novels: [],
      refreshing: false,
      refreshKey: 0,
    };
  }

  componentDidMount = async () => {
    await this.fetchData();
  };

  fetchData = async () => {
    try {
      const genresData = await fetch5Categories();
      const novelsData = await listBookUpdateNovels();
      this.setState({
        genres: genresData,
        novels: novelsData.items,
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API:", error);
    }
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState(prevState => ({
        refreshing: false,
        refreshKey: prevState.refreshKey + 1,
      }));
    }, 1000);
  };

  handleReloadPress = () => {
    this.props.navigation.navigate("Home");
  };

  handleCategoryPress = (category) => {
    this.props.navigation.navigate("SeriesScreen", {
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  handleButtonPress = async () => {
    await AsyncStorage.removeItem("tokenExpiredDate");
    this.props.setIsLoggedIn(false);
    this.props.navigation.navigate("LoginScreen");
  };

  handleButtonLoginPress = () => {
    this.props.navigation.navigate("LoginScreen");
  };

  handleButtonRegisterPress = () => {
    this.props.navigation.navigate("RegisterScreen");
  };

  handleButtonReadPress = () => {
    this.props.navigation.navigate("Read");
  };

  render() {
    const { genres, novels, refreshing, refreshKey } = this.state;

    return (
      <SafeAreaView style={{ flex: 1 }} >
        <FlatList
        
          data={novels}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={() => (
            <>
              <HotNovel />
              <Genres genres={genres} onCategoryPress={this.handleCategoryPress} />
              <SuggestNovels />
              <VoteNovels />
              <UpdateNovels />
            </>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
          contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.login.isLoggedIn,
});

const mapDispatchToProps = {
  setIsLoggedIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

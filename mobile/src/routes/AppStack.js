// AppStack.js
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import AuthScreen from '../screens/AuthScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import NovelDetailScreen from '../screens/NovelDetailScreen';
import ChapterListScreen from '../screens/ChapterListScreen';
import MainTabNavigator from '../navigation/MainTabNavigator';
import SeriesScreen from '../screens/SeriesScreen';
import AllCategoriesScreen from '../screens/AllCategoriesScreen';
import ChapterDetailScreen from '../screens/ChapterDetailScreen';
import SeriesNovelScreen from '../screens/SeriesNovelSreen';
import ProfileChangePass from '../screens/ProfileScreen/ProfileChangePass';
import ProfileChangeName from '../screens/ProfileScreen/ProfileChangeName';
import SearchBar from '../components/Search/search';
import SearchResultsScreen from '../screens/SearchResultsScreen';


const Stack = createStackNavigator();

const AppStack = () => {
  return (

    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="ProfileChangePass" component={ProfileChangePass} />
      <Stack.Screen name="ProfileChangeName" component={ProfileChangeName} />
      <Stack.Screen name="SearchBar" component={SearchBar} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="NovelDetail" component={NovelDetailScreen} options={{ title: 'Chi tiết truyện' }} />
      <Stack.Screen name="Search" component={SearchBar} />
      <Stack.Screen name="ChapterList" component={ChapterListScreen} options={{ title: 'Danh sách chương' }} />
      <Stack.Screen name="ChapterDetail" component={ChapterDetailScreen} options={{ title: 'Đọc truyện' }} />
      <Stack.Screen name="SeriesNovelScreen" component={SeriesNovelScreen} options={{ title: 'Danh sách truyện' }} />
      <Stack.Screen name="SeriesScreen" component={SeriesScreen} />
      <Stack.Screen name="AllCategoriesScreen" component={AllCategoriesScreen} />
    </Stack.Navigator>

  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    width: '100%',
    height: '100%',

  },
});

export default AppStack;

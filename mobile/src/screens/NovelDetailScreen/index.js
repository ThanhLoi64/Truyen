import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  ImageBackground,
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { fetchNovelDetail, fetchChapterList, isVoteGet, postAct } from "../../api/user";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { LinearGradient } from "expo-linear-gradient";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import { showMessageWarning } from "../../../showMessage";
import { NOT_CHAPTER } from "../../../errorConstants";
const NovelDetailScreen = () => {
  const route = useRoute();
  const { novel } = route.params ?? {};
  const navigation = useNavigation();
  const [postActData, setPostActData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const actionSheetRef = useRef(null);
  const [isVoted, setIsVoted] = useState(novel?.isVoted || false);
  const [voteCount, setVoteCount] = useState(novel?.voteCount || 0);
  const fetchDataVote = async () => {
    try {
      if (novel && novel.id) {
        const voteData = await isVoteGet(novel.id);
        setIsVoted(voteData.isVoted || false);
      }
    } catch (error) {
      return null;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDataVote();
    }, [novel?.id])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNovelDetail(novel.hashId);
        setChapters(data.chapters || []);
        const chapterData = await fetchChapterList(novel.hashId);
        setChapters(chapterData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (novel?.hashId) {
      fetchData();
    }
  }, [novel?.hashId]);

  const handleButtonChapterListPress = () => {
    actionSheetRef.current?.setModalVisible(true);
  };

  const handleReadButtonPress = () => {
    if (chapters.length > 0) {
      navigation.navigate("ChapterDetail", {
        chapterId: chapters[0].hashId,
        novel,
      });
    } else {
      showMessageWarning(NOT_CHAPTER);
    }
  };
  const totalChapters = chapters.length;
  const handleCategoryPress = (categoryId, categoryName) => {
    navigation.navigate("SeriesScreen", { categoryId, categoryName });
  };
  const handleVoteUpdate = (newVoteCount, voted) => {
    setVoteCount(newVoteCount);
    setIsVoted(voted);
  };

  const renderHeader = () => (
    <View>
      <SafeAreaView>
        <View className="relative h-40 rounded-[0_0_20px_20px]">
          <ImageBackground
            source={{ uri: novel.coverImg?.url }}
            className="h-40 rounded-[0_0_20px_20px]"
          >
            {/* <StatusBar translucent backgroundColor="transparent" barStyle="light-content" /> */}
            <View style={styles.gradientOverlay} />
            <Header
              novelId={novel.id}
              novelVote={isVoted}
              onVoteUpdate={handleVoteUpdate}
              voteCount={voteCount}
            />
          </ImageBackground>
        </View>

        <View className="px-5">
          <View className="relative flex-row mt-[-70px]">
            <Image
              source={{ uri: novel.thumbnailImg?.url }}
              className="w-[92px] h-[155px] rounded-lg shadow-lg relative  border-2 border-solid border-white"
            />
            <View className="ml-4 justify-between flex-1">
              <Text className="leading-5 text-white text-[16px] mt-[25px] flex-wrap overflow-hidden">
                {novel.title}
              </Text>
              <View className="flex-wrap items-baseline mt-[30px]">
                <TouchableOpacity
                  onPress={() =>
                    handleCategoryPress(novel.categoryId, novel.categoryName)
                  }
                  className="bg-white py-1 px-2 rounded-[5px] border border-[#6200EE] m-1"
                >
                  <Text className="text-[#6200EE] text-[10px] ">
                    {novel.categoryName}
                  </Text>
                </TouchableOpacity>
                <View className="flex ">
                  <Text className="font-bold mt-2 text-[12px]">
                    Tác giả: {novel.author}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                      Lượt vote: {voteCount}
                    </Text>
                    <View
                      style={{
                        width: 1,
                        height: 12,
                        backgroundColor: "gray",
                        marginHorizontal: 8,
                      }}
                    />
                    <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                      Lượt view: {novel.view}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <Text className="mt-4 text-gray-800 leading-6">{novel.summary}</Text>
          <View
            style={{
              borderBottomColor: "#615252",
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginTop: 10,
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );

  const renderChapterItem = ({ item, index }) => (
    <View style={{ margin: 5, borderRadius: 10 }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ChapterDetail", {
            chapterId: item.hashId,
            novel,
          })
        }
      >
        <View className="py-2 px-5 ">
          <Text>{`Chương ${index + 1}: ${item.title}`}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );


  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView nestedScrollEnabled={true}>
        <View>
          <FlatList ListHeaderComponent={renderHeader} scrollEnabled={false} />
        </View>
        <View className="mb-4">
          {chapters.length === 0 && (
            <Text className="mt-4 px-5 text-[18px] font-bold">
              Truyện chưa có chương
            </Text>
          )}
          {totalChapters > 0 && (
            <View>
              {totalChapters <= 10 ? (
                <View style={{ display: "block" }}>
                  <View className="mt-3 ml-6">
                    <Text className="text-black text-xl font-bold">
                      Danh sách chương
                    </Text>
                  </View>
                  <FlatList
                    data={chapters.slice(0, 10)}
                    renderItem={renderChapterItem}
                    numColumns={1}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  className="rounded-lg overflow-hidden p-5"
                  onPress={handleButtonChapterListPress}
                >
                  <LinearGradient
                    colors={["#E2C696", "#E2C696"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    locations={[0, 0.7]}
                    className="rounded-lg m-0 p-2 items-center flex flex-row max-w-[180px] justify-center"
                  >
                    <Text className="text-white text-sm font-bold ">{`Danh sách chương (${totalChapters})`}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <SafeAreaView>
        <ActionSheet ref={actionSheetRef}>
          <View style={{ height: 600, marginBottom: 20 }}>
            <View className="overflow-hidden rounded-[9px_9px_0_0]">
              <Text className="p-2 text-white font-[bold] text-[28px] text-center bg-[#7c6b4d]">
                {novel.title}
          
              </Text>
            </View>
            <ScrollView style={{ flex: 1, paddingTop: 10 }}>
              {chapters.map((chapter, index) => (
                <TouchableOpacity
                  className="border-b-[#c6bcbc5c] border-b border-solid "
                  key={index}
                  onPress={() => {
                    actionSheetRef.current?.setModalVisible(false);
                    navigation.navigate("ChapterDetail", {
                      chapterId: chapter.hashId,
                      novel,
                    });
                  }}
                >
                  <Text
                    style={{ paddingVertical: 10, paddingLeft: 10 }}
                  >{`Chương ${index + 1}: ${chapter.title}`}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ActionSheet>
      </SafeAreaView>
      <Footer
        totalChapters={totalChapters}
        handleReadButtonPress={handleReadButtonPress}
        handleButtonChapterListPress={handleButtonChapterListPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default NovelDetailScreen;

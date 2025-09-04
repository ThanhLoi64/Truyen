import React from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import HeaderVote from "./Header";



const SeriesNovelScreen = ({ route, navigation }) => {
    const { title, novels } = route.params;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleNovelPress = (novel) => {
        navigation.navigate("NovelDetail", { novel });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            key={item.id}
            style={{ flexDirection: 'row', marginBottom: 10, padding: 10, backgroundColor: 'white', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}
            onPress={() => handleNovelPress(item)}
        >
            <Image
                source={{
                    uri: item.thumbnailImg ? item.thumbnailImg.url : "https://via.placeholder.com/150",
                }}
                style={{ width: 100, height: 150, borderRadius: 8 }}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
                <Text style={{ fontSize: 16, marginTop: 5 }}>Tác giả: {item.author}</Text>
                <Text style={{ fontSize: 14, color: 'gray', marginTop: 5 }}>Lượt vote: {item.voteCount}</Text>
                <Text style={{ fontSize: 14, marginTop: 5 }} numberOfLines={2} ellipsizeMode="tail">
                    Mô tả: {item.summary}
                </Text>
                <Text style={{ fontSize: 12, color: 'gray', marginTop: 5 }}>Ngày tạo: {formatDate(item.createdDate)}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderVote title={title} />
            <FlatList
                data={novels}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 10 }}
            />
        </SafeAreaView>
    );
};

export default SeriesNovelScreen;

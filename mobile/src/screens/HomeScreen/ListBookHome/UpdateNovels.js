import React, { useState } from "react";
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { listBookUpdateNovels } from "../../../api/user";

const UpdateNovels = () => {
    const [novels, setNovels] = useState([]);
    const navigation = useNavigation();

    const fetchNovels = async () => {
        try {
            const data = await listBookUpdateNovels();
            setNovels(data.items);
        } catch (error) {
            console.error('Error fetching novels:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchNovels();
        }, [])
    );

    const handleNovelPress = (novel) => {
        navigation.navigate('NovelDetail', { novel });
    };

    const handleFullNovel = () => {
        navigation.navigate('SeriesNovelScreen', { title: "Truyện mới cập nhật", novels });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.novelContainer} onPress={() => handleNovelPress(item)}>
            <Image source={{ uri: item.thumbnailImg?.url }} style={styles.thumbnail} />
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                    {item.title}
                </Text>
                <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">
                    {item.author}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Truyện mới cập nhật</Text>
                <TouchableOpacity onPress={handleFullNovel}>
                    <Ionicons name="chevron-forward-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={novels.slice(0, 9)}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    novelContainer: {
        flex: 1,
        margin: 5,
        alignItems: 'left',
    },
    thumbnail: {
        width: 115,
        height: 160,
        borderRadius: 8,
        marginBottom: 5,
    },
    textContainer: {
        alignItems: 'start',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left',
     
    },
    author: {
        fontSize: 12,
        color: '#33333391',
        marginTop: 2,
        textAlign: 'left',
    },
    listContent: {
        justifyContent: 'space-between',
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
});

export default UpdateNovels;

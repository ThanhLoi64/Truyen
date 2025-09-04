import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchTopView } from "../../../api/user";

const SuggestNovels = () => {
    const [novels, setNovels] = useState([]);
    const navigation = useNavigation();

    const fetchNovels = async () => {
        try {
            const data = await fetchTopView();
            setNovels(data.items);
            console.log(data);
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

    const displayedNovels = novels.slice(0, 5);

    const renderItem = ({ item: novel }) => (
        <TouchableOpacity key={novel.id} style={styles.novelContainer} onPress={() => handleNovelPress(novel)}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: novel.thumbnailImg?.url }} style={styles.image} />
                <View style={styles.eyeIconContainer}>
                    <Ionicons name="eye-outline" size={15} color="white" />
                    <Text className="text-white text-[12px]">({novel.view})</Text>
                </View>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail"> {novel.title} </Text>
                <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail"  > {novel.author} </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Gợi ý cho bạn</Text>
            </View>

            {displayedNovels.length > 0 ? (
                <FlatList
                    data={displayedNovels}
                    renderItem={renderItem}
                    keyExtractor={novel => novel.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps='always'
                />
            ) : (
                <Text>No novels found</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    novelContainer: {
        marginRight: 10,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: 115,
        height: 170,
        borderRadius: 8,
        marginBottom: 5,
    },
    eyeIconContainer: {
        gap: 5,
        position: 'absolute',
        top: 5,
        left: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewCount: {
        color: 'white',
        marginLeft: 5,
        fontSize: 12,
    },

    textContainer: {
        alignItems: 'start'
    },
    title: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
        maxWidth: 110,
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        maxWidth: 140,
        color: '#333',
        marginTop: 2,
    },
});

export default SuggestNovels;

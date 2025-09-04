import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchChapterList, fetchNovelDetail } from '../../api/user';
import { Ionicons } from '@expo/vector-icons';

const ChapterListScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { novelId } = route.params;
    const [chapters, setChapters] = useState([]);
    const [novelInfo, setNovelInfo] = useState({});

    useEffect(() => {
        const fetchNovelAndChapters = async () => {
            try {
                const novelData = await fetchNovelDetail(novelId);
                setNovelInfo(novelData);

                const chapterData = await fetchChapterList(novelId);
                setChapters(chapterData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchNovelAndChapters();
    }, [novelId]);

    const handleChapterPress = (chapter) => {
        navigation.navigate('ChapterDetail', { chapterId: chapter.hashId, novelId });
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.sectionTitle}>Danh sách chương</Text>
                <Text style={styles.headerTitle}>{novelInfo.name}</Text>
            </View>
            <View style={styles.content}>
                <FlatList
                    data={chapters}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <Pressable
                            style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: 'gray' }}
                            onPress={() => handleChapterPress(item)}
                        >
                            <Text>{`Chương ${index + 1}: ${item.title}`}</Text>
                        </Pressable>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#E4E4E3',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    backButton: {
        position: 'absolute',
        left: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        marginTop: 64,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 8,
    },
});

export default ChapterListScreen;

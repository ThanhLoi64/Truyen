import React, { useCallback, useState } from "react";
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchTopSeries } from "../../../api/user";

const VoteNovels = () => {
    const [novels, setNovels] = useState([]);
    const navigation = useNavigation();

    const fetchNovels = async () => {
        try {
            const data = await fetchTopSeries();
            setNovels(data.items);
            console.log(data);
        } catch (error) {
            console.error('Error fetching novels:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNovels();
        }, [])
    );

    const handleNovelPress = (novel) => {
        navigation.navigate('NovelDetail', { novel });
    };

    const handleFullNovel = () => {
        navigation.navigate('SeriesNovelScreen', { title: "BXH bình chọn", novels });
    };

    const renderItem = ({ item, index }) => {
        let medal;
        if (index === 0) {
            medal = <Image className="w-[30px] h-[30px]" source={require('../../../assets/Images/number-1.png')} />;
            medalItem = <Image className="w-[20px] h-[20px]" source={require('../../../assets/Images/medal-gold.png')} />;
        } else if (index === 1) {
            medal = <Image className="w-[30px] h-[30px]" source={require('../../../assets/Images/number-2.png')} />;
            medalItem = <Image className="w-[20px] h-[20px]" source={require('../../../assets/Images/medal-sliver.png')} />;
        } else if (index === 2) {
            medal = <Image className="w-[30px] h-[30px]" source={require('../../../assets/Images/number-3.png')} />;
            medalItem = <Image className="w-[20px] h-[20px]" source={require('../../../assets/Images/medal-bronze.png')} />;
        } else if (index === 3) {
            medal = <Image className="w-[30px] h-[30px]" source={require('../../../assets/Images/number-4.png')} />;
        } else if (index === 4) {
            medal = <Image className="w-[30px] h-[30px]" source={require('../../../assets/Images/number-5.png')} />;
        }

        return (
            <TouchableOpacity style={styles.novelContainer} onPress={() => handleNovelPress(item)}>
                {medal && <View style={styles.medalContainer}>{medal}</View>}

                <View className="relative">
                    {index <= 2 && medalItem && <View className="absolute z-20 right-0">{medalItem}</View>}
                    <Image source={{ uri: item.thumbnailImg?.url }} style={styles.thumbnail} />
                </View>
                <View className="items-start ml-3">
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                        {item.title}
                    </Text>
                    <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">
                        {item.author}
                    </Text>
                    <Text style={styles.summary} numberOfLines={1} ellipsizeMode="tail">
                        {item.summary.replace(/\n/g, ' ')}
                    </Text>
                    {/* <View className="flex-row items-center  gap-1 mt-2">
                        <Ionicons name="eye" size={15} color="black" />
                        <Text className="text-black text-[12px] font-bold">({item.view})</Text>
                    </View> */}
                    <View className="flex-row items-center  gap-1 mt-2">
                        <Ionicons name="heart" size={15} color="red" />
                        <Text className="text-black text-[12px] font-bold">{item.voteCount || '0'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>BXH bình chọn</Text>
                <Image style={{ width: 25, height: 25 }} source={require('../../../assets/Images/fire.png')} />
                <TouchableOpacity onPress={handleFullNovel} className='flex-1 items-end'>
                    <Ionicons name="chevron-forward-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <FlatList
                bounces={false}
                data={novels.slice(0, 5)}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
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

        alignItems: 'center',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    novelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    medalContainer: {
        marginRight: 10,
    },
    thumbnail: {
        width: 60,
        height: 90,
        borderRadius: 8,
        marginBottom: 5,
    },

    title: {
        fontSize: 16,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    author: {
        fontSize: 12,
        textAlign: 'left',
        color: '#33333391',
        marginTop: 2,
    },
    summary: {
        fontSize: 12,
        textAlign: 'left',
        color: '#333',
        marginTop: 2,
        maxWidth: 250,
    },
    listContent: {
        paddingBottom: 10,
    },
});

export default VoteNovels;

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { fetchTopView } from '../../../api/user';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
const { width: screenWidth } = Dimensions.get('window');

const HotNovel = () => {
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

    const handleNovelHot = (novel) => {
        navigation.navigate('NovelDetail', { novel });
    };

    const renderItem = ({ item }) => {
        try {
            return (
                <Pressable onPress={() => handleNovelHot(item)}>
                    <View style={styles.itemContainer}>
                        <Image source={{ uri: item.thumbnailImg?.url }} style={styles.image} />
                        <LinearGradient
                            colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
                            style={styles.overlay}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}

                        >
                            <View className="flex-row items-center">
                                <Text className="text-white font-bold text-lg mr-2 text-center pl-2 pr-2" numberOfLines={2}>{item.title}</Text>
                                {/* <View className="flex-row items-center">
                                    <Ionicons name="eye" size={16} color="#fff" />
                                    <Text className="text-white text-sm ml-1">{item.view}</Text>
                                </View> */}
                            </View>

                        </LinearGradient>
                    </View>
                </Pressable>
            );
        } catch (error) {
            console.error('Error rendering item:', error);
            return null;
        }
    };

    return (
        <SafeAreaView>
            <View style={styles.carouselContainer}>
                <Text className="text-[25px] font-bold ml-[13px] mr-auto my-0">Truyện hot</Text>
                <Carousel
                    width={screenWidth * 0.7}
                    height={screenWidth * 0.6}
                    data={novels}
                    renderItem={renderItem}
                    style={{ overflow: 'visible' }}
                    mode="parallax"
                    loop
                    autoPlayInterval={3000}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        marginTop: 20,
        marginBottom: 40,
        alignItems: 'center',
    },
    itemContainer: {
        elevation: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        marginHorizontal: 20,
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        bottom: -10,
        left: 0,
        right: 0,
        height: '30%',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 10
    },
    image: {
        width: screenWidth * 0.6,
        height: screenWidth * 0.8,
        borderRadius: 8,
    },
    title: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 10,
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default HotNovel;

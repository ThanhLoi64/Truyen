import React, { useState, useEffect, useRef } from 'react';
import { Platform, View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, SafeAreaView, Pressable, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchChapterDetail, fetchChapterList, fetchView, postAct } from '../../api/user';
import { Ionicons } from '@expo/vector-icons';
import ActionSheet from 'react-native-actions-sheet';

import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import FooterChapter from './footer/Footer';
import { showMessagesucces } from '../../../showMessage';

const ChapterDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { chapterId, novel } = route.params;
    const [fontSize, setFontSize] = useState(16);
    const [lineHeight, setlineHeight] = useState(26);
    const [bgColor, setBgColor] = useState('#FFFFFF');
    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paragraphIndex, setParagraphIndex] = useState(0);
    const [chapters, setChapters] = useState([]);
    const [currentChapterTitle, setCurrentChapterTitle] = useState('');
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const actionSheetRef = useRef(null);
    const [scrollY] = useState(new Animated.Value(0));
    const diffClamp = Animated.diffClamp(scrollY, 0, 100);
    const [timeoutId, setTimeoutId] = useState(null);
    const scrollViewRef = useRef(null);
    const markdownItInstance = MarkdownIt({ typographer: true });
    const paragraphRefs = useRef([]);
    useEffect(() => {
        const fetchChapterData = async () => {
            try {
                const chapterData = await fetchChapterDetail(chapterId);
                setChapter(chapterData);
                const chapterList = await fetchChapterList(novel.hashId);
                setChapters(chapterList);
                const index = chapterList.findIndex(ch => ch.hashId === chapterId);
                setCurrentChapterIndex(index);
                setCurrentChapterTitle(chapterList[index].title);


                // await postAct({
                //     postHashId: novel.hashId,
                //     chapterHashId: chapterId,
                //     pos: 150
                // });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchChapterData();
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const timer = setTimeout(async () => {
            await fetchView(chapterId);
        }, 5000);
        setTimeoutId(timer);
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [chapterId, novel.hashId])

    const handleBackToNovelDetail = () => {
        navigation.goBack();
    };

    const handleViewChapterList = () => {
        actionSheetRef.current?.setModalVisible(true);
    };

    const handleChapterPress = (chapterId) => {
        actionSheetRef.current?.setModalVisible(false);
        navigation.navigate('ChapterDetail', { chapterId, novel });
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
    };

    const disableNext = currentChapterIndex === chapters.length - 1;
    const disablePrev = currentChapterIndex === 0;

    const handleNextChapter = () => {
        if (currentChapterIndex < chapters.length - 1) {
            const nextChapterId = chapters[currentChapterIndex + 1].hashId;
            navigation.navigate('ChapterDetail', { chapterId: nextChapterId, novel });

            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };

    const handlePrevChapter = () => {
        if (currentChapterIndex > 0) {
            const prevChapterId = chapters[currentChapterIndex - 1].hashId;
            navigation.navigate('ChapterDetail', { chapterId: prevChapterId, novel });

            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };


    //Font size
    const handleDecreaseFontSize = () => {
        setFontSize(prevFontSize => Math.max(16, prevFontSize - 2));
    };

    const handleIncreaseFontSize = () => {
        setFontSize(prevFontSize => Math.min(23, prevFontSize + 2));
    };


    //Line Height
    const handleDecreaseLineHeight = () => {
        setlineHeight(prevLineHeight => Math.max(26, prevLineHeight - 2));
    };
    const handleIncreaseLineHeight = () => {
        setlineHeight(prevLineHeight => Math.min(34, prevLineHeight + 4));
    };



    const headerTranslateY = diffClamp.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -120],
    });

    const footerTranslateY = diffClamp.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 100],
    });




    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
    );
    useEffect(() => {
        const handleSavePosition = async () => {
            try {
                console.log(scrollY._value)
                const paragraphIndex = Math.floor(scrollY._value / 100);
                setParagraphIndex(paragraphIndex);
                await postAct({
                    postHashId: novel.hashId,
                    chapterHashId: chapterId,
                    pos: paragraphIndex,
                });

            } catch (error) {
                console.error('Error saving position:', error);
            }
        };
        const saveInterval = setInterval(handleSavePosition, 1000);
        return () => clearInterval(saveInterval);
    }, [scrollY, chapterId, novel.hashId]);


    const renderParagraphs = (text) => {
        const markdownStyles = getMarkdownStyles(fontSize, lineHeight);
        const paragraphs = text.split('\n').filter(paragraph => paragraph.trim() !== '');
        const timer = setTimeout(async () => {
            let posArray = []
            if (paragraphRefs) {
                paragraphRefs.current.forEach((el, index) => {
                    el.measure((x, y, width, height, pageX, pageY) => {
                        posArray.push({ id: `pos${index + 1}`, x: pageX, y: pageY });
                        // After getting all positions, update the state
                        if (posArray.length === el.current.length) {
                         // setPositions(posArray);
                        }
                      });
                })
            }
            //paragraphRefs.current[1].scrollIntoView({behavior: "smooth"})
            //Scroll in to api pos 
        }, 500);
        return paragraphs.map((paragraph, index) => (
            <View key={index} style={styles.paragraphContainer} ref={el => paragraphRefs.current[index] = el}>
                <Text style={[styles.paragraphText, markdownStyles.body]} id={`pos-${index + 1}`}>
                    {`${paragraph}`}
                </Text>
            </View>
        ));
    };

    return (
        <View style={{ flex: 1, backgroundColor: bgColor, }}>
            <View style={{ flex: 1, backgroundColor: bgColor, }}>
                <Animated.View elevation={5} style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
                    {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
                    <Pressable onPress={handleBackToNovelDetail} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </Pressable>
                    <View style={styles.titleContainer}>
                        <Text numberOfLines={2} style={styles.chapterTitle}>Chương {currentChapterIndex + 1}: {currentChapterTitle} </Text>

                        <Text className="text-black">scroll: {paragraphIndex}</Text>
                    
                    </View>
                </Animated.View>
                <Animated.ScrollView
                    ref={scrollViewRef}
                    style={styles.content}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    bounces={false}
                >
                    {chapter?.body && renderParagraphs(chapter.body)}
                    <Text style={styles.space}></Text>
                </Animated.ScrollView>

                <Animated.View style={[styles.footer, { transform: [{ translateY: footerTranslateY }] }]}>
                    <FooterChapter
                        handleViewChapterList={handleViewChapterList}
                        handleNextChapter={handleNextChapter}
                        handlePrevChapter={handlePrevChapter}
                        disableNext={disableNext}
                        disablePrev={disablePrev}
                        fontSize={fontSize}
                        onIncreaseFontSize={handleIncreaseFontSize}
                        onDecreaseFontSize={handleDecreaseFontSize}
                        lineHeight={lineHeight}
                        onIncreaseLineHeight={handleIncreaseLineHeight}
                        onDecreaseLineHeight={handleDecreaseLineHeight}
                        setBgColor={setBgColor}
                    />
                </Animated.View>

                <ActionSheet ref={actionSheetRef}>
                    <View style={{ height: 600, marginBottom: 20 }}>
                        <View style={styles.actionSheetHeader}>
                            <Text style={styles.actionSheetTitle}>{novel.title}</Text>
                        </View>
                        <ScrollView nestedScrollEnabled={true} style={{ flex: 1, paddingTop: 10 }}>
                            {chapters.map((item, index) => (
                                <TouchableOpacity
                                    style={styles.chapterItem}
                                    key={index}
                                    onPress={() => handleChapterPress(item.hashId)}
                                >
                                    <Text style={styles.chapterItemText}>Chương {index + 1}: {item.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </ActionSheet>

            </View>
        </View>
    );
};
const getMarkdownStyles = (fontSize, lineHeight) => ({
    body: {
        color: '#222',
        lineHeight: lineHeight,
        fontSize: fontSize,

    },
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 55 : 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        elevation: 4,

        borderBottomColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    space: {
        marginTop: 100,

    },

    titleContainer: {
        flex: 1,

    },
    chapterTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'left',
        marginLeft: 10
    },
    content: {
        padding: Platform.OS === 'ios' ? 100 : 60,

        paddingHorizontal: 10,
        flexGrow: 1,

    },
    chapterContent: {
        body: {
            color: '#222',
            lineHeight: 27,

        },
    },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
    },
    actionSheetHeader: {
        overflow: 'hidden',
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
        backgroundColor: '#7c6b4d',
        padding: 10,
    },
    actionSheetTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    chapterItem: {
        borderBottomColor: '#c6bcbc5c',
        borderBottomWidth: 1,
        paddingVertical: 10,
        paddingLeft: 10,
        textTransform: 'lowercase'
    },
    chapterItemText: {
        fontSize: 16,
        textTransform: 'capitalize'
    },
});


export default ChapterDetailScreen;

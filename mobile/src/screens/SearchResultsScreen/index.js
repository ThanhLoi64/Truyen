import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    SafeAreaView,
    ActivityIndicator
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { searchPost } from "../../api/user";

const SearchResultsScreen = ({ route, navigation }) => {
    const { searchTerm } = route.params;
    const [titles, setTitles] = useState([]);
    const [searchInput, setSearchInput] = useState(searchTerm);
    const [noResults, setNoResults] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState("");

    const fetchResults = async (page = 1) => {
        if (loading || (page > totalPages && !isRefreshing)) return;

        setLoading(true);

        try {
            const data = await searchPost(searchInput, page);
            if (data.items && data.items.length > 0) {
                setTitles((prevTitles) =>
                    page === 1 ? data.items : [...prevTitles, ...data.items]
                );
                setTotalPages(data.totalPages || 1);
                setNoResults(false);
                setError("");
            } else {
                setNoResults(true);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchInput.length >= 3) {
            fetchResults();
        }
    }, [searchInput]);

    const handleItemPress = (novel) => {
        navigation.navigate("NovelDetail", { novel });
    };

    const handleSearchInputChange = (text) => {
        setSearchInput(text);
    };

    const handleSearchSubmit = () => {
        if (searchInput.trim().length < 3) {
            setError("Từ khóa tìm kiếm phải có ít nhất 3 ký tự.");
            setNoResults(false);
        } else {
            setError("");
            setCurrentPage(1);
            fetchResults(1);
        }
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages && !loading) {
            setLoading(true);
            setTimeout(() => {
                setCurrentPage((prevPage) => prevPage + 1);
                fetchResults(currentPage + 1);
            }, 1000);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchResults(1);
        setIsRefreshing(false);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleItemPress(item)}
        >
            {item.thumbnailImg?.url && (
                <Image
                    source={{ uri: item.thumbnailImg.url }}
                    style={styles.thumbnail}
                />
            )}
            <View style={styles.detailsContainer}>
                <View style={styles.infoRow}>
                    <Text style={styles.title}>{item.title}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Lượt vote:</Text>
                    <Text style={styles.value}>{item.voteCount}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Tác giả:</Text>
                    <Text style={styles.value}>{item.author}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Thể Loại:</Text>
                    <Text style={styles.value}>{item.categoryName}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Trạng thái:</Text>
                    <Text
                        style={[
                            styles.value,
                            item.isCompleted ? styles.completed : styles.inProgress
                        ]}
                    >
                        {item.isCompleted ? "Hoàn thành" : "Đang ra"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <Ionicons
                        name="search-outline"
                        size={24}
                        color="gray"
                        style={styles.icon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm..."
                        value={searchInput}
                        onChangeText={handleSearchInputChange}
                        onSubmitEditing={handleSearchSubmit}
                    />
                </View>
            </View>
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : noResults ? (
                <Text style={styles.noResultsText}>Kết quả tìm kiếm không tồn tại: {searchInput}</Text>
            ) : (
                <FlatList
                    data={titles}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "white",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    backButton: {
        padding: 10,
        marginRight: 10,
        borderRadius: 10,

    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 40,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: "#ffff",
    },
    icon: {
        position: 'absolute',
        left: 10,
        zIndex: 1,
    },
    resultItem: {
        flexDirection: "row",
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    thumbnail: {
        width: 80,
        height: 120,
        borderRadius: 10,
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: "space-between",
    },
    infoRow: {
        flexDirection: "row",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    label: {
        fontSize: 14,
        color: "gray",
        marginRight: 5,
    },
    value: {
        fontSize: 14,
        color: "black",
    },
    completed: {
        color: "green",
    },
    inProgress: {
        color: "red",
    },
    noResultsText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginVertical: 10,
    },
});

export default SearchResultsScreen;

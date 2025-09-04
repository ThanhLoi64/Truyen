import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const HeaderVote = ({ title }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <Ionicons onPress={() => navigation.goBack()} name="chevron-back-outline" size={24} color="tomato" style={styles.icon} />
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Ionicons name="book-outline" size={24} color="tomato" style={styles.icon} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'tomato' }}>{title}</Text>
            </View>
            <Ionicons name="settings-outline" size={24} color="tomato" style={styles.icon} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    icon: {
        marginRight: 15,
    },
});

export default HeaderVote;

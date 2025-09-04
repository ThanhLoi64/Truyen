import React, { useEffect, useState } from 'react';
import { Pressable, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, SafeAreaView, Text, TextInput, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { checkLoginStatus, editUser, getUserInfo } from '../../../api/user';
import { showMessageError, showMessagesucces } from '../../../../showMessage';
import DateTimePicker from '@react-native-community/datetimepicker';
const ProfileChangeName = () => {
    const [id, setId] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [userName, setUserName] = useState("");
    const [roles, setRoles] = useState([""]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const toggleDatepicker = () => {
        setShowPicker(!showPicker);
    };


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                checkLoginStatus(setIsLoggedIn, setUserName, setRoles, setId);
                const userInfo = await getUserInfo();
                setId(userInfo.id);
                setFirstName(userInfo.firstName);
                setLastName(userInfo.lastName);
                setDateOfBirth(formatDisplayDate(new Date(userInfo.dateOfBirth)));

            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };
        fetchUserInfo();
    }, []);

    const onChange = ({ type }, selectedDate) => {
        if (type === "set") {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            if (Platform.OS === "android") {
                toggleDatepicker();
                setDateOfBirth(formatDisplayDate(currentDate));
            }
        } else {
            toggleDatepicker();
        }
    };

    const formatDisplayDate = (rawDate) => {
        let date = new Date(rawDate);
        let day = date.getDate().toString().padStart(2, '0');
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatISODate = (rawDate) => {
        return new Date(rawDate).toISOString();
    };

    const confirmIOSdate = () => {
        setDateOfBirth(formatDisplayDate(date));
        toggleDatepicker();
    };


    const handleSubmit = async (e) => {
        const formattedDateOfBirth = formatISODate(date);
        e.preventDefault();
        if (!firstName || !lastName || !formattedDateOfBirth) {
            showMessageError('Không được để trường trống');
            return;
        }
        try {
            await editUser(id, oldPassword, newPassword, firstName, lastName, formattedDateOfBirth, roles);
            showMessagesucces("Đổi thông tin thành công");
        } catch (error) {
            showMessageError('Error', 'Failed to update profile');
            console.error(error);
        }
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <KeyboardAvoidingView keyboardVerticalOffset={Platform.select({ ios: 0 })} behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <SafeAreaView style={styles.container} className="w-[100%]">
                    <View style={styles.wrapper}>
                        <Text style={styles.headerText}>Thông tin cá nhân</Text>
                        <TextInput
                            placeholder="id"
                            placeholderTextColor="#7A7B7B"
                            style={[styles.input, { display: 'none' }]}
                            value={id}
                        />

                        <TextInput
                            placeholder="Họ"
                            placeholderTextColor="#7A7B7B"
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <TextInput
                            placeholder="Tên"
                            placeholderTextColor="#7A7B7B"
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        <TextInput
                            placeholder="Mật khẩu cũ"
                            placeholderTextColor="#7A7B7B"
                            style={[styles.input, { display: 'none' }]}
                            secureTextEntry={true}
                            value={oldPassword}
                            onChangeText={setOldPassword}
                        />
                        <TextInput
                            placeholder="Mật khẩu mới"
                            placeholderTextColor="#7A7B7B"
                            style={[styles.input, { display: 'none' }]}
                            secureTextEntry={true}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        {/* <Text>Ngày sinh</Text> */}

                        {!showPicker && (
                            <Pressable onPress={toggleDatepicker}>
                                <TextInput
                                    placeholder="Năm sinh"
                                    placeholderTextColor="#7A7B7B"
                                    style={styles.input}
                                    value={dateOfBirth}
                                    editable={false}
                                    onPressIn={toggleDatepicker}
                                />
                            </Pressable>
                        )}
                        {showPicker && (
                            <DateTimePicker
                                mode="date"
                                display='spinner'
                                value={date}
                                onChange={onChange}
                                maximumDate={new Date()}
                                style={styles.datePicker}
                            />
                        )}
                        {showPicker && Platform.OS === "ios" && (
                            <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 30, alignItems: 'center' }}>
                                <TouchableOpacity onPress={toggleDatepicker} className="p-2 bg-slate-500 rounded">
                                    <Text className="text-white text-sm ">Hủy bỏ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={confirmIOSdate} className="p-2 bg-slate-500 rounded">
                                    <Text className="text-white text-sm">Xác nhận</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <View className="mb-5">
                            <TextInput
                                placeholder="Vai trò"
                                placeholderTextColor="#7A7B7B"
                                style={[styles.input, { display: 'none' }]}
                                value={roles.join(',')}
                                editable={false}
                            />
                            <Text className="text-[#838383] italic mt-1">Vai trò: {roles.join(', ')}</Text>

                        </View>

                        <Pressable onPress={handleSubmit} style={styles.changeButton}>
                            <Text style={styles.changeButtonText}>Lưu thay đổi</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {
        width: '80%',
    },
    headerText: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 10,
        borderRadius: 4,
    },
    changeButton: {
        backgroundColor: 'rgb(226, 198, 150)',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    changeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    datePicker: {
        height: 120,
        marginTop: -10,
    },
    iosButton: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    iosButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ProfileChangeName;

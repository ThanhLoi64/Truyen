import React, { useState } from 'react';
import { Pressable, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, SafeAreaView, Text, TextInput, View, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { changePassword } from '../../../api/user';
import { showMessageError, showMessagesucces } from '../../../../showMessage';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileChangePass = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async () => {

        if (!oldPassword || !newPassword || !confirmPassword) {
            showMessageError('Không được để trường trống');
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessageError("Xác nhận mật khẩu không khớp");
            return;
        }

        if (oldPassword === newPassword) {
            showMessageError("Mật khẩu cũ không được trùng với mật khẩu mới");
            return;
        }

        let passwordReg = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
        if (!passwordReg.test(newPassword)) {
            showMessageError("Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa và ký tự đặc biệt.");
            return;
        }

        try {
            await changePassword(oldPassword, newPassword, confirmPassword);
            showMessagesucces("Đổi mật khẩu thành công");
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
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
                        <Text style={styles.headerText}>Thay đổi mật khẩu</Text>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                placeholder="Mật khẩu cũ"
                                placeholderTextColor="#7A7B7B"
                                style={styles.input}
                                secureTextEntry={!showOldPassword}
                                value={oldPassword}
                                onChangeText={setOldPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowOldPassword(!showOldPassword)}
                            >
                                <Icon name={showOldPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                placeholder="Mật khẩu mới"
                                placeholderTextColor="#7A7B7B"
                                style={styles.input}
                                secureTextEntry={!showNewPassword}
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowNewPassword(!showNewPassword)}
                            >
                                <Icon name={showNewPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                placeholder="Xác nhận mật khẩu"
                                placeholderTextColor="#7A7B7B"
                                style={styles.input}
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <Pressable
                            onPress={handleSubmit}
                            style={styles.changeButton}
                        >
                            <Text className="text-white font-bold">Đổi mật khẩu</Text>
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
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 4,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
    },
    changeButton: {
        backgroundColor: 'rgb(226, 198, 150)',
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
    }
});

export default ProfileChangePass;

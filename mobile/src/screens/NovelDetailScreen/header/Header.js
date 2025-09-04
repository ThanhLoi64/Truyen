import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { votePost } from '../../../api/user';
import { showMessageError } from '../../../../showMessage';

const Header = ({ novelId, novelVote, onVoteUpdate, voteCount }) => {
  const navigation = useNavigation();
  const [isVoting, setIsVoting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  const handleVotePress = async () => {
    if (isVoting) return;

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        showMessageError('Vui lòng đăng nhập để sử dụng');
        return;
      }

      setIsVoting(true);

      const response = await votePost(novelId);
      if (response === true) {
        onVoteUpdate(voteCount + 1, true);
      } else {
        onVoteUpdate(voteCount - 1, false);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showMessageError('Vui lòng đăng nhập để sử dụng');
      } else {
        showMessageError('Lỗi khi vote:', error.message || 'Đã xảy ra lỗi không xác định.');
      }
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <SafeAreaView>
      <View className="absolute inset-0 bg-black opacity-30" />
      <View className="flex-row items-center justify-between absolute top-0 left-0 right-0 h-[60px] px-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-4">
          <Icon name="arrow-back-circle-outline" size={40} color="#fff" />
        </TouchableOpacity>
        <View className="absolute right-4">
          <TouchableOpacity onPress={handleVotePress} disabled={isVoting} className="p-2">
            <Icon name={novelVote ? "heart" : "heart-outline"} size={40} color={novelVote ? "red" : "#fff"} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

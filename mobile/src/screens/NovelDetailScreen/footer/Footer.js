import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Footer = ({ handleReadButtonPress, handleButtonChapterListPress, totalChapters }) => {
  return (
    <View className=" bottom-0 w-full bg-white p-2 border-t border-gray-300 flex-row justify-center">
      {/* <TouchableOpacity className="rounded-lg overflow-hidden mr-2" onPress={handleButtonChapterListPress}>
        <LinearGradient
          colors={['#E2C696', '#E2C696']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          locations={[0, 0.7]}
          className="rounded-lg py-2 px-5 items-center flex flex-row"
        >
          <Text className="text-white text-sm font-bold">{`Chương (${totalChapters})`}</Text>
        </LinearGradient>
      </TouchableOpacity> */}
      <TouchableOpacity className="rounded-lg overflow-hidden flex-1" onPress={handleReadButtonPress}>
        <LinearGradient
          colors={['#E2C696', '#E2C696']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          locations={[0, 0.7]}
          className="rounded-lg py-2 px-5 items-center"
        >
          <Text className="text-white text-sm font-bold">Đọc truyện</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

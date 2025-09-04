import React, { useRef, useState } from 'react';
import { TouchableOpacity, View, Image, Text, SafeAreaView, Pressable, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actions-sheet';
import Slider from '@react-native-community/slider';
import * as Brightness from 'expo-brightness';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FooterChapter = ({
  handleViewChapterList,
  handleNextChapter,
  handlePrevChapter,
  disableNext,
  disablePrev,
  onIncreaseFontSize,
  onDecreaseFontSize,
  fontSize,
  onIncreaseLineHeight,
  onDecreaseLineHeight,
  lineHeight,
  setBgColor
}) => {
  const actionSheetRef = useRef(null);
  const [brightness, setBrightness] = useState(0.5);

  const handleOptionList = () => {
    actionSheetRef.current?.setModalVisible(true);
  };

  const handleBrightnessChange = (value) => {
    setBrightness(value);
    Brightness.setBrightnessAsync(value);
  };

  return (
    <View>
      <ActionSheet ref={actionSheetRef} className="m-3">
        <SafeAreaView>
          <View style={{ height: 400, marginBottom: 20 }}>
            <View className="p-5">
              <View>
                <Text className="text-sm font-bold">Độ sáng</Text>
                <View className="flex-row items-center justify-between">
                  <Ionicons name="sunny-outline" size={24} />
                  <Slider
                    style={{ width: '80%', height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    value={brightness}
                    onValueChange={handleBrightnessChange}
                    minimumTrackTintColor="#E2C696"
                    maximumTrackTintColor="#E2C696"
                  />
                  <Ionicons name="sunny" size={24} color='#E2C696' />
                </View>
              </View>
              <View>
                <Text className="text-sm font-bold">Size</Text>
                <View className="flex-row justify-between">
                  <View className="flex-row items-center mt-2">
                    <TouchableOpacity
                      onPress={onDecreaseFontSize}
                      className="bg-[#eae8e8] pt-2 pl-5 pr-5 pb-2 rounded-[30px]"
                    >
                      <Text className="text-[20px] font-normal">A-</Text>
                    </TouchableOpacity>
                    <Text className="m-3 text-[14px]">{fontSize}</Text>
                    <TouchableOpacity
                      onPress={onIncreaseFontSize}
                      className="bg-[#eae8e8] pt-2 pl-5 pr-5 pb-2 rounded-[30px]"
                    >
                      <Text className="text-[20px] font-normal">A+</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row items-center mt-2">
                    <TouchableOpacity onPress={onDecreaseLineHeight} className="bg-[#eae8e8] pt-2 pl-5 pr-5 pb-2 rounded-[30px]">
                      <Ionicons name="chevron-collapse" size={24} />
                    </TouchableOpacity>
                    <Text className="m-3 text-[14px]">{lineHeight}</Text>
                    <TouchableOpacity onPress={onIncreaseLineHeight} className="bg-[#eae8e8] pt-2 pl-5 pr-5 pb-2 rounded-[30px]">
                      <Ionicons name="chevron-expand" size={24} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {/* <View>
                <Text className="text-sm font-bold mt-3">Màu nền</Text>
                <View className="flex-row items-center justify-around mt-3">
                  <Pressable
                    className="bg-white pt-8 pl-6 pr-10 border-2 border-yellow-500 rounded-[20px]"
                    onPress={() => setBgColor('#FFFFFF')}
                  ></Pressable>
                  <Pressable
                    className="bg-[#ebe6e3] pt-8 pl-6 pr-10 rounded-[20px]"
                    onPress={() => setBgColor('#ebe6e3')}
                  ></Pressable>
                  <Pressable
                    className="bg-[#6f7075] pt-8 pl-6 pr-10 rounded-[20px]"
                    onPress={() => setBgColor('#6f7075')}
                  ></Pressable>
                  <Pressable
                    className="bg-[#101013] pt-8 pl-6 pr-10 rounded-[20px]"
                    onPress={() => setBgColor('#101013')}
                  ></Pressable>
                </View>
              </View> */}
            </View>
          </View>
        </SafeAreaView>
      </ActionSheet>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: 15,
          margin: 10,
          borderRadius: 10,
          borderTopColor: 'gray',
          position: 'sticky',
          bottom: 20,
          left: 0,
          right: 0,
          zIndex: 99,
          borderBottomColor: '#000',
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
        }}
      >
        <TouchableOpacity onPress={handlePrevChapter} disabled={disablePrev}>
          <Icon name="arrow-back-outline" size={30} color={disablePrev ? '#CCCCCC' : '#000000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleViewChapterList}>
          <Icon name="list-outline" size={30} color={'#565656'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOptionList}>
          <Icon name="settings-outline" size={30} color={'#565656'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextChapter} disabled={disableNext}>
          <Icon name="arrow-forward-outline" size={30} color={disableNext ? '#CCCCCC' : '#000000'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FooterChapter;

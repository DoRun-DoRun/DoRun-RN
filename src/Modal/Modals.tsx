import React from 'react';
import {Dimensions, View} from 'react-native';
import {ButtonComponent, NotoSansKR} from '../Component';
import styled from 'styled-components';
import {ModalHeadBorder} from './CustomModal';
import LottieView from 'lottie-react-native';
import {defaultData, usedItemImage} from '../../store/data';
import FastImage from 'react-native-fast-image';

export const ShareModal = () => {
  return (
    <View style={{gap: 24}}>
      <ModalHeadBorder />
      <View style={{gap: 24}}>
        <NotoSansKR size={18} weight="Bold" textAlign="center">
          우리가 해냈어요!{'\n'}
          두런두런이 여러분의 앞길을 응원할게요!
        </NotoSansKR>
        <ImageContainer>
          <ImageDummy />
        </ImageContainer>

        <View style={{gap: 8}}>
          <ButtonComponent>친구한테 자랑하기</ButtonComponent>
          <ButtonComponent type="secondary">이미지 저장하기</ButtonComponent>
        </View>
      </View>
    </View>
  );
};

export const ImageZoomModal = () => {
  return (
    <View style={{gap: 24, alignItems: 'center'}}>
      <ModalHeadBorder />
      <ZoomImageDummy />
    </View>
  );
};

export const AlertItemModal = () => {
  return (
    <View style={{gap: 24, alignItems: 'center'}}>
      <ModalHeadBorder />
      <ZoomImageDummy />
      <NotoSansKR size={18} weight="Bold" textAlign="center">
        이런! [닉네임A]님이{'\n'}
        [아이템]을 사용했어요!
      </NotoSansKR>
    </View>
  );
};

export const UsedItemModal = ({
  user_name,
  item_no,
  character_no,
}: {
  user_name: string;
  item_no: number;
  character_no: number;
}) => {
  return (
    <View style={{gap: 24, alignItems: 'center'}}>
      <ModalHeadBorder />
      <View style={{width: 240, height: 240}}>
        {item_no === 1 ? (
          <LottieView
            source={usedItemImage.bomb[character_no]}
            style={{flex: 1}}
            autoPlay
          />
        ) : (
          <FastImage
            source={usedItemImage.hammer[character_no]}
            style={{flex: 1}}
          />
        )}
      </View>
      <NotoSansKR size={18} weight="Bold" textAlign="center">
        [{user_name}]님에게{'\n'}
        {item_no === 1 ? '[폭탄]을' : '[망치]를'}
        사용했어요!
      </NotoSansKR>
    </View>
  );
};

export const DailyModal = ({
  item_type,
  item_no,
}: {
  item_type: 'Avatar' | 'Item' | 'Nothing';
  item_no: number;
}) => {
  const width = Dimensions.get('window').width;
  return (
    <View style={{gap: 24, alignItems: 'center'}}>
      <ModalHeadBorder />
      {item_type === 'Nothing' ? (
        <NotoSansKR size={18} weight="Bold" textAlign="center">
          오늘도 수고했어요.{'\n'}
          내일도 화이팅!
        </NotoSansKR>
      ) : (
        <>
          <View style={{width: width, height: 256, padding: 24}}>
            <FastImage
              source={defaultData[item_type][item_no - 1].URL}
              resizeMode="contain"
              style={{flex: 1}}
            />
          </View>
          <NotoSansKR size={18} weight="Bold" textAlign="center">
            오늘도 수고했어요.{'\n'}
            보상으로 [{defaultData[item_type][item_no - 1].NAME}]을 받았어요!
          </NotoSansKR>
        </>
      )}
    </View>
  );
};

const ImageDummy = styled(View)`
  width: 248px;
  height: 264px;
  background: ${props => props.theme.gray6};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84;
  elevation: 3;
`;

const ImageContainer = styled(View)`
  justify-content: center;
  align-items: center;
`;

const ZoomImageDummy = styled(View)`
  width: 264px;
  height: 264px;
  background: ${props => props.theme.gray6};
`;

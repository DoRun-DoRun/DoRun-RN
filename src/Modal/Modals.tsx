import React, {useEffect, useState} from 'react';
import {Dimensions, Image, View} from 'react-native';
import {
  ButtonComponent,
  ContentSave,
  GetImage,
  NotoSansKR,
  RowContainer,
  convertUTCToKoKRDay,
  timeSince,
} from '../Component';
import {ModalHeadBorder, ModalHeadText} from './CustomModal';
import LottieView from 'lottie-react-native';
import {
  ItemName,
  completeText,
  defaultData,
  groupImage,
  usedItemImage,
} from '../../store/data';
import FastImage from 'react-native-fast-image';

interface ParticipantsType {
  USER_NM: string;
  progress: number;
}
export interface ChallengeLogType {
  CHALLENGE_MST_NM: string;
  CHALLENGE_MST_NO: number;
  CHALLENGE_USER_NO: number;
  START_DT: string;
  END_DT: string;
  participants: ParticipantsType[];
}

const ShareModalComponent = ({
  onShare,
  response,
}: {
  onShare?: any;
  response: ChallengeLogType;
}) => {
  const [randomIndex, setRandomIndex] = useState(0);
  const [randomText, setRandomText] = useState({text: '', person: ''});

  useEffect(() => {
    // 0부터 2까지의 랜덤한 정수 생성
    const index = Math.floor(Math.random() * 2);
    const textIndex = Math.floor(Math.random() * completeText.length);
    setRandomIndex(index);
    const selectedText = completeText[textIndex];
    const splitText = selectedText.split('-');
    const textBeforeDash = splitText[0].trim();
    const textAfterDash = splitText[1].trim();
    setRandomText({text: textBeforeDash, person: textAfterDash});
  }, []);
  return (
    <View style={{gap: 24, backgroundColor: 'white'}}>
      <ModalHeadText>
        <NotoSansKR size={18}>
          [{response.CHALLENGE_MST_NM}] 챌린지 완료!
        </NotoSansKR>
      </ModalHeadText>

      <View style={{gap: 8}}>
        <NotoSansKR size={18}>챌린지 기간</NotoSansKR>
        <NotoSansKR size={16} weight="Medium">
          {`${convertUTCToKoKRDay(response.START_DT)} ~ ${convertUTCToKoKRDay(
            response.END_DT,
          )}`}
        </NotoSansKR>
      </View>

      <View style={{gap: 8}}>
        <NotoSansKR size={18}>함께 완주한 친구들</NotoSansKR>
        <View style={{gap: 4}}>
          {response.participants.map((user: ParticipantsType, key) => {
            return (
              <RowContainer seperate key={key}>
                <NotoSansKR size={16} weight="Medium">
                  {user.USER_NM}
                </NotoSansKR>
                <NotoSansKR size={16} weight="Medium">
                  {user.progress > 80
                    ? `${user.progress + 20}점으로 완주 했어요!`
                    : '99점으로 열심히 달리고 있어요!'}
                </NotoSansKR>
              </RowContainer>
            );
          })}
        </View>
      </View>

      <View style={{alignItems: 'center', marginTop: -10}}>
        <Image
          source={groupImage[randomIndex]}
          resizeMode="cover"
          style={{width: '90%', height: 150}}
        />
        <View style={{alignItems: 'center'}}>
          <NotoSansKR size={16}>{randomText.text}</NotoSansKR>
          <NotoSansKR size={16}>{randomText.person}</NotoSansKR>
        </View>
      </View>

      <View>
        <ButtonComponent onPress={onShare}>친구한테 자랑하기</ButtonComponent>
        {/* <ButtonComponent type="secondary" onPress={onShare}>
            이미지 저장하기
          </ButtonComponent> */}
      </View>
    </View>
  );
};

export const ShareModal = ({response}: {response: ChallengeLogType}) => {
  return (
    <ContentSave file_name={`dorun_${response.CHALLENGE_MST_NO}`}>
      <ShareModalComponent response={response} />
    </ContentSave>
  );
};

export const ImageZoomModal = ({file_name}: {file_name: string}) => {
  return (
    <View style={{gap: 24, alignItems: 'center'}}>
      <ModalHeadBorder />
      <Image
        source={{uri: GetImage(file_name)}}
        style={{width: '100%', height: 300, borderRadius: 10}}
        resizeMode="cover"
      />
    </View>
  );
};

export interface ItemLogType {
  ITEM_NO: number;
  ITEM_LOG_NO: number;
  INSERT_DT: string;
  send_USER_NM: string;
  send_CHARACTER_NO: number;
}

export const AlertItemModal = ({response}: {response: ItemLogType}) => {
  // console.log(response);

  return (
    <View style={{gap: 24, alignItems: 'center'}}>
      <ModalHeadBorder />

      <View style={{width: 240, height: 240}}>
        {response?.ITEM_NO === 1 ? (
          <LottieView
            source={usedItemImage.bomb[response?.send_CHARACTER_NO - 1]}
            style={{flex: 1}}
            autoPlay
          />
        ) : (
          <FastImage
            source={usedItemImage.hammer[response?.send_CHARACTER_NO - 1]}
            style={{flex: 1}}
          />
        )}
      </View>

      <NotoSansKR size={18} textAlign="center">
        이런! [{response?.send_USER_NM}]님이{'\n'}
        {timeSince(response?.INSERT_DT)}에 [{ItemName[response?.ITEM_NO - 1]}
        ]을 사용했어요!
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
            source={usedItemImage.bomb[character_no - 1]}
            style={{flex: 1}}
            autoPlay
          />
        ) : (
          <FastImage
            source={usedItemImage.hammer[character_no - 1]}
            style={{flex: 1}}
          />
        )}
      </View>
      <NotoSansKR size={18} textAlign="center">
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
        <NotoSansKR size={18} textAlign="center">
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
          <NotoSansKR size={18} textAlign="center">
            오늘도 수고했어요.{'\n'}
            보상으로 [{defaultData[item_type][item_no - 1].NAME}]을 받았어요!
          </NotoSansKR>
        </>
      )}
    </View>
  );
};

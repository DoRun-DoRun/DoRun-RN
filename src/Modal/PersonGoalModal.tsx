import React, {useState} from 'react';
import {View} from 'react-native';
import {
  ButtonComponent,
  InputNotoSansKR,
  NotoSansKR,
  RowContainer,
} from '../Component';
import {useDispatch} from 'react-redux';
import {
  addPersonalGoal,
  removeGoal,
  updateGoalTitle,
} from '../../store/slice/GoalSlice';
import {ModalHeadBorder} from './CustomModal';
import {useModal} from './ModalProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'styled-components';
import {styled} from 'styled-components/native';

interface PersonModalType {
  id: number;
  challenge_mst_no: number;
  title: string;
}

const SearchContainer = styled(RowContainer)`
  /* border: 1px solid ${props => props.theme.gray6}; */
  background-color: ${props => props.theme.gray7};
  padding: 12px 8px;
  border-radius: 10px;
`;

export const PersonGoalEditModal = ({
  id,
  challenge_mst_no,
  title,
}: PersonModalType) => {
  const {hideModal} = useModal();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [isError, setIsError] = useState(false);
  const [inputText, setInputText] = useState(title);

  return (
    <View style={{gap: 24}}>
      <ModalHeadBorder />

      <View style={{gap: 8}}>
        {isError && (
          <NotoSansKR size={12} color="red" weight="Medium">
            빈 값은 입력할 수 없어요!
          </NotoSansKR>
        )}
        <SearchContainer gap={8}>
          <MaterialCommunityIcons
            name="text-box-check-outline"
            size={24}
            color={theme.primary1}
          />
          <InputNotoSansKR
            maxLength={20}
            style={{flex: 1}}
            size={16}
            value={inputText}
            placeholder="수정할 목표를 입력해주세요."
            onChangeText={setInputText}
          />
        </SearchContainer>
      </View>

      <View style={{gap: 8}}>
        <ButtonComponent
          type="black"
          onPress={() => {
            if (inputText.trim().length === 0) {
              setIsError(true);
            } else {
              dispatch(
                updateGoalTitle({
                  goalId: id,
                  newTitle: inputText,
                  challenge_mst_no: challenge_mst_no,
                }),
              );
              hideModal();
            }
          }}>
          수정하기
        </ButtonComponent>
        <ButtonComponent
          type="black"
          onPress={() => {
            dispatch(
              removeGoal({goalId: id, challenge_mst_no: challenge_mst_no}),
            );
            hideModal();
          }}>
          삭제하기
        </ButtonComponent>
      </View>
    </View>
  );
};

export const PersonGoalAddModal = ({
  challenge_mst_no,
}: {
  challenge_mst_no: number;
}) => {
  const {hideModal} = useModal();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [isError, setIsError] = useState(false);

  const [inputText, setInputText] = useState('');

  return (
    <View style={{gap: 24}}>
      <ModalHeadBorder />

      <View style={{gap: 8}}>
        {isError && (
          <NotoSansKR size={12} color="red" weight="Medium">
            빈 값은 입력할 수 없어요!
          </NotoSansKR>
        )}
        <SearchContainer gap={8}>
          <MaterialCommunityIcons
            name="text-box-check-outline"
            size={24}
            color={theme.primary1}
          />
          <InputNotoSansKR
            maxLength={20}
            style={{flex: 1}}
            size={16}
            value={inputText}
            placeholder="새로운 목표를 추가해주세요."
            onChangeText={setInputText}
          />
        </SearchContainer>
      </View>
      <View style={{gap: 8}}>
        <ButtonComponent
          type="black"
          onPress={() => {
            if (inputText.trim().length === 0) {
              setIsError(true);
            } else {
              dispatch(
                addPersonalGoal({
                  challenge_mst_no: challenge_mst_no,
                  newGoal: {title: inputText, isComplete: false},
                }),
              );
              hideModal();
            }
          }}>
          생성하기
        </ButtonComponent>
        <ButtonComponent
          type="black"
          onPress={() => {
            hideModal();
          }}>
          취소하기
        </ButtonComponent>
      </View>
    </View>
  );
};

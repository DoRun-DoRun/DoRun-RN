import React, {useState} from 'react';
import {View} from 'react-native';
import {ButtonComponent, InputNotoSansKR} from '../Component';
import {useDispatch} from 'react-redux';
import {
  addPersonalGoal,
  removeGoal,
  updateGoalTitle,
} from '../../store/slice/GoalSlice';
import {ModalHeadBorder} from './CustomModal';
import {useModal} from './ModalProvider';

interface PersonModalType {
  id: number;
  challenge_no: number;
  title: string;
}

export const PersonGoalEditModal = ({
  id,
  challenge_no,
  title,
}: PersonModalType) => {
  const {hideModal} = useModal();
  const dispatch = useDispatch();

  const [inputText, setInputText] = useState(title);

  return (
    <View style={{gap: 24}}>
      <ModalHeadBorder />
      <InputNotoSansKR
        size={16}
        value={inputText}
        onChangeText={setInputText}
        placeholder="개인별 목표를 입력하세요"
        border
      />
      <View style={{gap: 8}}>
        <ButtonComponent
          type="black"
          onPress={() => {
            dispatch(
              updateGoalTitle({
                goalId: id,
                newTitle: inputText,
                challenge_no: challenge_no,
              }),
            );
            hideModal();
          }}>
          수정하기
        </ButtonComponent>
        <ButtonComponent
          type="black"
          onPress={() => {
            dispatch(removeGoal({goalId: id, challenge_no: challenge_no}));
            hideModal();
          }}>
          삭제하기
        </ButtonComponent>
      </View>
    </View>
  );
};

export const PersonGoalAddModal = ({challenge_no}: {challenge_no: number}) => {
  const {hideModal} = useModal();
  const dispatch = useDispatch();

  const [inputText, setInputText] = useState('');

  return (
    <View style={{gap: 24}}>
      <ModalHeadBorder />
      <InputNotoSansKR
        size={16}
        value={inputText}
        placeholder="새로운 목표를 추가해주세요."
        onChangeText={setInputText}
        border
      />
      <View style={{gap: 8}}>
        <ButtonComponent
          type="black"
          onPress={() => {
            dispatch(
              addPersonalGoal({
                challenge_no: challenge_no,
                newGoal: {title: inputText, isComplete: false},
              }),
            );
            hideModal();
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

export const TeamGoalAddModal = ({challenge_no}: {challenge_no: number}) => {
  const {hideModal} = useModal();
  const dispatch = useDispatch();

  const [inputText, setInputText] = useState('');

  return (
    <View style={{gap: 24}}>
      <ModalHeadBorder />
      <InputNotoSansKR
        size={16}
        value={inputText}
        placeholder="새로운 목표를 추가해주세요."
        onChangeText={setInputText}
      />
      <View style={{gap: 8}}>
        <ButtonComponent
          type="secondary"
          onPress={() => {
            dispatch(
              addPersonalGoal({
                challenge_no: challenge_no,
                newGoal: {title: inputText, isComplete: false},
              }),
            );
            hideModal();
          }}>
          생성하기
        </ButtonComponent>
        <ButtonComponent
          type="secondary"
          onPress={() => {
            hideModal();
          }}>
          취소하기
        </ButtonComponent>
      </View>
    </View>
  );
};

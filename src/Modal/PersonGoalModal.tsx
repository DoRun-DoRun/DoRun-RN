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

export const PersonGoalChoiceModal = ({
  id,
  challenge_no,
  title,
}: PersonModalType) => {
  const dispatch = useDispatch();
  const {hideModal, showModal} = useModal();

  const openEditeModal = () => {
    showModal(
      <PersonGoalEditModal id={id} challenge_no={challenge_no} title={title} />,
    );
  };

  return (
    <View>
      <ModalHeadBorder />
      <View style={{gap: 8}}>
        <ButtonComponent onPress={() => openEditeModal()}>
          수정하기
        </ButtonComponent>
        <ButtonComponent
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

export const PersonGoalEditModal = ({
  id,
  challenge_no,
  title,
}: PersonModalType) => {
  const {hideModal} = useModal();
  const dispatch = useDispatch();

  const [inputText, setInputText] = useState(title);

  return (
    <View>
      <ModalHeadBorder />
      <InputNotoSansKR
        size={16}
        value={inputText}
        onChangeText={setInputText}
      />
      <View style={{gap: 8}}>
        <ButtonComponent
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
          onPress={() => {
            hideModal();
          }}>
          취소하기
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
    <View>
      <ModalHeadBorder />
      <InputNotoSansKR
        size={16}
        value={inputText}
        placeholder="새로운 목표를 추가해주세요."
        onChangeText={setInputText}
      />
      <View style={{gap: 8}}>
        <ButtonComponent
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
          onPress={() => {
            hideModal();
          }}>
          취소하기
        </ButtonComponent>
      </View>
    </View>
  );
};

import React, {useState} from 'react';
import {View} from 'react-native';
import {ButtonComponent, InputNotoSansKR} from '../Component';
import {useDispatch, useSelector} from 'react-redux';
import {removeGoal, updateGoalTitle} from '../../store/slice/GoalSlice';
import {ModalHeadBorder} from './CustomModal';
import {useModal} from './ModalProvider';
import {RootState} from '../../store/RootReducer';

export const PersonGoalChoiceModal = ({id}: {id: number}) => {
  const dispatch = useDispatch();
  const {hideModal, showModal} = useModal();

  const openEditeModal = () => {
    showModal(<PersonGoalEditModal id={id} />);
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
            dispatch(removeGoal(id));
            hideModal();
          }}>
          삭제하기
        </ButtonComponent>
      </View>
    </View>
  );
};

export const PersonGoalEditModal = ({id}: {id: number}) => {
  const {hideModal} = useModal();
  const dispatch = useDispatch();
  const goals = useSelector((state: RootState) => state.goal.goals);
  const [inputText, setInputText] = useState(goals[id].title);

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
            dispatch(updateGoalTitle({id: id, newTitle: inputText}));
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

import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/RootReducer';
import {
  addPersonalGoal,
  removeGoal,
  updateGoalTitle,
} from '../../store/slice/GoalSlice';
import {
  ButtonComponent,
  InputNotoSansKR,
  NotoSansKR,
  RowContainer,
} from '../Component';
import {useTheme} from '../theme/ThemeProvider';
import {ModalHeadBorder} from './CustomModal';
import {useModal} from './ModalProvider';

interface PersonModalType {
  id: number;
  challenge_mst_no: number;
  title: string;
}

export const PersonGoalEditModal = ({
  id,
  challenge_mst_no,
  title,
}: PersonModalType) => {
  const {SIGN_TYPE} = useSelector((state: RootState) => state.user);

  const {hideModal} = useModal();
  const dispatch = useDispatch();
  const {theme} = useTheme();
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
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <SearchContainer gap={8}>
            <MaterialCommunityIcons
              name="text-box-check-outline"
              size={24}
              color={theme.primary1}
            />
            <InputNotoSansKR
              style={{flex: 1}}
              maxLength={20}
              size={16}
              value={inputText}
              placeholder="수정할 목표를 입력해주세요."
              onChangeText={setInputText}
            />
          </SearchContainer>
        </ScrollView>
      </View>

      <RowContainer gap={8} separate>
        <ButtonComponent
          style={{flex: 1}}
          type="danger"
          onPress={() => {
            dispatch(
              removeGoal({
                type: SIGN_TYPE!,
                goalId: id,
                challenge_mst_no: challenge_mst_no,
              }),
            );
            hideModal();
          }}>
          삭제하기
        </ButtonComponent>
        <ButtonComponent
          style={{flex: 1}}
          type="primary"
          onPress={() => {
            if (inputText.trim().length === 0) {
              setIsError(true);
            } else {
              dispatch(
                updateGoalTitle({
                  type: SIGN_TYPE!,
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
      </RowContainer>
    </View>
  );
};

export const PersonGoalAddModal = ({
  challenge_mst_no,
}: {
  challenge_mst_no: number;
}) => {
  const {SIGN_TYPE} = useSelector((state: RootState) => state.user);
  const {hideModal} = useModal();
  const dispatch = useDispatch();
  const {theme} = useTheme();
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
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <SearchContainer gap={8}>
            <MaterialCommunityIcons
              name="text-box-check-outline"
              size={24}
              color={theme.primary1}
            />
            <InputNotoSansKR
              style={{flex: 1}}
              maxLength={20}
              size={16}
              value={inputText}
              placeholder="오늘 할 일은 무엇인가요?"
              onChangeText={setInputText}
            />
          </SearchContainer>
        </ScrollView>
      </View>
      <RowContainer gap={8} separate>
        <ButtonComponent
          style={{flex: 1}}
          type="black"
          onPress={() => hideModal()}>
          취소하기
        </ButtonComponent>
        <ButtonComponent
          style={{flex: 1}}
          type="primary"
          onPress={() => {
            if (inputText.trim().length === 0) {
              setIsError(true);
            } else {
              dispatch(
                addPersonalGoal({
                  type: SIGN_TYPE!,
                  challenge_mst_no: challenge_mst_no,
                  newGoal: {
                    title: inputText,
                    isComplete: false,
                  },
                }),
              );
              hideModal();
            }
          }}>
          생성하기
        </ButtonComponent>
      </RowContainer>
    </View>
  );
};

export const SearchContainer: React.FC<
  React.ComponentProps<typeof RowContainer>
> = ({style, children, ...rest}) => {
  const {theme} = useTheme();
  return (
    <RowContainer
      {...rest}
      style={[styles.container, {backgroundColor: theme.gray7}, style]}>
      {children}
    </RowContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: theme.gray6,
  },
});

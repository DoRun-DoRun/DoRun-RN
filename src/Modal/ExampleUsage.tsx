import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useModal} from './ModalProvider';
import CustomModal from './CustomModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const StyledModalContent = styled(View)`
  background-color: white;
  width: ${windowWidth * 0.9}px;
  padding: 16px;
  margin: 16px;
  border-radius: 8px;
`;
const ExampleUsage = () => {
  const {showModal} = useModal();

  const openModal = () => {
    const modalContent = (
      <View>
        <StyledModalContent>
          <Text>내용 작성</Text>
          <Text>내용 작성</Text>
          <Text>내용 작성</Text>
          <Text>내용 작성</Text>
          <Text>내용 작성</Text>
          <Text>내용 작성</Text>
          <Text>내용 작성</Text>
          <TouchableOpacity onPress={() => console.log('Button Pressed')}>
            <Text>버튼 클릭</Text>
          </TouchableOpacity>
        </StyledModalContent>
      </View>
    );

    showModal(modalContent);
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={openModal}>
        <Text>모달 보여주기</Text>
      </TouchableOpacity>
      <CustomModal />
    </SafeAreaView>
  );
};

export default ExampleUsage;

import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useModal} from './ModalProvider';
import CustomModal from './CustomModal';
import {SafeAreaView} from 'react-native-safe-area-context';

const ExampleUsage = () => {
  const {showModal, hideModal} = useModal();

  const openModal = () => {
    const modalContent = (
      <View>
        <Text>내용 작성</Text>
        <Text>내용 작성</Text>
        <Text>내용 작성</Text>
        <Text>내용 작성</Text>
        <Text>내용 작성</Text>
        <Text>내용 작성</Text>
        <Text>내용 작성</Text>
        <TouchableOpacity onPress={() => hideModal()}>
          <Text>버튼 클릭</Text>
        </TouchableOpacity>
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

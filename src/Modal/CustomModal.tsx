import React, {FC, useEffect} from 'react';
import {Modal, View, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {useModal} from './ModalProvider';

const StyledModalContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledModalContent = styled(View)`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
`;

const StyledModalText = styled(Text)`
  font-size: 16px;
  margin-bottom: 10px;
`;

const StyledButton = styled(TouchableOpacity)`
  background-color: #3498db;
  padding: 10px;
  border-radius: 5px;
`;

const StyledButtonText = styled(Text)`
  color: white;
  font-size: 16px;
`;

const CustomModal: FC = () => {
  const {isVisible, content, hideModal} = useModal();

  useEffect(() => {
    if (isVisible) {
      // Handle modal visibility changes or perform other actions
    }
  }, [isVisible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => hideModal()}>
      <StyledModalContainer>
        <StyledModalContent>
          <StyledModalText>Custom Modal Content</StyledModalText>
          {content}
          <StyledButton onPress={() => hideModal()}>
            <StyledButtonText>Close Modal</StyledButtonText>
          </StyledButton>
        </StyledModalContent>
      </StyledModalContainer>
    </Modal>
  );
};

export default CustomModal;

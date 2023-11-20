/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {FC, useEffect, useRef} from 'react';
import {Modal, View, Animated, PanResponder} from 'react-native';
import styled from 'styled-components/native';
import {useModal} from './ModalProvider';
import OverlayContainer from './OverlayContainer';

const StyledModalContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`;

const StyledModalContent = styled(View)`
  padding: 16px;
  padding-bottom: 0px;
  border-radius: 8px;
  align-items: center;
`;

const AnimatedBottomSheet = styled(Animated.View)`
  padding: 16px;
  padding-bottom: 0px;
`;

const CustomModal: FC = () => {
  const {isVisible, content, hideModal} = useModal();
  const panY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      panY.setValue(0);
    }
  }, [isVisible, panY]);

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (event, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 0.6) {
          hideModal();
        } else {
          resetBottomSheet();
        }
      },
    }),
  ).current;

  const resetBottomSheet = () => {
    Animated.timing(panY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={isVisible}
      onRequestClose={() => hideModal()}>
      <OverlayContainer>
        <StyledModalContainer>
          <AnimatedBottomSheet
            style={{
              transform: [{translateY: panY}],
            }}
            {...panResponders.panHandlers}>
            <StyledModalContent>{content}</StyledModalContent>
          </AnimatedBottomSheet>
        </StyledModalContainer>
      </OverlayContainer>
    </Modal>
  );
};

export default CustomModal;

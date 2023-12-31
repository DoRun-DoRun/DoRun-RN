import React, {useEffect, useRef} from 'react';
import {
  Modal,
  View,
  Animated,
  PanResponder,
  Platform,
  Dimensions,
} from 'react-native';
import styled from 'styled-components/native';
import {useModal} from './ModalProvider';
import {OverlayContainer} from './OverlayContainer';

const StyledModalContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  padding: 16px;
  padding-bottom: 24px;
`;

const StyledModalContent = styled(Animated.View)`
  width: 100%;
  background-color: white;
  border-radius: 16px;
  padding: 0 16px;
  padding-bottom: 24px;
  ${Platform.OS === 'ios'
    ? `
    shadow-color: #000;
    shadow-offset: 2px 4px;
    shadow-opacity: 0.3;
    shadow-radius: 2px;`
    : 'elevation: 3;'}
`;

export const ModalHeadText = ({children}: {children: React.ReactNode}) => {
  return (
    <ModalHeaderText size={16}>
      {children}
      <ModalDivider />
    </ModalHeaderText>
  );
};

const ModalHeaderText = styled(View)<{size: number}>`
  padding-top: 16px;
  gap: 16px;
`;

const ModalDivider = styled(View)`
  border-bottom-width: 2px;
  border-color: ${props => props.theme.gray5};
  margin: 0 -16px;
`;

export const ModalHeadBorder = () => {
  return (
    <ModalHeaderBorder size={12}>
      <ModalShortDivider />
    </ModalHeaderBorder>
  );
};

const ModalHeaderBorder = styled(View)<{size: number}>`
  padding: 12px 0;
  gap: 12px;
  align-items: center;
`;

const ModalShortDivider = styled(View)`
  padding: 6px;
  width: 35px;
  border-bottom-width: 4px;
  border-color: ${props => props.theme.gray6};
`;

const CustomModal = () => {
  const {isVisible, content, hideModal, showOverlay} = useModal();
  const panY = useRef(new Animated.Value(0)).current;
  const height = Dimensions.get('window').height;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(panY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(panY, {
        toValue: height * 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, panY, height]);

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // 오직 아래로 스와이프하는 경우에만 panY를 업데이트
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 100 && gestureState.vy > 0.45) {
          closeModalWithAnimation();
        } else {
          resetBottomSheet();
        }
      },
    }),
  ).current;

  const closeModalWithAnimation = () => {
    Animated.timing(panY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => hideModal());
  };

  const resetBottomSheet = () => {
    Animated.timing(panY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal
      animationType={'none'}
      transparent={true}
      visible={isVisible}
      onRequestClose={() => hideModal()}
      style={{zIndex: 10}}>
      <OverlayContainer hideBackground={!showOverlay}>
        <StyledModalContainer style={{marginBottom: !showOverlay ? 48 : 0}}>
          <StyledModalContent
            style={{
              transform: [{translateY: panY}],
            }}
            {...panResponders.panHandlers}>
            {content}
          </StyledModalContent>
        </StyledModalContainer>
      </OverlayContainer>
    </Modal>
  );
};

export default CustomModal;

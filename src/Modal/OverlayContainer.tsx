import React from 'react';
import styled from 'styled-components/native';
import {useModal} from './ModalProvider';

const OverlayBackground = styled.Pressable`
  width: 100%;
  height: 100%;
`;

interface OverlayContainerProps {
  hideBackground?: boolean;
  children: React.ReactNode;
}

const FillOverlayOpacity = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  opacity: 0.3;
`;

export const OverlayContainer = ({
  children,
  hideBackground,
}: OverlayContainerProps) => {
  const {hideModal} = useModal();

  return (
    <OverlayBackground onPress={() => hideModal()}>
      {!hideBackground && <FillOverlayOpacity />}
      {children}
    </OverlayBackground>
  );
};

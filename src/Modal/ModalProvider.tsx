import React, {createContext, useContext, FC, ReactNode} from 'react';
import {create} from 'zustand';

type ModalState = {
  isVisible: boolean;
  showOverlay: boolean;
  content: ReactNode | null;
  onHide?: () => void;
  showModal: (
    content: ReactNode,
    onHide?: () => void,
    showOverlay?: boolean,
  ) => void;
  hideModal: () => void;
};

const useModalStore = create<ModalState>(set => ({
  isVisible: false,
  showOverlay: true,
  content: null,
  onHide: undefined,
  showModal: (content, onHide, showOverlay = true) =>
    set({isVisible: true, content, onHide, showOverlay}),
  hideModal: () => {
    // 현재 onHide 캡처
    const currentOnHide = useModalStore.getState().onHide;

    // 상태 업데이트
    set({
      isVisible: false,
      content: null,
      onHide: undefined,
    });

    // 상태 업데이트 이후에 onHide 호출
    if (currentOnHide) {
      currentOnHide();
    }
  },
}));

const ModalContext = createContext<ModalState | undefined>(undefined);

export const ModalProvider: FC<{children: ReactNode}> = ({children}) => {
  const modalStore = useModalStore();

  return (
    <ModalContext.Provider value={modalStore}>{children}</ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

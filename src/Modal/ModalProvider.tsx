import React, {createContext, useContext, FC, ReactNode} from 'react';
import {create} from 'zustand';

type ModalState = {
  isVisible: boolean;
  showOverlay: boolean;
  content: ReactNode | null;
  showModal: (content: ReactNode, showOverlay?: boolean) => void;
  hideModal: () => void;
};

const useModalStore = create<ModalState>(set => ({
  isVisible: false,
  showOverlay: true,
  content: null,
  showModal: (content, showOverlay = true) =>
    set({isVisible: true, content, showOverlay}),
  hideModal: () => set({isVisible: false, content: null}),
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

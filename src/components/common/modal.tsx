import { ModalContent, ModalHeader, Modal, ModalBody } from '@heroui/react';
import { ReactNode } from 'react';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function CustomModal({ children, onClose, title, size = 'xs', isOpen }: IProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalContent>
        <ModalHeader className="border-b">
          <h3 className="space-y-4 py-6"> {title}</h3>
        </ModalHeader>
        <ModalBody className="space-y-4 py-6">{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}

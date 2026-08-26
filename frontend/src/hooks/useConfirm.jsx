import { useState } from "react";
import ConfirmationModal from "../components/common/ConfirmationModal";

export function useConfirm() {
  const [config, setConfig] = useState(null);

  const close = () => setConfig(null);

  const confirm = (options) => {
    return new Promise((resolve) => {
      setConfig({
        ...options,
        isOpen: true,
        onConfirm: () => {
          resolve(true);
          close();
        },
        onCancel: () => {
          resolve(false);
          close();
        },
        onClose: () => {
          resolve(false);
          close();
        },
      });
    });
  };

  const ModalComponent = config ? <ConfirmationModal {...config} /> : null;

  return { confirm, ModalComponent };
}

export default useConfirm;
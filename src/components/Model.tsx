import React from "react";

interface OverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  blur?: boolean; // optional blur background
}

const Model: React.FC<OverlayProps> = ({ isOpen, onClose, children, blur }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 p-10 flex items-center justify-center ${
        blur ? "backdrop-blur-sm bg-black/30" : "bg-black/40"
      }`}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
};

export default Model;

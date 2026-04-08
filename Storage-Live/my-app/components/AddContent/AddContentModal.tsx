import { useState, useEffect } from 'react';
import AddImageForm from './AddImageForm';
import AddVideoForm from './AddVideoForm';
import './AddContentModal.css';

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType?: 'image' | 'video';
  onAddContent?: (url: File, caption: string) => void;
}

const AddContentModal = ({ isOpen, onClose, contentType, onAddContent, }: AddContentModalProps) => {

  const [selectedType, setSelectedType] = useState<'image' | 'video' | null>(contentType || null);


  useEffect(() => {
    if (isOpen) setSelectedType(contentType ? contentType : null);
  }, [isOpen]);

  if (!isOpen) return null;



  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Content</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <>
          <button
            className="back-btn"
            onClick={() => setSelectedType(null)}
          >
            ← Back
          </button>
          {selectedType === 'image' && (
            <AddImageForm
              onAdd={(url, caption) => {
                onAddContent?.(url, caption)
                setSelectedType(null);
                onClose();
              }}
            />
          )}

          {selectedType === 'video' && (
            <AddVideoForm
              onAdd={(url, title) => {
                onAddContent?.(url, title);
                setSelectedType(null);
                onClose();
              }}
            />
          )}
        </>
      </div>
    </>
  );
};

export default AddContentModal;

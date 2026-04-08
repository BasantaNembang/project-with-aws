import React, { useState } from 'react';
import './Forms.css';

interface AddImageFormProps {
  onAdd: (file: File, caption: string) => void;
}

const AddImageForm = ({ onAdd }: AddImageFormProps) => {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    onAdd(file, caption);

    // reset
    setCaption('');
    setFile(null);
    setPreview(null);

  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const imageUrl = URL.createObjectURL(selectedFile);
      setPreview(imageUrl);
    }
  };

  

  return (
    <form onSubmit={handleSubmit} className="content-form">

      <div className="form-group">
        <label htmlFor="imageInput" className="custom-label">
          Select Image
        </label>    
        <input
          id='imageInput'
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="image-preview"
          />
        )}
      </div>

      <div className="form-group">
        <label>Caption</label>
        <textarea
          placeholder="Add a caption to your image..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={200}
          rows={3}
        ></textarea>
        <span className="char-count">{caption.length}/200</span>
      </div>

      <button type="submit" className="submit-btn">
        Add Image
      </button>
    </form>
  );
};

export default AddImageForm;

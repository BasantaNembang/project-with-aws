import React, { useState } from 'react';
import './Forms.css';

interface AddVideoFormProps {
  onAdd: (url: File, title: string) => void;
}

const AddVideoForm: React.FC<AddVideoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const imageUrl = URL.createObjectURL(selectedFile);
      setPreview(imageUrl);
    }
  };





  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    onAdd(file, title);

    // reset
    setFile(null);
    setPreview(null);
  };





  return (
    <form onSubmit={handleSubmit} className="content-form">

      <div className="form-group">
        <label htmlFor="imageInput" className="custom-label">
          Select Video
        </label>
        <input
          id='imageInput'
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {preview && (
          <video
            src={preview}
            controls
            width="200"
            className="image-preview"
          />
        )}
      </div>




      <div className="form-group">
        <label>Video Title</label>
        <input
          type="text"
          placeholder="Enter video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
        <span className="char-count">{title.length}/100</span>
      </div>

      <button type="submit" className="submit-btn">
        Add Video
      </button>
    </form>
  );
};

export default AddVideoForm;


import React, { useState } from "react";
import "./CoverUploader.css";
import CoverUploaderButton from "../Button/Button";

const CoverUploader = ({ isOpen, onClose, onSubmit }) => {
  const [link, setLink] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!link.trim()) return;
    onSubmit(link);
    setLink("");
    onClose();
  };

  return (
    <div className="popup-shadow">
      <div className="popup-box">
        <h2>Insira a URL da imagem</h2>
        <input
          type="text"
          placeholder="Insira aqui..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <div className="popup-buttons">
          <div className="cancelbutton">
            <CoverUploaderButton type="button" onClick={onClose}>
              Cancelar
            </CoverUploaderButton>
          </div>

          <div className="okbutton">
            <CoverUploaderButton type="button" onClick={handleSubmit}>
              OK
            </CoverUploaderButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverUploader;

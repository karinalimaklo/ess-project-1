import React from "react";
import "./SuccessMessage.css";
import check from "../../assets/check.png";
import ButtonSuccess from "../Button/Button";

const SuccessMessage = ({
  onClose,
  message = "OPERAÇÃO CONCLUÍDA COM SUCESSO",
  buttonText = "OK",
}) => {
  return (
    <div className="card-shadow-2">
      <div className="card-box-2">
        <img src={check} alt="check" className="check-icon" />
        <h2 className="titulo-sucesso">{message}</h2>

        <div className="success-button">
          <ButtonSuccess type="button" onClick={onClose}>
            {buttonText}
          </ButtonSuccess>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;

import React from "react";
import "./FailMessage.css";
import atention from "../../assets/atention.png";
import ButtonFail from "../Button/Button";

const FailMessage = ({
  onClose,
  message = "OPERAÇÃO NÃO REALIZADA",
  buttonText = "OK",
}) => {
  return (
    <div className="fail-shadow">
      <div className="fail-box">
        <img src={atention} alt="atention" className="atention-icon" />
        <h2 className="fail-title">{message}</h2>
        <div className="fail-button">
          <ButtonFail type="button" onClick={onClose}>
            {buttonText}
          </ButtonFail>
        </div>
      </div>
    </div>
  );
};

export default FailMessage;

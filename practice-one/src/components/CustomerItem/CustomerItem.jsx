import React, { useState } from "react";
import "./CustomerItem.css";
import { menuDot } from "@assets/images";
import { CustomerInfo, Gender, ContextMenu } from "@components";

const CustomerItem = ({ avatar, name, email, phoneNumber, gender }) => {
  const [isShowSubMenu, setIsShowSubMenu] = useState(false);

  const handleContextMenuClick = () => {
    setIsShowSubMenu(!isShowSubMenu);
  };

  return (
    <>
      <div className="customer__info">
        <CustomerInfo avatar={avatar} name={name} />
        <p className="customer__text">{email}</p>
        <p className="customer__text">{phoneNumber}</p>
        <Gender gender={gender} />
        <div className="customer__option" onClick={handleContextMenuClick}>
          <img src={menuDot} alt="dot icon" />
        </div>
      </div>
      {isShowSubMenu && <ContextMenu />}
    </>
  );
};

export default CustomerItem;

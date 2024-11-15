import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { Row, Col, Breadcrumb, Button, Input, Dropdown, Avatar } from "antd";
// import { getLocalStorage } from "../../utils/storageUtils";
// import { context } from "../../utils/context";
// import { getRoutesByRole } from "../route";
import "./header.scss";
import { NavLink } from "react-router-dom";
import { BellFilled } from "@ant-design/icons";
import {
  SettingFilled,
  UserOutlined,
  TranslationOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export const HeaderBar = () => {
  const { pathname } = useLocation();

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const logOut = () => {
    console.log("he");
    localStorage.removeItem("ui-context");
    document.cookie = `expired_time=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.href = "/";
  }
  const items = [
    {
      label: (
        <a
          href="#/account"
          style={{ display: "flex", justifyContent: "start" }}
        >
          Account
        </a>
      ),
      key: "0",
    },
    {
      label: (
        <a href="" style={{ display: "flex", justifyContent: "start" }}>
          Setting
        </a>
      ),
      key: "1",
    },
    {
      label: <a style={{ display: "flex" }} onClick={() => logOut()}>Sign out</a>,
      key: "2",
    },
  ];

  return (
    <div className="header-container">
      <Row gutter={[24, 0]}>
        <Col span={24} md={12} className="header-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item>
              {/* <NavLink to="/">Pages</NavLink> */}
              <NavLink to="/"></NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {/* {t(getLabelByKey(pathname) ?? "page.side-bar.home")} */}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="ant-page-header-heading">
            <span
              className="ant-page-header-heading-title"
              style={{ textTransform: "capitalize" }}
            ></span>
          </div>
        </Col>
        <Col span={24} md={12} className="header-control">
          <div className="header-icon-box">
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <SettingFilled />
            </Dropdown>
          </div>

          <div className="header-icon-box">
            <NavLink to="/" style={{ color: "#000" }}>
              <BellFilled />
            </NavLink>
          </div>

          <div onClick={(e) => e.preventDefault()}>
            <NavLink to="/account" style={{ color: "#000" }}>
              <Avatar
                size={"large"}
                icon={<UserOutlined />}
                className="user-avatar"
              />
            </NavLink>
          </div>
        </Col>
      </Row>
    </div>
  );
};

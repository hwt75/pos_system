import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { DrawerSide } from "../../components/Drawer/Drawer";
import { getUserById } from "../../redux/reducer/userSlice";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Divider } from "antd";
import { useTranslation } from "react-i18next";
import {
  convertGenderToString,
  convertRoleToString,
  convertUserStatusToString,
} from "../../constants";
import { convertTimeToDate } from "../../utils/dateUtils";

const UserDetailComponent = (props: any, ref: any) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [data, setData] = React.useState<any>([]);
  const [idSelect, setIdSelect] = React.useState<string>("");
  const { t } = useTranslation();
  const dataState = useAppSelector((state) => state.user);

  React.useImperativeHandle(ref, () => ({
    open: (id: string) => {
      setIsOpen(true);
      if (id !== idSelect) {
        setIdSelect(id);
        dispatch(getUserById(id));
      }
    },
  }));

  React.useEffect(() => {
    if (dataState.loadGetUserByIdStatus === ApiLoadingStatus.Success) {
      const rawData = {
        ...dataState.userData,
        gender: convertGenderToString(dataState.userData.gender),
        birth: convertTimeToDate(dataState.userData.birth),
        role_id: convertRoleToString(dataState.userData.role_id),
        status_id: convertUserStatusToString(dataState.userData.status_id),
      };
      setData(rawData);
    }
  }, [dataState.loadGetUserByIdStatus]);

  const labelsInfo = {
    username: "Tên người dùng",
    gender: "Giới tính",
    birth: "Ngày sinh",
    phone_number: "Số điện thoại",
    role_id: "Chức vụ",
    information: "Thông tin",
    status_id: "Trạng thái",
  };

  const customData = (
    <>
      <Avatar size={60} icon={<UserOutlined />} />
      <p className="site-description-item-profile-p">Thông tin cụ thể</p>
      <p className="site-description-item-profile-wrapper"></p>
      <Divider />
    </>
  );

  return (
    <>
      <DrawerSide
        closed={() => setIsOpen(false)}
        isOpen={isOpen}
        title="Thông tin người dùng"
        data={data}
        labels={labelsInfo}
        customData={customData}
      />
    </>
  );
};

export const UserDetail = React.forwardRef(UserDetailComponent);

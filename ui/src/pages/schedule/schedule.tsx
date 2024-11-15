import * as React from "react";
import type { CalendarProps } from "antd";
import { Badge, Button, Calendar, ConfigProvider } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/lib/locale/vi_VN";
import {
  createScheduleByDoctor,
  createScheduleWithSelectedDoctor,
  getAllSchedules,
  getScheduleByDoctorId,
  getScheduleByPatientId,
  resetLoadCreateScheduleByDoctorStatus,
  resetLoadCreateScheduleWithSelectedDoctor,
} from "../../redux/reducer/scheduleSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import { checkDateTypeKey } from "../../utils/dateUtils";
import { ScheduleModal } from "../../components/Modal/ScheduleModal";
import {
  convertScheduleStatusToString,
  convertScheduleTypeToString,
  scheduleType,
  userRole,
} from "../../constants";
import { SelectInfo } from "antd/es/calendar/generateCalendar";
import { createDiagnosis } from "../../redux/reducer/diagnosisSlice";
import { DiagnosisRequest } from "../../api";
import { ModalShowDiagnosis } from "../../components/Modal/ModalShowDiagnosis";
import { PlusOutlined } from "@ant-design/icons";
import { ModalAddSchWithDoctor } from "../../components/Modal/ModalAddSchWithDoctor";
import { ModalAddDiagnosis } from "../../components/Modal/ModalAddDiagnosis";
import { Context } from "../../utils/context";

type AddSchedule = {
  open: (data: any[]) => void;
};

type AddDiagnosis = {
  open: (data: any[], columns: any[]) => void;
};

type ShowDiagnosis = {
  open: (data: any[]) => void;
};

export const Schedule: React.FC = () => {
  const dispatch = useAppDispatch();
  const dataState = useAppSelector((state) => state.schedule);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
  const [data, setData] = React.useState<any[]>([]);
  const modalAddSchWithDoctorRef = React.useRef<AddSchedule>(null);
  const modalAddDiagnosisRef = React.useRef<AddDiagnosis>(null);
  const modalShowRef = React.useRef<ShowDiagnosis>(null);

  const columns = [
    {
      title: "Thông tin chẩn đoán",
      dataIndex: "information",
      key: "information",
      type: "text",
      isEdit: true,
    },
    {
      title: "Lịch tái khám",
      dataIndex: "schedule_start_time",
      key: "schedule_start_time",
      type: "date",
      isEdit: true,
    },
    {
      title: "Loại lịch tái khám",
      dataIndex: "schedule_type_id",
      key: "schedule_type_id",
      type: "select",
      dataSelect: scheduleType,
      isEdit: true,
    },
  ];

  React.useEffect(() => {
    if (Context.role === userRole.admin) {
      dispatch(getAllSchedules());
    }
    if (Context.role === userRole.doctor) {
      dispatch(getScheduleByDoctorId());
    }
    if (Context.role === userRole.patient) {
      dispatch(getScheduleByPatientId());
    }
  }, []);

  React.useEffect(() => {
    if (dataState.loadDataStatus === ApiLoadingStatus.Success) {
      const rawData = dataState.data.map((schedule) => handleData(schedule));
      setData(rawData);
    }
  }, [dataState.loadDataStatus]);

  const handleData = (data: any) => {
    const scheduleData = { ...data };
    Object.keys(data).forEach((key) => {
      if (checkDateTypeKey(key)) {
        const dateObj = dayjs.unix(data[key]);
        scheduleData[key] = dateObj.format("HH:mm MM/DD/YYYY");
        scheduleData.date = dateObj.date();
        scheduleData.month = dateObj.month();
        scheduleData.year = dateObj.year();
        scheduleData.time = Number(dateObj.format("HHmm"));
      }
    });
    return scheduleData;
  };

  const getListData = (value: Dayjs) => {
    const result = value
      ? data
          .filter(
            (item) =>
              item.date === value.date() &&
              item.month === value.month() &&
              item.year === value.year()
          )
          .map((schedule) => ({
            type: schedule.status_id === 1 ? "error" : "success",
            schedule_id: schedule.id,
            session_string: `Thời gian khám: Từ ${dayjs(
              schedule.schedule_start_time
            ).format("HH:mm")} đến ${dayjs(schedule.schedule_end_time).format(
              "HH:mm"
            )}`,
            start_time: dayjs(schedule.schedule_start_time).format("HH:mm"),
            end_time: dayjs(schedule.schedule_end_time).format("HH:mm"),
            time: Number(dayjs(schedule.schedule_start_time).format("HHmm")),
            doctor: schedule.doctor_name,
            patient: schedule.patient_name,
            schedule_type: `Loại lịch hẹn: ${convertScheduleTypeToString(
              schedule.schedule_type_id
            )}`,
            status: `Trạng thái lịch hẹn: ${convertScheduleStatusToString(
              schedule.status_id
            )}`,
            patient_id: schedule.patient_id,
          }))
      : [];
    return result.sort((a, b) => a.time - b.time);
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);

    if (listData.length === 0) {
      return null;
    }

    const count = {
      morning: 0,
      afternoon: 0,
      evening: 0,
    };

    listData.forEach((item) => {
      const time = item.time;
      if (time < 1200) {
        count.morning++;
      } else if (time >= 1200 && time < 1900) {
        count.afternoon++;
      } else {
        count.evening++;
      }
    });

    return (
      <ul className="events">
        <Badge color={"orange"} text={`Số ca sáng: ${count.morning}`} />
        <Badge color={"green"} text={`Số ca chiều: ${count.afternoon}`} />
        <Badge color={"purple"} text={`Số ca tối: ${count.evening}`} />
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  const onDateSelect = (value: Dayjs, selectInfo: SelectInfo) => {
    if (selectInfo.source === "date") {
      setSelectedDate(value);
      setIsOpen(true);
    }
  };

  const handleSubmitAddSchWithDoctorFunction = (data: any) => {
    dispatch(createScheduleWithSelectedDoctor(data));
  };

  const handleSubmitAddDiagnosisFunction = (data: any) => {
    dispatch(
      createDiagnosis({
        schedule_id: data.schedule_id,
        information: data.information,
      } as DiagnosisRequest)
    );
    if (
      data.schedule_start_time !== null &&
      data.schedule_start_time !== undefined
    )
      dispatch(createScheduleByDoctor(data));
  };

  React.useEffect(() => {
    if (
      dataState.loadCreateScheduleByDoctorStatus === ApiLoadingStatus.Success
    ) {
      dispatch(resetLoadCreateScheduleByDoctorStatus());
      dispatch(getAllSchedules());
    }
  }, [dataState.loadCreateScheduleByDoctorStatus]);

  React.useEffect(() => {
    if (
      dataState.loadCreateScheduleWithSelectedDoctor ===
      ApiLoadingStatus.Success
    ) {
      dispatch(resetLoadCreateScheduleWithSelectedDoctor());
      dispatch(getAllSchedules());
    }
  }, [dataState.loadCreateScheduleWithSelectedDoctor]);

  return (
    <>
      {Context.role === userRole.patient && (
        <>
          {" "}
          <Button
            icon={<PlusOutlined />}
            onClick={() => modalAddSchWithDoctorRef.current?.open({} as any)}
            style={{ marginRight: "8px" }}
          >
            Đặt lịch khám theo bác sĩ
          </Button>
          <Button
            icon={<PlusOutlined />}
            //onClick={() => modalAddSchWithTimeRef.current?.open({} as any)}
          >
            Đề xuất lịch khám
          </Button>{" "}
        </>
      )}
      <ConfigProvider locale={viVN}>
        <Calendar cellRender={cellRender} onSelect={onDateSelect} />
        <ScheduleModal
          title={`Lịch hẹn ngày ${selectedDate?.format("DD-MM-YYYY")}`}
          isOpen={isOpen}
          selectedDate={selectedDate}
          data={data}
          onClose={() => setIsOpen(false)}
          getListData={getListData}
          showDiagnosis={(
            schedule_id: string,
            doctor: string,
            patient: string,
            start_time: string,
            end_time: string
          ) =>
            modalShowRef.current?.open({
              schedule_id: schedule_id,
              doctor: doctor,
              patient: patient,
              start_time: start_time,
              end_time: end_time,
            } as any)
          }
          addDiagnosis={(
            selected_date: Dayjs | null,
            schedule_id: string,
            patient_id: string,
            patient: string,
            start_time: string,
            end_time: string
          ) =>
            modalAddDiagnosisRef.current?.open(
              {
                selected_date: selected_date,
                schedule_id: schedule_id,
                patient_id: patient_id,
                patient: patient,
                start_time: start_time,
                end_time: end_time,
              } as any,
              columns
            )
          }
        />
      </ConfigProvider>
      <ModalAddSchWithDoctor
        ref={modalAddSchWithDoctorRef}
        title="Đặt lịch khám"
        submitFunction={(data: any) =>
          handleSubmitAddSchWithDoctorFunction(data)
        }
      ></ModalAddSchWithDoctor>
      <ModalAddDiagnosis
        ref={modalAddDiagnosisRef}
        title="Chẩn đoán của bác sĩ"
        submitFunction={(data: any) => handleSubmitAddDiagnosisFunction(data)}
      ></ModalAddDiagnosis>
      <ModalShowDiagnosis
        ref={modalShowRef}
        title="Xem chẩn đoán"
      ></ModalShowDiagnosis>
    </>
  );
};

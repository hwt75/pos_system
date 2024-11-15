import * as React from "react";
import { Modal, Badge, Card, Tooltip } from "antd";
import type { BadgeProps } from "antd";
import "./schedule.scss";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Context } from "../../utils/context";
import { userRole } from "../../constants";

const ScheduleModalComponent = (props: any) => {
  const listData = props.getListData(props.selectedDate);

  return (
    <Modal
      title={props.title}
      open={props.isOpen}
      onCancel={props.onClose}
      footer={null}
    >
      {listData.length > 0 ? (
        listData.map(
          (
            item: {
              type: string;
              schedule_id: string;
              schedule_type: any;
              patient_id: string;
              doctor: string;
              patient: string;
              session_string: any;
              status: string;
              start_time: string;
              end_time: string;
            },
            index: any
          ) => (
            <Card
              key={index}
              className="card-filter"
              actions={[
                <Tooltip title="Xem chẩn đoán">
                  <EyeOutlined
                    key="show"
                    onClick={() =>
                      props.showDiagnosis(
                        item.schedule_id,
                        item.doctor,
                        item.patient,
                        item.start_time,
                        item.end_time
                      )
                    }
                  />
                </Tooltip>,
                ...(Context.role === userRole.doctor
                  ? [
                      <Tooltip title="Tạo chẩn đoán" key="edit">
                        <EditOutlined
                          onClick={() =>
                            props.addDiagnosis(
                              props.selectedDate,
                              item.schedule_id,
                              item.patient_id,
                              item.patient,
                              item.start_time,
                              item.end_time
                            )
                          }
                        />
                      </Tooltip>,
                    ]
                  : []),
              ]}
            >
              <Badge
                status={item.type as BadgeProps["status"]}
                text={item.session_string}
              />
              <div className="event-details">
                {Object.entries(item).map(([key, value]) => {
                  if (key == "schedule_type" || key == "status")
                    return <div key={key}>{value}</div>;
                  if (
                    (Context.role === userRole.admin ||
                      Context.role === userRole.patient) &&
                    key == "doctor"
                  )
                    return <div key={key}>Bác sĩ: {value}</div>;
                  if (
                    (Context.role === userRole.admin ||
                      Context.role === userRole.doctor) &&
                    key == "patient"
                  )
                    return <div key={key}>Bệnh nhân: {value}</div>;
                })}
              </div>
            </Card>
          )
        )
      ) : (
        <div>Không có lịch hẹn</div>
      )}
    </Modal>
  );
};

export const ScheduleModal = ScheduleModalComponent;

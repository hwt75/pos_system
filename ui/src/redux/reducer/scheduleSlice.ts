import { createSlice } from "@reduxjs/toolkit";
import { ApiLoadingStatus } from "../../utils/loadingStatus";
import { createAsyncThunkWrap } from "../handler";
import { ScheduleRequest, ScheduleResponse, Service } from "../../api";

interface IScheduleState {
  data: ScheduleResponse[];
  availableSchedule: any;
  loadDataStatus: ApiLoadingStatus;
  loadCreateScheduleByDoctorStatus: ApiLoadingStatus;
  loadCreateScheduleWithSelectedDoctor: ApiLoadingStatus;
  loadGetAvailableScheduleByDoctorId: ApiLoadingStatus;
}

const initialState: IScheduleState = {
  data: [],
  availableSchedule: [],
  loadDataStatus: ApiLoadingStatus.None,
  loadCreateScheduleByDoctorStatus: ApiLoadingStatus.None,
  loadCreateScheduleWithSelectedDoctor: ApiLoadingStatus.None,
  loadGetAvailableScheduleByDoctorId: ApiLoadingStatus.None,
};

export const getAllSchedules = createAsyncThunkWrap("/schedules", async () => {
  return await Service.scheduleService.getAllSchedules();
});

export const getScheduleByDoctorId = createAsyncThunkWrap(
  "/schedules/doctor-id",
  async () => {
    return await Service.scheduleService.getScheduleByDoctorId();
  }
);

export const getScheduleByPatientId = createAsyncThunkWrap(
  "/schedules/patient-id",
  async () => {
    return await Service.scheduleService.getScheduleByPatientId();
  }
);

export const createScheduleByDoctor = createAsyncThunkWrap(
  "/schedules/create",
  async (schedule: ScheduleRequest) => {
    return await Service.scheduleService.createScheduleByDoctor(schedule);
  }
);

export const createScheduleWithSelectedDoctor = createAsyncThunkWrap(
  "/schedules/create-doctor",
  async (schedule: ScheduleRequest) => {
    return await Service.scheduleService.createScheduleWithSelectedDoctor(
      schedule
    );
  }
);

export const getAvailableScheduleByDoctorId = createAsyncThunkWrap(
  "/schedules/available-schedule",
  async (doctor_id: string) => {
    return await Service.scheduleService.getAvailableScheduleByDoctorId(
      doctor_id
    );
  }
);

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    resetLoadDataStatus: (state) => {
      state.loadDataStatus = ApiLoadingStatus.None;
    },
    resetLoadCreateScheduleByDoctorStatus: (state) => {
      state.loadCreateScheduleByDoctorStatus = ApiLoadingStatus.None;
    },
    resetLoadCreateScheduleWithSelectedDoctor: (state) => {
      state.loadCreateScheduleWithSelectedDoctor = ApiLoadingStatus.None;
    },
    resetLoadGetAvailableScheduleByDoctorId: (state) => {
      state.loadGetAvailableScheduleByDoctorId = ApiLoadingStatus.None;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSchedules.pending, (state, action) => {
        state.loadDataStatus = ApiLoadingStatus.Loading;
      })
      .addCase(getAllSchedules.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loadDataStatus = ApiLoadingStatus.Success;
      })
      .addCase(getAllSchedules.rejected, (state, action) => {
        state.data = [];
        state.loadDataStatus = ApiLoadingStatus.Failed;
      })
      .addCase(getScheduleByDoctorId.pending, (state, action) => {
        state.loadDataStatus = ApiLoadingStatus.Loading;
      })
      .addCase(getScheduleByDoctorId.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loadDataStatus = ApiLoadingStatus.Success;
      })
      .addCase(getScheduleByDoctorId.rejected, (state, action) => {
        state.data = [];
        state.loadDataStatus = ApiLoadingStatus.Failed;
      })
      .addCase(getScheduleByPatientId.pending, (state, action) => {
        state.loadDataStatus = ApiLoadingStatus.Loading;
      })
      .addCase(getScheduleByPatientId.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loadDataStatus = ApiLoadingStatus.Success;
      })
      .addCase(getScheduleByPatientId.rejected, (state, action) => {
        state.data = [];
        state.loadDataStatus = ApiLoadingStatus.Failed;
      })
      .addCase(createScheduleByDoctor.pending, (state, action) => {
        state.loadCreateScheduleByDoctorStatus = ApiLoadingStatus.Loading;
      })
      .addCase(createScheduleByDoctor.fulfilled, (state, action) => {
        state.loadCreateScheduleByDoctorStatus = ApiLoadingStatus.Success;
      })
      .addCase(createScheduleByDoctor.rejected, (state, action) => {
        state.loadCreateScheduleByDoctorStatus = ApiLoadingStatus.Failed;
      })
      .addCase(createScheduleWithSelectedDoctor.pending, (state, action) => {
        state.loadCreateScheduleWithSelectedDoctor = ApiLoadingStatus.Loading;
      })
      .addCase(createScheduleWithSelectedDoctor.fulfilled, (state, action) => {
        state.loadCreateScheduleWithSelectedDoctor = ApiLoadingStatus.Success;
      })
      .addCase(createScheduleWithSelectedDoctor.rejected, (state, action) => {
        state.loadCreateScheduleWithSelectedDoctor = ApiLoadingStatus.Failed;
      })
      .addCase(getAvailableScheduleByDoctorId.pending, (state, action) => {
        state.loadGetAvailableScheduleByDoctorId = ApiLoadingStatus.Loading;
      })
      .addCase(getAvailableScheduleByDoctorId.fulfilled, (state, action) => {
        state.availableSchedule = action.payload;
        state.loadGetAvailableScheduleByDoctorId = ApiLoadingStatus.Success;
      })
      .addCase(getAvailableScheduleByDoctorId.rejected, (state, action) => {
        state.availableSchedule = [];
        state.loadGetAvailableScheduleByDoctorId = ApiLoadingStatus.Failed;
      });
  },
});

export const {
  resetLoadDataStatus,
  resetLoadCreateScheduleByDoctorStatus,
  resetLoadCreateScheduleWithSelectedDoctor,
  resetLoadGetAvailableScheduleByDoctorId,
} = scheduleSlice.actions;
export default scheduleSlice.reducer;

import { IActivityType } from '../../common/interfaces/activity-type.interface';
import { ActivityCategoryFormTypes } from '../../components/ActivityTypeForm';
import API from '../api';

export const getActivityTypes = async (
  search?: string,
  branchId?: string,
  departmentId?: string,
  roleId?: string,
): Promise<IActivityType[]> => {
  return API.get('/activity-type', { params: { search, branchId, departmentId, roleId } }).then(
    (res) => res.data,
  );
};

export const getActivityType = async (id: string): Promise<IActivityType> => {
  return API.get(`/activity-type/${id}`).then((res) => res.data);
};

export const updateActivityType = async (
  id: string,
  data: Partial<ActivityCategoryFormTypes>,
): Promise<IActivityType> => {
  const { department, role, branch, ...payload } = data;
  return API.patch(`/activity-type/${id}`, {
    ...payload,
    ...(department ? { departmentId: department?.key } : {}),
    ...(role ? { roleId: role?.key } : {}),
    ...(branch ? { branchId: branch?.key } : {}),
  }).then((res) => res.data);
};

export const createActivityType = async (
  data: ActivityCategoryFormTypes,
): Promise<IActivityType> => {
  const { department, role, branch, ...payload } = data;
  return API.post(`/activity-type`, {
    ...payload,
    departmentId: department?.key,
    branchId: branch?.key,
    roleId: role?.key,
  }).then((res) => res.data);
};

export const activateActivityType = async (id: string): Promise<IActivityType> => {
  return API.patch(`/activity-type/${id}/activate`).then((res) => res.data);
};

export const archiveActivityType = async (id: string): Promise<IActivityType> => {
  return API.patch(`/activity-type/${id}/archive`).then((res) => res.data);
};

import { AxiosError } from 'axios';
import { useQuery, useMutation } from 'react-query';
import { OrderDirection } from '../../common/enums/order-direction.enum';
import { ORGANIZATION_ERRORS } from '../../common/errors/entities/organization.errors';
import { IBusinessException } from '../../common/interfaces/business-exception.interface';
import {
  createAccessCode,
  getAccessCodes,
  getOrganization,
  updateAccessCode,
  updateOrganizationDescription,
} from './organization.api';

export const useOrganizationQuery = () => {
  return useQuery(['organization'], () => getOrganization(), {
    onError: (error: AxiosError<IBusinessException<ORGANIZATION_ERRORS>>) => error,
  });
};

export const useUpdateOrganizationDescriptionMutation = () => {
  return useMutation(
    ['organization'],
    (description: string) => updateOrganizationDescription(description),
    {
      onError: (error: AxiosError<IBusinessException<ORGANIZATION_ERRORS>>) =>
        Promise.resolve(error),
    },
  );
};

export const useAccessCodesQuery = (
  limit: number,
  page: number,
  orderBy?: string,
  orderDirection?: OrderDirection,
) => {
  return useQuery(
    ['access-codes', limit, page, orderBy, orderDirection],
    () => getAccessCodes(limit, page, orderBy, orderDirection),
    { enabled: !!(limit && page) },
  );
};

export const useCreateAccessCodesMutation = () => {
  return useMutation(
    ({ code, startDate, endDate }: { code: string; startDate: Date; endDate?: Date }) =>
      createAccessCode(code, startDate, endDate),
    {
      onError: (error: AxiosError<IBusinessException<ORGANIZATION_ERRORS>>) =>
        Promise.resolve(error),
    },
  );
};

export const useUpdateAccessCodeMutation = () => {
  return useMutation(
    ({ id, endDate }: { id: string; endDate?: Date }) => updateAccessCode(id, endDate),
    {
      onError: (error: AxiosError<IBusinessException<ORGANIZATION_ERRORS>>) =>
        Promise.resolve(error),
    },
  );
};

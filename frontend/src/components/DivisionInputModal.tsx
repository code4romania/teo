import React, { useEffect } from 'react';
import Modal from './Modal';
import { Controller, useForm } from 'react-hook-form';
import Button from './Button';
import * as yup from 'yup';
import i18n from '../common/config/i18n';
import { yupResolver } from '@hookform/resolvers/yup';
import { REGEX } from '../common/constants/patterns';
import FormInput from './FormInput';
import { DivisionType } from './Divisions';

interface DivisionInputModalProps {
  title: string;
  divisionType: DivisionType;
  onClose: () => void;
  onSubmit: (division: DivisionFormTypes) => void;
  defaultValue?: string;
}

export type DivisionFormTypes = {
  name: string;
};

const schema = yup
  .object({
    name: yup
      .string()
      .required(
        `${i18n.t('general:validation.required', { field: i18n.t('general:fields.name') })}`,
      )
      .min(
        2,
        `${i18n.t('general:validation.min', { field: i18n.t('general:fields.name'), value: '2' })}`,
      )
      .max(
        20,
        `${i18n.t('general:validation.max', {
          field: i18n.t('general:fields.name'),
          value: '20',
        })}`,
      )
      .matches(
        REGEX.NAME_REGEX,
        `${i18n.t('general:validation.pattern', { field: i18n.t('general:fields.name') })}`,
      ),
  })
  .required();

const DivisionInputModal = ({
  title,
  divisionType,
  onClose,
  onSubmit,
  defaultValue,
}: DivisionInputModalProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<DivisionFormTypes>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (defaultValue) reset({ name: defaultValue });
  }, []);

  return (
    <Modal title={title} onClose={onClose}>
      <form className="space-y-6">
        <Controller
          key="name"
          name="name"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <FormInput
                type="text"
                errorMessage={errors['name']?.message}
                readOnly={false}
                value={value}
                label={`${i18n.t('general:name')} ${i18n.t(
                  `division:entity.${divisionType.toLocaleLowerCase()}`,
                )}`}
                onChange={onChange}
                aria-invalid={errors['name']?.message ? 'true' : 'false'}
              />
            );
          }}
        />
      </form>
      <div className="flex flex-row-reverse">
        <Button
          label={i18n.t('general:add', {
            item: i18n.t(`division:entity.${divisionType.toLocaleLowerCase()}`),
          })}
          className="btn-primary"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </Modal>
  );
};

export default DivisionInputModal;

import React, { SyntheticEvent } from 'react';
import DatePicker from 'react-datepicker';

interface DatePickerInputProps {
  label?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  minDate?: Date;
  maxDate?: Date;
  onChange: (date: Date | null, event: SyntheticEvent<Date, Event> | undefined) => void;
  value?: Date;
  id?: string;
}

const DatePickerInput = ({
  label,
  placeholder,
  onChange,
  value,
  ...props
}: DatePickerInputProps) => {
  return (
    <div>
      {label && <label htmlFor={props?.id}>{label}</label>}
      <div className="mt-1 relative rounded-md">
        <DatePicker
          {...props}
          className="block w-full pr-10 border-cool-gray-300 shadow-sm rounded-md focus:ring-turquoise-500 focus:border-turquoise-500 sm:text-sm lg:text-base text-xs leading-loose"
          onChange={onChange}
          dateFormat="dd.MM.yyyy"
          selected={value}
          placeholderText={placeholder}
          id={props.id}
        />
      </div>
    </div>
  );
};

export default DatePickerInput;

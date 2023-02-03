import React, { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '../common/utils/utils';

export interface SelectItem {
  value: string;
  key: number;
}
interface SelectProps {
  label?: string;
  options: SelectItem[];
  onChange: (item: SelectItem) => void;
  defaultValue?: SelectItem;
  placeholder?: string;
}

const Select = ({ label, options, onChange, defaultValue, placeholder }: SelectProps) => {
  const [selected, setSelected] = useState<SelectItem | undefined>(defaultValue);

  useEffect(() => {
    if (selected) onChange(selected);
  }, [selected]);

  return (
    <Listbox defaultValue={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          {label && (
            <Listbox.Label className="block font-medium text-cool-gray-800 pb-1 sm:text-sm lg:text-base text-xs">
              {label}
            </Listbox.Label>
          )}
          <div className="relative">
            <Listbox.Button className="h-[44px] bg-white relative w-full border border-cool-gray-200 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base text-sm disabled:bg-cool-gray-100">
              <span className="block truncate lg:text-base text-sm">
                {selected ? (
                  <span className="text-cool-gray-800 font-normal sm:text-sm lg:text-base text-xs">
                    {selected.value}
                  </span>
                ) : (
                  <span className="text-cool-gray-500 font-roboto">{placeholder}</span>
                )}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronUpDownIcon className="h-5 w-5 text-cool-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 sm:text-sm lg:text-base text-xs ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                {options.map((item) => (
                  <Listbox.Option
                    key={item.key}
                    className={({ active }) =>
                      classNames(
                        active ? ' bg-indigo-50' : '',
                        'cursor-default select-none relative py-3 pl-3 pr-9 text-cool-gray-900',
                      )
                    }
                    value={item}
                  >
                    <span
                      className={classNames(
                        selected?.key === item.key ? 'font-semibold' : 'font-normal',
                        'block truncate lg:text-base text-sm',
                      )}
                    >
                      {item.value}
                    </span>

                    {selected?.key === item.key ? (
                      <span className="text-indigo-500 absolute inset-y-0 right-0 flex items-center pr-4">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default Select;
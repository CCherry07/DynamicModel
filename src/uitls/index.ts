import moment from 'moment';
import type React from 'react';
import type { handleFinishFormType } from './types';
// create time change to moment,format
const isVoid = (value: unknown) => (value === (undefined || null || '') ? true : false);
export const clearObject = (target: Record<string, any>) => {
  const resObj = { ...target };
  Object.keys(resObj).forEach((key: string) => {
    if (isVoid(resObj[key])) {
      delete resObj[key];
    }
  });
  return resObj;
};

export const finishFormAdaptor: handleFinishFormType = (values, options) => {
  const finishAdaptored = {
    ...values,
    ...options,
  } as any;
  Object.keys(finishAdaptored).forEach((key) => {
    if (isVoid(finishAdaptored[key])) {
      delete finishAdaptored[key];
      return;
    }
    if (moment.isMoment(finishAdaptored[key])) {
      finishAdaptored[key] = moment(finishAdaptored[key]).format();
    }
    if (Array.isArray(finishAdaptored[key])) {
      finishAdaptored[key] = finishAdaptored[key].map((value: any) => {
        if (moment.isMoment(value)) {
          return moment(value).format();
        }
        return value;
      });
    }
  });
  console.log(finishAdaptored);

  return finishAdaptored;
};
// datetime => moment
export const setFieldsAdaptor = (
  data: BasicPageDataApi.PageData,
  setInitialValues?: React.Dispatch<React.SetStateAction<any>>,
) => {
  if (!data.layout.tabs) return {};
  const adaptored = { ...(data.dataSource || {}) };
  data.layout.tabs.forEach(({ data: fields }) => {
    fields.forEach((field) => {
      if (field.type === 'datetime') {
        adaptored[field.key] = moment(adaptored[field.key]);
        if (setInitialValues) {
          setInitialValues((state: any) => {
            return { ...state, [field.key]: moment() };
          });
        }
      }
    });
  });
  return adaptored;
};

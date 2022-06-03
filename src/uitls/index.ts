import moment from 'moment';
import type React from 'react';
import type { handleFinishFormType } from './types';
// create time change to moment,format
export const finishFormAdaptor: handleFinishFormType = (values) => {
  const finishAdaptored = {
    ...values,
    'X-API-KEY': 'antd',
  } as const;
  Object.keys(finishAdaptored).forEach((key) => {
    if (moment.isMoment(finishAdaptored[key])) {
      finishAdaptored[key] = moment(finishAdaptored[key]).format();
    }
  });
  return finishAdaptored;
};

// eslint-disable-next-line @typescript-eslint/no-shadow
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

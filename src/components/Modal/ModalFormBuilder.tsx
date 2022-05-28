import { Input, Form } from 'antd';
import type { ReactNode } from 'react';

export const modalFormBuilder = (modalDate: PageApi.Datum[]): ReactNode => {
  console.log(modalDate);

  return modalDate.map((tab) => {
    return (
      <Form.Item key={tab.title} label={tab.title} name={tab.title}>
        <Input />
      </Form.Item>
    );
  });
};

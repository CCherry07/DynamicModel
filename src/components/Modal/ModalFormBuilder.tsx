import { Input, Form, TreeSelect, DatePicker, Switch } from 'antd';
import type { ReactNode } from 'react';

export const modalFormBuilder = (modalDate: PageApi.Datum[]): ReactNode => {
  return modalDate.map((field) => {
    switch (field.type) {
      case 'text':
        return (
          <Form.Item key={field.key} label={field.key} name={field.key}>
            <Input disabled={field?.disabled} />
          </Form.Item>
        );
      case 'datetime':
        return (
          <Form.Item key={field.key} label={field.key} name={field.key}>
            <DatePicker disabled={field?.disabled} showTime />
          </Form.Item>
        );
      case 'tree':
        return (
          <Form.Item key={field.key} label={field.key} name={field.key}>
            <TreeSelect treeCheckable disabled={field?.disabled} treeData={field.data} />
          </Form.Item>
        );
      case 'switch':
        return (
          <Form.Item key={field.key} label={field.key} name={field.key} valuePropName="checked">
            <Switch disabled={field?.disabled} />
          </Form.Item>
        );
      default:
        return null;
    }
  });
};
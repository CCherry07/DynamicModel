import { Col, DatePicker, Form, Input, Switch, TreeSelect } from 'antd';
import type { ReactNode } from 'react';

export const searchLayoutBuilder = (
  modalDate?: BasicPageDataApi.Field[],
  hidFieldConfig?: string[],
): ReactNode => {
  return (modalDate || []).map((field) => {
    if (hidFieldConfig?.some((item) => item === field.key)) {
      return null;
    }
    switch (field.type) {
      case 'text':
        return (
          <Col sm={6}>
            <Form.Item key={field.key} label={field.title} name={field.key}>
              <Input disabled={field?.disabled} />
            </Form.Item>
          </Col>
        );
      case 'datetime':
        return (
          <Col sm={12}>
            <Form.Item key={field.key} label={field.title} name={field.key}>
              <DatePicker.RangePicker
                style={{ width: '100%' }}
                disabled={field?.disabled}
                showTime
              />
            </Form.Item>
          </Col>
        );
      case 'tree':
        return (
          <Col sm={6}>
            <Form.Item key={field.key} label={field.title} name={field.key}>
              <TreeSelect treeCheckable disabled={field?.disabled} treeData={field.data} />
            </Form.Item>
          </Col>
        );
      case 'switch':
        return (
          <Col sm={6}>
            <Form.Item key={field.key} label={field.title} name={field.key} valuePropName="checked">
              <Switch disabled={field?.disabled} />
            </Form.Item>
          </Col>
        );
      default:
        return null;
    }
  });
};

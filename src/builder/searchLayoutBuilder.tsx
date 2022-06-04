import { Col, DatePicker, Form, Input, Switch, TreeSelect } from 'antd';
import moment from 'moment';
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
                ranges={{
                  ToDay: [moment().startOf('day'), moment().endOf('day')],
                  'Last 7 Days': [moment().subtract(7, 'd'), moment()],
                  'Last 30 Days': [moment().subtract(30, 'days'), moment()],
                  'Last Month': [
                    moment().subtract(1, 'months').startOf('month'),
                    moment().subtract(1, 'months').endOf('month'),
                  ],
                }}
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

import { Input, Form, TreeSelect, DatePicker, Switch, InputNumber, Radio } from 'antd';
import type { ReactNode } from 'react';

export const formBuilder = (
  modalDate?: BasicPageDataApi.Field[],
  hidFieldConfig?: string[],
): ReactNode => {
  return (modalDate || []).map((field) => {
    if (hidFieldConfig?.some((item) => item === field.key)) {
      return null;
    }
    const baseAttr = {
      key: field.key,
      label: field.title,
      name: field.key,
    };
    switch (field.type) {
      case 'text':
        return (
          <Form.Item {...baseAttr}>
            <Input disabled={field?.disabled} />
          </Form.Item>
        );
      case 'number':
        return (
          <Form.Item {...baseAttr}>
            <InputNumber disabled={field?.disabled} />
          </Form.Item>
        );
      case 'datetime':
        return (
          <Form.Item {...baseAttr}>
            <DatePicker disabled={field?.disabled} showTime />
          </Form.Item>
        );
      case 'tree':
        return (
          <Form.Item {...baseAttr}>
            <TreeSelect treeCheckable disabled={field?.disabled} treeData={field.data} />
          </Form.Item>
        );
      case 'switch':
        return (
          <Form.Item {...baseAttr} valuePropName="checked">
            <Switch disabled={field?.disabled} />
          </Form.Item>
        );
      case 'textarea':
        return (
          <Form.Item {...baseAttr}>
            <Input.TextArea disabled={field?.disabled} />
          </Form.Item>
        );
      case 'radio':
        return (
          <Form.Item {...baseAttr}>
            <Radio>
              <Radio.Group buttonStyle="solid" defaultValue={field.data ? field.data[0].value : ''}>
                {field.data?.map((item) => {
                  return (
                    <Radio.Button key={item.key} value={item.value}>
                      {item.name}
                    </Radio.Button>
                  );
                })}
              </Radio.Group>
            </Radio>
          </Form.Item>
        );
      case 'parent':
        return (
          <Form.Item {...baseAttr}>
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
              treeData={field.data}
              placeholder="Please Select"
              treeDefaultExpandAll
              allowClear
            />
          </Form.Item>
        );
      default:
        return null;
    }
  });
};

import type { Actions } from 'ahooks/lib/useToggle';
import { Form, Row, Divider, Col, InputNumber, Button, Space } from 'antd';
import { searchLayoutBuilder } from '../../../builder/searchLayoutBuilder';
import styles from './index.less';
interface SearchLayoutProps {
  isSearch: boolean;
  setIsSearch: Actions<boolean>;
  fields?: BasicPageDataApi.Field[];
}

export const SearchLayout = (props: SearchLayoutProps) => {
  const { isSearch, fields } = props;
  return isSearch ? (
    <div className={styles.searchLayout}>
      <Form layout="inline">
        <Row gutter={24}>
          <Col sm={6}>
            <Form.Item key="iD" label="ID" name="id">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          {searchLayoutBuilder(fields)}
        </Row>
        <Col sm={24} style={{ textAlign: 'right' }}>
          <Space>
            <Button> clear </Button>
            <Button type="primary"> submit </Button>
          </Space>
        </Col>
      </Form>
      <Divider orientation="left" orientationMargin="0">
        SEARCH
      </Divider>
    </div>
  ) : null;
};

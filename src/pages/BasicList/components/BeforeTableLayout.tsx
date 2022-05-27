import { Col, Row, Space } from 'antd';
import { actionsBuilder } from '../componentBuilder';
export const BeforeTableLayout = ({ actions }: { actions: BasicPageDataApi.Action[] }) => {
  return (
    <Row style={{ marginBottom: '1.5rem' }}>
      <Col xs={24} sm={12}>
        ...
      </Col>
      <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
        <Space>{actionsBuilder(actions)}</Space>
      </Col>
    </Row>
  );
};

// const Container = styled.div`

// `

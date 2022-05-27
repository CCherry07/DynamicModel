import { Row, Col } from 'antd';
export const AfterTableLayout = () => {
  return (
    <Row>
      <Col xs={24} sm={12}>
        ...
      </Col>
      <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
        tableToolbal
      </Col>
    </Row>
  );
};

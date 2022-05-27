import { Col, Row, Button, Space } from 'antd';
export const BeforeTableLayout = () => {
  return (
    <Row style={{ marginBottom: '1.5rem' }}>
      <Col xs={24} sm={12}>
        ...
      </Col>
      <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
        <Space>
          <Button type="primary"> Add </Button>
          <Button type="primary"> Add2 </Button>
        </Space>
      </Col>
    </Row>
  );
};

// const Container = styled.div`

// `

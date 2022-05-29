import { Col, Row, Space } from 'antd';
import { actionsBuilder } from '../componentBuilder';
interface BeforeTableLayoutProps {
  actions: BasicPageDataApi.Action[];
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setModalDataUrl: React.Dispatch<React.SetStateAction<string>>;
}
export const BeforeTableLayout = (props: BeforeTableLayoutProps) => {
  const { actions, setVisible, setModalDataUrl } = props;
  const actionsHandler = (actionInfo: BasicPageDataApi.Action) => {
    switch (actionInfo.action) {
      case 'modal':
        setModalDataUrl(actionInfo?.uri || '');
        setVisible(true);
        break;
      case 'cancel':
        setVisible(false);
      default:
        break;
    }
  };

  return (
    <Row style={{ marginBottom: '1.5rem' }}>
      <Col xs={24} sm={12}>
        ...
      </Col>
      <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
        <Space>{actionsBuilder(actions, actionsHandler)}</Space>
      </Col>
    </Row>
  );
};

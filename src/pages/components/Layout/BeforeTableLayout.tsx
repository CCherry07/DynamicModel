import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Tooltip } from 'antd';
import { actionsBuilder } from '../../../builder/actionsBuilder';
interface BeforeTableLayoutProps {
  actions: BasicPageDataApi.Action[];
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setModalDataUrl: React.Dispatch<React.SetStateAction<string>>;
  pageReload: () => void;
}
export const BeforeTableLayout = (props: BeforeTableLayoutProps) => {
  const { actions, setVisible, setModalDataUrl, pageReload } = props;

  const actionsHandler = (actionInfo: BasicPageDataApi.Action) => {
    switch (actionInfo.action) {
      case 'modal':
        setModalDataUrl(actionInfo?.uri || '');
        setVisible(true);
        break;
      case 'reload':
        pageReload();
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
        <Space>
          <Tooltip title="Search">
            <Button icon={<SearchOutlined />} shape="circle" />
          </Tooltip>
          {actionsBuilder(actions, actionsHandler)}
        </Space>
      </Col>
    </Row>
  );
};

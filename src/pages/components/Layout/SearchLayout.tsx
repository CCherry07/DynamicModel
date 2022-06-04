import type { Actions } from 'ahooks/lib/useToggle';
import { Form, Row, Divider } from 'antd';
import { searchLayoutBuilder } from '../../../builder/searchLayoutBuilder';
interface SearchLayoutProps {
  isSearch: boolean;
  setIsSearch: Actions<boolean>;
  fields?: BasicPageDataApi.Field[];
}

export const SearchLayout = (props: SearchLayoutProps) => {
  const { isSearch, fields } = props;
  return isSearch ? (
    <div style={{ margin: '1rem  0' }}>
      <Form layout="inline">
        <Row>{searchLayoutBuilder(fields)}</Row>
      </Form>
      <Divider orientation="left" orientationMargin="0">
        SEARCH
      </Divider>
    </div>
  ) : null;
};

// const Container = styled.div`
//   margin: 1rem 0;
// `

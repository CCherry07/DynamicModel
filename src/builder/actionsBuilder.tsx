import { Button } from 'antd';
import type { ButtonType } from 'antd/lib/button';

export const actionsBuilder = (
  actions?: BasicPageDataApi.Action[],
  actionsHandler?: (actionInfo: BasicPageDataApi.Action, row?: Record<string, any>) => void,
  loading?: boolean,
  row?: any,
) => {
  return (actions || []).map((action) => {
    if (action.component === 'button') {
      return (
        <Button
          key={action.text}
          type={action.type as ButtonType}
          onClick={() => actionsHandler?.(action, row)}
          loading={action.action === 'submit' ? loading : undefined}
        >
          {action.text}
        </Button>
      );
    }
    return null;
  });
};

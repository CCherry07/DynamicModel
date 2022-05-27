import { Button } from 'antd';

export const actionsBuilder = (actions: BasicPageDataApi.Action[]) => {
  return actions.map((action) => {
    if (action.component === 'button') {
      return <Button type={action.type as any}>{action.text}</Button>;
    }
    return null;
  });
};

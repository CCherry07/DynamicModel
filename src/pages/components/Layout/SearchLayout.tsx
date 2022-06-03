import type { Actions } from 'ahooks/lib/useToggle';
interface SearchLayoutProps {
  isSearch: boolean;
  setIsSearch: Actions<boolean>;
}

export const SearchLayout = (props: SearchLayoutProps) => {
  const { isSearch } = props;
  return isSearch ? <div>show</div> : <div>none</div>;
};

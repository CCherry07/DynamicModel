import { useEffect, useState } from 'react';
interface PageConfig {
  pathName?: string;
  page: number;
  per_page: number;
  sort?: string;
  order?: string;
}

export const usePageConfig = (
  defaultConfig: PageConfig,
): [PageConfig, React.Dispatch<React.SetStateAction<PageConfig>>] => {
  const { pathName } = defaultConfig;
  const [pageConfig, setPageConfig] = useState(defaultConfig);
  const [pathMap, setPathMap] = useState(new Map());
  useEffect(() => {
    if (pathMap.has(pathName)) {
      setPageConfig(pathMap.get(pathName));
    } else {
      pathMap.set(pathName, defaultConfig);
    }
  }, [pathName]);
  useEffect(() => {
    setPathMap((map) => {
      return map.set(pathName, pageConfig);
    });
  }, [pageConfig]);
  return [pageConfig, setPageConfig];
};

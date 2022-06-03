type MarkProps = {
  target: string;
  keyword?: string;
  keywordSize?: string;
  color?: string;
};
export const Mark = ({ target, keyword, color, keywordSize }: MarkProps) => {
  if (!keyword) return <>{target}</>;
  const stringSlices = target.split(keyword);
  return (
    <>
      {stringSlices.map((str, index) => (
        <span key={str}>
          {str}
          {index === stringSlices.length - 1 ? null : (
            <span style={{ fontSize: keywordSize, color: color || '#448df7' }}>{keyword}</span>
          )}
        </span>
      ))}
    </>
  );
};

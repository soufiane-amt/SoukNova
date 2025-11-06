import { useEffect, useState } from 'react';

export function useShowMore<T>(items: T[], defaultShowCount: number = 5) {
  const [showCount, setShowCount] = useState(defaultShowCount);
  const [visibleItems, setVisibleItems] = useState<T[]>([]);

  const handleShowMore = () => {
    setShowCount((prev) => Math.min(prev + defaultShowCount, items.length));
  };

  useEffect(() => {
    setVisibleItems(items.slice(0, showCount));
  }, [items, showCount]);
  const hasMore = showCount < items.length;

  return { visibleItems,setVisibleItems, showCount, handleShowMore, hasMore };
}

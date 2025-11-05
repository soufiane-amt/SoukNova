import { useState } from "react";

export function useShowMore<T>(items: T[], defaultShowCount: number = 5) {
  const [showCount, setShowCount] = useState(defaultShowCount);

  const handleShowMore = () => {
    setShowCount((prev) => Math.min(prev + defaultShowCount, items.length));
  };

  const visibleItems = items.slice(0, showCount);
  const hasMore = showCount < items.length;

  return { visibleItems, showCount, handleShowMore, hasMore };
}

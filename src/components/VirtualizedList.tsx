import React, { useCallback } from 'react';
import { VariableSizeList as List, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number | ((index: number) => number);
  overscanCount?: number;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight = 200,
  overscanCount = 5,
  className = '',
}: VirtualizedListProps<T>) {
  const getItemSize = useCallback(
    (index: number) => {
      if (typeof itemHeight === 'function') {
        return itemHeight(index);
      }
      return itemHeight;
    },
    [itemHeight]
  );

  const Row = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      return <div style={style}>{renderItem(items[index], index)}</div>;
    },
    [items, renderItem]
  );

  return (
    <div className={`w-full h-full ${className}`}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={items.length}
            itemSize={getItemSize}
            width={width}
            overscanCount={overscanCount}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}

export const MemoizedVirtualizedList = React.memo(VirtualizedList) as typeof VirtualizedList;

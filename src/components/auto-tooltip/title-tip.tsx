import useOverlayScroller from '@/hooks/use-overlay-scroller';
import React from 'react';

interface TitleTipProps {
  isOverflowing: boolean;
  showTitle: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
}

const TitleTip: React.FC<TitleTipProps> = (props) => {
  const { isOverflowing, showTitle, title, children } = props;
  const { initialize } = useOverlayScroller();
  const scrollRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      initialize(scrollRef.current);
    }
  }, [initialize, scrollRef.current]);

  return (
    <div style={{ maxHeight: 200, overflowY: 'auto' }} ref={scrollRef}>
      <div
        style={{
          width: 'fit-content',
          maxWidth: 'var(--width-tooltip-max)',
          paddingInline: 8
        }}
      >
        {isOverflowing || showTitle ? title || children : ''}
      </div>
    </div>
  );
};

export default React.memo(TitleTip);

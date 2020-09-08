import { useEffect, useRef, useState } from "react";
import _throttle from 'lodash.throttle';

export function useGetNowScrollDirection(thresholdHeight = 30) {

  const [isScrollDown, setIsScrollDown] = useState(false); // true => scrollDown,  false => scrollUp
  const isScrollDownRef = useRef(false); // true => scrollDown,  false => scrollUp
  const previousScrollTopRef = useRef(0);

  const _handleOnScroll = () => {
    const nowScrollTop = window.pageYOffset;
    // if !isScrollDownRef.current  is true means the scroll direction has changed
    // when you pull to the topest edge of mobile browser, previousScrollTopRef.current will become a minors number and you will see it bounced back on the UI
    if (nowScrollTop > previousScrollTopRef.current && !isScrollDownRef.current && previousScrollTopRef.current > 0) {
      isScrollDownRef.current = !isScrollDownRef.current 
      setIsScrollDown(true);
    } else if (nowScrollTop < previousScrollTopRef.current && isScrollDownRef.current) {
      isScrollDownRef.current = !isScrollDownRef.current
      setIsScrollDown(false);
    }
    if (
       Math.abs(nowScrollTop - previousScrollTopRef.current) >= thresholdHeight
    ) {
       previousScrollTopRef.current = nowScrollTop;
    }

  };

  const throttledHandleOnScroll = _throttle(_handleOnScroll, 500)

  useEffect(() => {
    window.addEventListener("scroll", throttledHandleOnScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleOnScroll);
    };
  }, []);

  return isScrollDown;
}

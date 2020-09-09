import { useEffect, useRef, useState, useMemo } from "react";
import _throttle from 'lodash.throttle';
import invariant from 'invariant'

export default function useGetIsScrollOverThreshold (thresholdPX = 200, throttleTime = 500) {

  const _threshold = useMemo(() => {
      const examinedThresholdPX = Number(thresholdPX)
      invariant(!isNaN(examinedThresholdPX), 'thresholdPX should be pure Number, or number like string!')
      return examinedThresholdPX
  }, [thresholdPX])
  const [isScrollOverHeaderHeight, setIsScrollOverHeaderHeight] = useState(
    false
  )
  const isSettedRef = useRef(false)

  const _handleOnScroll = evt => {
    if (window.pageYOffset >= _threshold && !isSettedRef.current) {
      isSettedRef.current = true
      setIsScrollOverHeaderHeight(prev => !prev)
    }
    if (window.pageYOffset < _threshold && isSettedRef.current) {
      isSettedRef.current = false
      setIsScrollOverHeaderHeight(prev => !prev)
    }
  }

 const throttledHandleOnScroll = _throttle(_handleOnScroll, throttleTime)

  useEffect(() => {
    window.addEventListener('scroll', throttledHandleOnScroll)
    return () => {
      window.removeEventListener('scroll', throttledHandleOnScroll)
    }
  }, [])

  return isScrollOverHeaderHeight;
}

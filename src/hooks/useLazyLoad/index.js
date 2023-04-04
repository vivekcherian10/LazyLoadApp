import { useEffect, useCallback, useState } from "react";
import debounce from "lodash/debounce";
import { useDispatch, useSelector } from "react-redux";
import { setPageData } from "../../store/listSlice";

const INTERSECTION_THRESHOLD = 5;
const LOAD_DELAY_MS = 5000;

const useLazyLoad = ({ triggerRef, getPageData, options }) => {
  const dispatch = useDispatch();
  const { listItems, currentPage } = useSelector((state) => state.list);
  const [pageTittle, setPageTittle] = useState();

  const _handleEntry = async (entry) => {
    const boundingRect = entry.boundingClientRect;
    const intersectionRect = entry.intersectionRect;

    if (
      entry.isIntersecting &&
      intersectionRect.bottom - boundingRect.bottom <= INTERSECTION_THRESHOLD
    ) {
      const { pageData, tittle } = getPageData(currentPage);
      setPageTittle(tittle);

      let tempData = [...listItems];
      tempData.push(...pageData);
      dispatch(setPageData(tempData));
    }
  };
  const handleEntry = debounce(_handleEntry, LOAD_DELAY_MS);

  const onIntersect = useCallback(
    (entries) => {
      handleEntry(entries[0]);
    },
    [handleEntry]
  );

  // to trigger when scroll reach bottom div
  useEffect(() => {
    if (triggerRef.current) {
      const container = triggerRef.current;
      const observer = new IntersectionObserver(onIntersect, options);

      observer.observe(container);

      return () => {
        observer.disconnect();
      };
    }
  }, [triggerRef, onIntersect, options]);

  return { listItems, pageTittle };
};

export default useLazyLoad;

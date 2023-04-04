import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import useLazyLoad from "../../hooks/useLazyLoad";
import { Card } from "../../components/Card";
import { resetCurrentPage, setSearchData } from "../../store/listSlice";
import list from "../../data/listData.json";
import backUrl from "../../assets/Back.png";
import searchUrl from "../../assets/search.png";

export const Posts = () => {
  const [isSearchClicked, setIsSearchClicked] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  // const [searchResults, setSearchResults] = useState([]);
  const listData = list.data;
  const triggerRef = useRef(null);
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.list);

  //function to retrieve data by page no
  const getPageData = (currentPage) => {
    let pageData = [];
    let tittle;
    listData.length > 0 &&
      listData.map((item) => {
        if (item.page["page-num-requested"] === `${currentPage}`) {
          tittle = item.page.title;
          pageData.push(...item.page["content-items"]["content"]);
        }
      });
    return { pageData, tittle };
  };
  const options = {
    root: document.querySelector("#scrollArea"),
    rootMargin: "0px",
    threshold: 1.0,
  };

  // lazy loaded data
  const { listItems, pageTittle } = useLazyLoad({
    triggerRef,
    getPageData,
    options,
  });

  //To search list
  useEffect(() => {
    // minimum 3 words to trigger search
    if (searchInput.length > 3) {
      let tempData = listItems.filter((item) =>
        item.name.match(new RegExp(searchInput, "i"))
      );
      dispatch(setSearchData(tempData));
      // setSearchResults(tempData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, listItems]);
  const onBackButton = () => {
    if (isSearchClicked) {
      //clear serach on back button if search is clicked
      setIsSearchClicked(false);
      setSearchInput("");
      dispatch(setSearchData([]));
      // setSearchResults([]);
    } else {
      dispatch(resetCurrentPage);
      window.scrollTo({
        top: 0,
      });
    }
  };

  // to handle search
  const onSearch = () => {
    setIsSearchClicked(true);
  };

  // function to handle input change
  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <>
      <div className="App-header">
        <button className="nav-button back-button" onClick={onBackButton}>
          <img className="object-scale-down h-48 w-96" src={backUrl} alt="" />
        </button>
        {isSearchClicked ? (
          <input
            className="text-input"
            type="text"
            maxLength={15}
            value={searchInput}
            onChange={handleChange}
          />
        ) : (
          <div className="nav-tittle">{pageTittle}</div>
        )}
        {!isSearchClicked && (
          <button className="nav-button search-button" onClick={onSearch}>
            <img
              className="object-scale-down h-48 w-96"
              src={searchUrl}
              alt=""
            />
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 card-item content-start">
        {/* if there are search results it is shown else previously loaded list is shown */}
        {searchResults?.length > 0
          ? searchResults?.map((item, index) => {
              return <Card data={item} key={index} />;
            })
          : listItems?.length > 0 &&
            listItems?.map((item, index) => {
              return <Card data={item} key={index} />;
            })}
      </div>
      {/* target branch to trigger lazy loading */}
      <div
        ref={triggerRef}
        className={clsx("trigger", { visible: true })}
      ></div>
    </>
  );
};

import { useMemo } from "react";
import classNames from "classnames";
import { Select } from "@chakra-ui/react";
import styles from "./Pagination.module.scss";
import { BiChevronLeft, BiChevronRight, BiChevronsLeft, BiChevronsRight } from "react-icons/bi";

const DOTS = "...";

const range = (start: number, end: number) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

export type PaginationProps = {
    totalCount: number;
    pageNo: number;
    pageSize: number;
    loading: boolean;
    pageSizes?: number[];
    handleChange: (pageNo: number, pageSize: number) => void;
};

const Pagination = (props: PaginationProps & { pageSizes: number[] }) => {
    let { totalCount, pageNo, pageSize, loading, pageSizes, handleChange } = props;

    const totalPageCount = Math.ceil(totalCount / pageSize);

    const paginationRange =
        useMemo(() => {
            const siblingCount = 1;

            const totalPageNumbers = siblingCount + 5;

            if (totalPageNumbers >= totalPageCount) {
                return range(1, totalPageCount);
            }
            const leftSiblingIndex = Math.max(pageNo - siblingCount, 1);
            const rightSiblingIndex = Math.min(pageNo + siblingCount, totalPageCount);

            const shouldShowLeftDots = leftSiblingIndex > 2;
            const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

            const firstPageIndex = 1;
            const lastPageIndex = totalPageCount;

            if (!shouldShowLeftDots && shouldShowRightDots) {
                let leftItemCount = 3 + 2 * siblingCount;
                let leftRange = range(1, leftItemCount);

                return [...leftRange, DOTS, totalPageCount];
            }

            if (shouldShowLeftDots && !shouldShowRightDots) {
                let rightItemCount = 3 + 2 * siblingCount;
                let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
                return [firstPageIndex, DOTS, ...rightRange];
            }

            if (shouldShowLeftDots && shouldShowRightDots) {
                let middleRange = range(leftSiblingIndex, rightSiblingIndex);
                return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
            }
        }, [totalCount, pageSize, pageNo]) || [];

    const changePageSize = (event: any) => {
        handleChange(1, Number(event.target.value));
    };

    const handleClickFirst = () => {
        if (pageNo !== 1) {
            handleChange(1, pageSize);
        }
    };

    const handleClickPrevious = () => {
        if (pageNo - 1 > 0) {
            handleChange(pageNo - 1, pageSize);
        }
    };

    const handleClickPage = (clickedPageNo: number) => {
        if (clickedPageNo !== pageNo) {
            handleChange(clickedPageNo, pageSize);
        }
    };

    const handleClickNext = () => {
        if (pageNo + 1 <= totalPageCount) handleChange(pageNo + 1, pageSize);
    };

    let lastPage = paginationRange[paginationRange.length - 1] as number;

    const handleClickLast = () => {
        if (pageNo !== lastPage) {
            handleChange(lastPage, pageSize);
        }
    };

    const rangeStart = pageSize * (pageNo - 1) + 1;
    const rangeFinish = Math.min(pageSize * (pageNo - 1) + pageSize, totalCount);

    const loadingClass = { [styles.loading]: loading };

    return (
        <div className={styles.container}>
            <div className={styles.infoText}>
                {rangeStart !== rangeFinish && rangeStart > 0 && rangeFinish > 0
                    ? `${rangeStart} - ${rangeFinish}`
                    : rangeStart}{" "}
                из {totalCount}
            </div>
            <ul className={styles.navigationContainer}>
                <li
                    className={classNames(styles.item, {
                        [styles.disabled]: pageNo === 1,
                        ...loadingClass,
                    })}
                    onClick={handleClickFirst}
                >
                    <BiChevronsLeft className="icon" />
                </li>
                <li
                    className={classNames(styles.item, {
                        [styles.disabled]: pageNo === 1,
                        ...loadingClass,
                    })}
                    onClick={handleClickPrevious}
                >
                    <BiChevronLeft className="icon" />
                </li>
                {paginationRange.map((pageNumber, pageNumberIndex) => {
                    if (pageNumber === DOTS) {
                        return (
                            <li
                                key={`dots_${pageNumber}_${pageNumberIndex}`}
                                className={classNames(styles.item, styles.dots, {
                                    ...loadingClass,
                                })}
                            >
                                &#8230;
                            </li>
                        );
                    }

                    return (
                        <li
                            key={`pageNo_${pageNumber}`}
                            className={classNames(styles.item, {
                                [styles.selected]: pageNumber === pageNo,
                                ...loadingClass,
                            })}
                            onClick={() => handleClickPage(pageNumber as number)}
                        >
                            {pageNumber}
                        </li>
                    );
                })}
                <li
                    className={classNames(styles.item, {
                        [styles.disabled]: pageNo === lastPage,
                        ...loadingClass,
                    })}
                    onClick={handleClickNext}
                >
                    <BiChevronRight className="icon" />
                </li>
                <li
                    className={classNames(styles.item, {
                        [styles.disabled]: pageNo === lastPage,
                        ...loadingClass,
                    })}
                    onClick={handleClickLast}
                >
                    <BiChevronsRight className="icon" />
                </li>
            </ul>
            <Select
                width="max-content"
                value={pageSize}
                variant="outline"
                size="sm"
                onChange={changePageSize}
                isDisabled={loading}
            >
                {pageSizes.map((pageSizesItem) => (
                    <option key={pageSizesItem} value={pageSizesItem}>
                        {pageSizesItem} / стр
                    </option>
                ))}
            </Select>
        </div>
    );
};

export default Pagination;

import React, {useMemo} from 'react';
import classnames from 'classnames';
import './pagination.scss';
import {Select} from '@chakra-ui/react'
import {ArrowLeftIcon, ArrowRightIcon, SearchIcon} from '@chakra-ui/icons'

export const DOTS = '...';

const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({
                                  totalCount,
                                  pageSize,
                                  siblingCount = 1,
                                  currentPage
                              }) => {
    const paginationRange = useMemo(() => {
        console.log(pageSize)
        const totalPageCount = Math.ceil(totalCount / pageSize);

        const totalPageNumbers = siblingCount + 5;

        if (totalPageNumbers >= totalPageCount) {
            return range(1, totalPageCount);
        }
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
            currentPage + siblingCount,
            totalPageCount
        );

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
            let rightRange = range(
                totalPageCount - rightItemCount + 1,
                totalPageCount
            );
            return [firstPageIndex, DOTS, ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }
    }, [totalCount, pageSize, siblingCount, currentPage]);

    return paginationRange;
};

const Pagination = props => {
    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize,
        setPageSize,
        className
    } = props;


    let paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    function ChangePageSize(event) {
        setPageSize(Number(event.target.value));
    }

    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];

    const onFirst = () => {
        onPageChange(1);
    };

    const onLast = () => {
        onPageChange(lastPage);
    };

    return (
        <div style={{display: "flex", alignItems: "center"}}>
            <ul
                className={classnames('pagination-container', { [className]: className })}
            >
                <div style={{display: "flex", alignItems: "center", fontSize: "13px"}}>
                    Записи {pageSize*(currentPage-1)+1} - {pageSize*(currentPage-1) + pageSize} из {totalCount}
                </div>
                <li
                    className={classnames('pagination-item', {
                        disabled: currentPage === 1
                    })}
                    onClick={onFirst}
                >
                    <ArrowLeftIcon className='iconButton'/>
                </li>
                <li
                    className={classnames('pagination-item', {
                        disabled: currentPage === 1
                    })}
                    onClick={onPrevious}
                >
                    <div className="arrow left" />
                </li>
                {paginationRange.map(pageNumber => {
                    if (pageNumber === DOTS) {
                        return <li className="pagination-item dots">&#8230;</li>;
                    }

                    return (
                        <li
                            className={classnames('pagination-item', {
                                selected: pageNumber === currentPage
                            })}
                            onClick={() => onPageChange(pageNumber)}
                        >
                            {pageNumber}
                        </li>
                    );
                })}
                <li
                    className={classnames('pagination-item', {
                        disabled: currentPage === lastPage
                    })}
                    onClick={onNext}
                >
                    <div className="arrow right" />
                </li>
                <li
                    className={classnames('pagination-item', {
                        disabled: currentPage === lastPage
                    })}
                    onClick={onLast}
                >
                    <ArrowRightIcon className='iconButton'/>
                </li>
            </ul>
            <div style={{justifyContent: 'flex-start'}}>
                <Select defaultValue={'10'} variant='outline' size='lg' icon={'none'} onChange={ChangePageSize}>
                    <option value='10'>10</option>
                    <option value='20'>20</option>
                    <option value='30'>30</option>
                </Select>
            </div>
        </div>
    );
};

export default Pagination;
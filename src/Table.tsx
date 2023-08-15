import { useMemo, useState } from "react";
import Pagination from "./Pagination";

const createMock = (amount: number) => {
    const data = [];
    for (let i = 1; i <= amount; i++) {
        data.push({ name: `name-${i}`, value: i });
    }

    return data;
};
const TableComponent = () => {
    const data = createMock(76);

    const [PageSize, setPageSize] = useState(10);

    const [currentPage, setCurrentPage] = useState(1);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return data.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, PageSize]);

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>value</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTableData.map((item) => {
                        return (
                            <tr>
                                <td>{item.name}</td>
                                <td>{item.value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Pagination
                totalCount={25}
                pageNo={1}
                pageSize={10}
                loading={false}
                pageSizes={[10, 20, 50, 100]}
                handleChange={(pageNo, pageSize) => {
                    console.log(pageNo, pageSize);
                }}
            />
        </>
    );
};

export default TableComponent;

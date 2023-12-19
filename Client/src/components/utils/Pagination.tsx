import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

interface IPagination {
    currentPage: number;
    pages: number;
    handelOnChange: (newPage: number) => void;
}

const Pagination = (props: IPagination) => {
    return props.pages < 2 ? null : (
        <nav aria-label="Page navigation" className="flex flex-row w-full h-8 justify-center items-center">

            <div
                onClick={props.currentPage !== 1 ? () => props.handelOnChange(props.currentPage - 1) : undefined}
                className={`${props.currentPage !== 1 ? "hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer" : ""} px-3 py-2 w-fit h-full flex ml-0 dark:text-secondary text-primary bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-l-lg`}>
                <FaAngleLeft />
            </div>

            {Array.from({ length: props.pages }).map((_, index) => (
                <div
                    key={index}
                    onClick={props.currentPage !== (index + 1) ? () => props.handelOnChange(index + 1) : undefined}
                    className={`${props.currentPage !== (index + 1) ? "hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer" : ""} px-3 py-2 w-fit h-full flex dark:text-secondary text-primary items-center justify-center text-center border bg-white dark:bg-black border-gray-300 dark:border-gray-700 rounded-sm`}>
                    {index + 1}
                </div>
            ))}

            <div
                onClick={props.currentPage !== props.pages ? () => props.handelOnChange(props.currentPage + 1) : undefined}
                className={`${props.currentPage !== props.pages ? "hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer" : ""} px-3 py-2 w-fit h-full flex ml-0 dark:text-secondary text-primary bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-r-lg`}>
                <FaAngleRight />
            </div>

        </nav>
    )
}


export default Pagination;

import { GrPrevious, GrNext } from 'react-icons/gr';


interface IPagination {
    currentPage: number;
    pages: number;
    handelOnChange: (newPage: number) => void;
}

const Pagination = (props: IPagination) => {
    return (
        <nav aria-label="Page navigation" className="flex flex-row w-full h-8 justify-center items-center">

            <div
                onClick={props.currentPage !== 1 ? () => props.handelOnChange(props.currentPage - 1) : undefined}
                className={`${props.currentPage !== 1 ? "hover:bg-slate-200 hover:text-gray-700 cursor-pointer" : ""} px-3 py-2 w-fit h-full flex ml-0 text-primary bg-white border border-gray-300 rounded-l-lg`}>
                <GrPrevious />
            </div>

            {Array.from({ length: props.pages }).map((_, index) => (
                <div
                    key={index}
                    onClick={props.currentPage !== (index + 1) ? () => props.handelOnChange(index + 1) : undefined}
                    className={`${props.currentPage !== (index + 1) ? "hover:bg-slate-200 hover:text-gray-700 bg-white cursor-pointer" : "bg-slate-200"} px-3 py-2 w-fit h-full flex text-primary items-center justify-center text-center border border-gray-300 rounded-sm`}>
                    {index + 1}
                </div>
            ))}

            <div
                onClick={props.currentPage !== props.pages ? () => props.handelOnChange(props.currentPage + 1) : undefined}
                className={`${props.currentPage !== props.pages ? "hover:bg-slate-200 hover:text-gray-700 cursor-pointer" : ""} px-3 py-2 w-fit h-full flex ml-0 text-primary bg-white border border-gray-300 rounded-r-lg`}>
                <GrNext />
            </div>

        </nav>
    )
}


export default Pagination;

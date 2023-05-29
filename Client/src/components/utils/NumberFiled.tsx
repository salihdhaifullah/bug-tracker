import { ChangeEventHandler, ForwardedRef, forwardRef, useId } from "react";

interface INumberFiledProps {
    onChange: ChangeEventHandler<HTMLInputElement>;
    label: string
    value: number
}


const NumberFiled = forwardRef((props: INumberFiledProps, ref: ForwardedRef<HTMLDivElement>) => {
    const Id = useId();

    const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e)
    }

    return (
        <div ref={ref} className="flex flex-col justify-center items-center p-1 px-2 w-full">
            <div className="flex flex-col gap-0.5 w-full justify-center items-center relative">
                <label
                    htmlFor={Id}
                    className="text-sm text-primary ">
                    {props.label}
                </label>

                <input
                    className="p-1 border h-fit rounded-sm w-full border-gray-400 hover:border-gray-900 focus:outline-secondary"
                    id={Id}
                    value={props.value}
                    type="number"
                    onChange={handelChange}
                />
            </div>
        </div>
    )
})

export default NumberFiled;


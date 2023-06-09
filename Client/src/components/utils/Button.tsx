import { HTMLProps } from 'react';
import CircleProgress from './CircleProgress'


type Size = "sm" | "md" | "lg" | "xl" | "2xl" | undefined;

function getSize(size: Size) {
    let sizeClass = "";

    switch (size) {
        case "sm":
            sizeClass = "text-sm px-1 py-0.5";
            break;
        case "md":
            sizeClass = "text-base px-2 py-1";
            break;
        case "lg":
            sizeClass = "text-lg px-4 py-2";
            break;
        case "xl":
            sizeClass = "text-xl px-6 py-3";
            break;
        case "2xl":
            sizeClass = "text-2xl px-8 py-4";
            break;
        default:
            sizeClass = "text-base px-2 p-1"
            break;
    }

    return sizeClass;
}


interface IButtonProps {
    text: string;
    isLoading?: boolean;
    isValid?: boolean;
    buttonProps?: HTMLProps<HTMLButtonElement> & {type?: "button" | "submit" | "reset"}
    size?: Size
}

const Button = (props: IButtonProps) => {

    return (
        <div className="flex justify-center my-2">
            {props.isValid === false ? (
                <button disabled
                    className={`text-primary ${getSize(props.size)} bg-gray-300 text-center cursor-not-allowed rounded-md border-0 font-bold shadow-md`}>
                    {props.text}
                </button>
            ) : (
                <button
                    {...props.buttonProps}
                    disabled={props.isLoading}
                    className={`text-primary ${getSize(props.size)} bg-secondary flex justify-center items-center text-center rounded-md border-0 font-bold ${props.isLoading ? "cursor-wait" : "cursor-pointer"} transition-all  ease-in-out shadow-lg hover:shadow-xl hover:border-gray-600 hover:text-white`}>
                    {props.isLoading ? <CircleProgress size="md" /> : props.text}
                </button>
            )}
        </div>
    )
}

export default Button;

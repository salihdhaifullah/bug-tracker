import { HTMLProps, ReactElement } from 'react';
import CircleProgress from './CircleProgress'

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

function getSize(size?: Size) {
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
    className?: string
    children?: ReactElement | ReactElement[] | string
    onClick?: () => void;
    isLoading?: boolean;
    isValid?: boolean;
    buttonProps?: HTMLProps<HTMLButtonElement> & { type?: "button" | "submit" | "reset" }
    size?: Size
}

const Button = (props: IButtonProps) => {
    return (
        <button
            {...(props.isValid === false ? {} : props.buttonProps)}
            disabled={props.isValid === false || props.isLoading}
            onClick={props.onClick}
            className={`${getSize(props.size)} ${props.isLoading ? "cursor-wait" : "cursor-pointer"}
                ${props.isValid === false ? "bg-gray-300 cursor-not-allowed" : "bg-secondary"}
                ${props.className || ""} rounded-md border-0  outline-none whitespace-nowrap font-bold text-primary text-center transition-all ease-in-out shadow-md hover:shadow-lg hover:border-gray-600 w-fit h-fit hover:text-white
            `}>

            {props.isLoading ? <CircleProgress size="xm" /> : props.children}
        </button>
    )
}

export default Button;

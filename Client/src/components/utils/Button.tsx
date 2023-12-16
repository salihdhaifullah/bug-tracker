import { HTMLProps, ReactElement } from 'react';
import CircleProgress from './CircleProgress'

type Size = "sm" | "md" | "lg";

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
            sizeClass = "text-lg px-3 py-1.5";
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
            type={props.buttonProps?.type || 'button'}
            {...(props.isValid === false ? {} : props.buttonProps)}
            disabled={props.isValid === false || props.isLoading}
            onClick={props.onClick}
            className={`${getSize(props.size)}
                ${props.isValid === false ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed" :  (props.isLoading ? "cursor-wait" : "cursor-pointer") + " dark:bg-secondary bg-primary"}
                ${props.className || ""} rounded-md border-0 outline-none whitespace-nowrap font-bold dark:text-primary text-secondary dark:hover:text-black hover:text-white text-center transition-all ease-in-out shadow-md hover:shadow-lg dark:shadow-secondary/40 dark:hover:border-gray-400 hover:border-gray-600 w-fit h-fit
            `}>

            {props.isLoading ? <CircleProgress size="xm" /> : props.children}

        </button>
    )
}

export default Button;

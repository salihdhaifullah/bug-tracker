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
    buttonProps?: HTMLProps<HTMLButtonElement> & { type?: "button" | "submit" | "reset" }
    size?: Size
}

const ButtonBase = (props: IButtonProps) => {
    return (
        <button
            {...props.buttonProps}
            disabled={props.isLoading}
            onClick={props.onClick}
            className={`${getSize(props.size)}
                ${(props.isLoading ? "cursor-wait" : "cursor-pointer")}
                ${props.className || ""} border-0 outline-none whitespace-nowrap text-center
            `}>
            {props.isLoading ? <CircleProgress size="xm" /> : props.children}
        </button>
    )
}

export default ButtonBase

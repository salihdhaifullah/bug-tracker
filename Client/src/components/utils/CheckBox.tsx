import { IconType } from "react-icons";

export interface ICheckboxOption {
    name: string
    description?: string
    icon?: IconType
}

interface ICheckBoxProps {
    options: ICheckboxOption[]
    state: string;
    setState: (str: string) => void;
}

const CheckBox = (props: ICheckBoxProps) => {

    return (
        <fieldset className="flex flex-col gap-2 w-full px-6 my-4">
            {props.options.map((item, index) => (
                <div key={index} className="flex flex-row gap-2 items-center">
                    <input className="w-4 h-4 cursor-pointer"
                            type="radio"
                            id={item.name}
                            value={item.name}
                            checked={item.name === props.state}
                            onChange={() => props.setState(item.name)}
                        />
                    {item?.icon && <item.icon className="text-2xl text-gray-800 dark:text-gray-200 font-extrabold"/>}
                    <div className="flex flex-col gap-1">
                        <p className="text-base text-primary dark:text-secondary font-bold">{item.name}</p>
                        {item?.description && <label htmlFor={item.name} className="text-sm text-gray-600 dark:text-gray-300 font-light">{item.description}</label>}
                    </div>
                </div>
            ))}
        </fieldset>
    )
}

export default CheckBox

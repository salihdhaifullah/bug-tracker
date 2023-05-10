import NewId from "../../utils/NewId";

interface TextFiledProps {
    type: React.HTMLInputTypeAttribute | undefined
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    value: string | undefined
    label: string
}

const TextFiled = (props: TextFiledProps) => {
    const Id = NewId();

    return (
        <div>
            <label htmlFor={Id}>{props.label}</label>
            <input
                id={Id}
                type={props?.type}
                onChange={props?.onChange}
                value={props?.value}
            />
        </div>
    )
}

export default TextFiled;

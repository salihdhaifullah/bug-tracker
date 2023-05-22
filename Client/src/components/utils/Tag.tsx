import { IconType } from "react-icons";

interface ITagProps {
    name: string;
    icon?: IconType;
}

const Tag = (props: ITagProps) => {
  return (
    <div className="px-2 flex flex-row justify-center items-center text-center text-primary border border-secondary hover:bg-slate-200 bg-slate-100 rounded-xl">
        <p>{props.name}</p>
        {props?.icon && <props.icon />}
    </div>
  )
}

export default Tag

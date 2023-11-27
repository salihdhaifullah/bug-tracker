interface ITagProps {
  name: string;
}

const Tag = (props: ITagProps) => {
  return (
    <div className="px-2 shadow-md text-center text-primary border border-secondary hover:bg-slate-300 bg-slate-100 rounded-xl">
      <p>{props.name}</p>
    </div>
  )
}

export default Tag

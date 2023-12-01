interface ITagProps {
  name: string;
}

const Tag = (props: ITagProps) => {
  return (
    <div className="px-2 shadow-md dark:shadow-secondary/40 text-center dark:border-primary dark:text-secondary text-primary border border-secondary hover:bg-slate-300 bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-900 rounded-xl">
      <p>{props.name}</p>
    </div>
  )
}

export default Tag

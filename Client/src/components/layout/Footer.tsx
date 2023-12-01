const Footer = () => {
  return (
    <footer className="flex flex-row fixed bottom-0 w-full min-h-[6vh] text-primary dark:text-secondary bg-white dark:bg-black p-2 shadow-xl dark:shadow-secondary/40">&copy; {new Date().getFullYear()} - Buegee</footer>
  )
}

export default Footer

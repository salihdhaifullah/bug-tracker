const data = [
    {
        ImageId: 1,
        FirstName: "asvvvvvv",
        LastName: "asvvvvvvv",
        Email: "ADMin@gmail.com"
    },
    {
        ImageId: 2,
        FirstName: "asv",
        LastName: "asvvethtennvvvvv",
        Email: "ADMin@gmail.com"
    },
    {
        ImageId: 3,
        FirstName: "svdsdv",
        LastName: "asvvmtyytvvvvv",
        Email: "developer@gmail.com"
    },
    {
        ImageId: 4,
        FirstName: "dev",
        LastName: "vsav",
        Email: "ADMinREPORTER@gmail.com"
    }
];

const MangeUsers = () => {
    let CurrentPage = 0;
    let Pages = 10;

    const func = () => {
        let current = 0;
        while (current != (Pages + 1)) {
            current++
            if (CurrentPage == current) {
                return (
                    <li>
                        <div className="px-3 py-2 leading-tight border border-gray-300 bg-gray-100 text-gray-700">@i</div>
                    </li>
                )
            } else {
                return (
                    <li>
                        <a href="/mange-users/@i"
                            className="px-3 py-2  leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-slate-200 hover:text-gray-700">@i</a>
                    </li>
                )
            }
        }

    }

    return (
        <section className="w-full p-1 sm:p-6 flex my-4 flex-col gap-4 justify-center items-center">
            <h1 className="text-2xl font-extrabold text-primary">Mange Users</h1>

            <div className="flex flex-col w-full gap-2">
                {data.map((user, index) => (
                    <div
                        key={index}
                        className="flex flex-row w-full p-2 gap-4 border border-gray-400 bg-white rounded-md shadow-lg">
                        <img className="w-20 h-20 object-contain rounded-full" src={`https://api.dicebear.com/6.x/identicon/svg?seed=${user.ImageId}`} alt="avatar" />


                        <div className="flex w-full flex-col break-words justify-center">
                            <div className="flex sm:flex-row flex-wrap flex-col-reverse sm:gap-2">
                                <p className="text-base text-gray-900 font-bold">{user.FirstName}  {user.LastName}</p>

                            </div>
                            <p className="text-sm sm:text-base break-all max-w-fit text-gray-800 font-[400]">{user.Email}</p>
                        </div>

                        <div className="flex flex-col break-keep  items-end justify-center w-full">

                        </div>
                    </div>
                ))}

            </div>

            <nav aria-label="Page navigation example">
                <ul className="flex flex-row w-full  justify-center items-center">
                    <li>
                        {CurrentPage != 1 ? (
                            <a href="/mange-users/@(Model.CurrentPage - 1)"
                            className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-slate-200 hover:text-gray-700">Previous</a>
                        ) : (
                            <div className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg">Previous
                            </div>
                        )}

                    </li>

                    {func()}

                    <li>
                        {CurrentPage != Pages ? (
                            <a href="/mange-users/@(Model.CurrentPage + 1)"
                                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-slate-200 hover:text-gray-700">Next</a>
                        ) : (
                            <div className="px-3 py-2 leading-tight  text-gray-500 bg-white border border-gray-300 rounded-r-lg">Next</div>

                        )}
                    </li>

                </ul>
            </nav>
        </section>
    )
}

export default MangeUsers

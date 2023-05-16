const ChangeRole = () => {
    return (
        <section className="w-full p-1 sm:p-6 flex my-4 flex-col gap-4 justify-center items-center">
            <h1 className="text-2xl font-extrabold text-primary">Change Role</h1>

            <div className="flex flex-col w-full max-w-[500px] gap-4 border border-gray-400 bg-white rounded-md shadow-lg">
                <div className="flex flex-row w-full p-2 gap-4">
                    <img className="w-20 h-20 object-contain rounded-full" src="/files/public/@ViewBag.ImageId" alt="avatar" />

                    <div className="flex w-full flex-col break-words justify-center">
                        <div className="flex sm:flex-row flex-wrap flex-col-reverse sm:gap-2">
                            <p className="text-base text-gray-900 font-bold">@ViewBag.FirstName @ViewBag.LastName</p>
                            <p className="flex flex-row text-sm gap-1">
                                <span className="text-secondary">(</span>
                                <span className="text-primary">@ViewBag.Role</span>
                                <span className="text-secondary">)</span>
                            </p>
                        </div>
                        <p className="text-sm sm:text-base break-all max-w-fit text-gray-800 font-[400]">@ViewBag.Email</p>
                    </div>
                </div>

                <form className="flex flex-row justify-center items-center p-2 px-6 w-full gap-2" method="post" action='/admin/change-role/@ViewBag.Id'>
                    <div className="flex flex-row gap-2 w-full justify-center items-center relative">
                        <label id="select-label"
                            className="text-base absolute bottom-[20%] left-[20%] z-10 font-extralight text-gray-600 transition-all ease-in-out"
                            htmlFor="select">Select New Role</label>

                        <i className="fa-solid fa-id-card-clip text-gray-600 text-base"></i>
                        <div id="select-target" className="flex flex-col w-full relative">
                            <input autoComplete="off"
                                className="p-2 border border-gray-400 h-fit  hover:border-gray-900 focus:outline-secondary rounded-sm w-full"
                                id="select" name="NewRole" value="@Model.NewRole" />
                            <datalist
                                className="absolute w-full shadow-lg max-h-40 top-[100%] bg-white no-scrollbar border rounded-md border-t-0 p-2 overflow-y-scroll">


                                {["PROJECT_MANGER", "REPORTER", "DEVELOPER"].map((role, index) => (
                                    <option
                                        key={index}
                                        className="bg-white hover:bg-slate-200 rounded-md hover:font-extrabold text-gray-600 p-1 mb-1 text-base cursor-pointer"
                                        value={role}>{role}</option>
                                ))}

                            </datalist>

                        </div>

                    </div>
                    <div className="flex flex-col break-keep justify-center w-fit">
                        <button
                            type="submit"
                            className="border-2 bg-secondary border-secondary hover:bg-white hover:opacity-95 hover:shadow-lg text-xs p-2 w-fit text-primary sm:text-ellipsis font-bold rounded-md shadow-md">submit</button>
                    </div>
                </form>
            </div>

        </section>
    )
}

export default ChangeRole

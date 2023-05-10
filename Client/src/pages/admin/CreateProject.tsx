const CreateProject = () => {
    return (
        <section className="flex flex-col justify-center items-center max-w-[100vw] h-auto">
            <div className="rounded-xl bg-white flex flex-col gap-4 w-80 p-2 items-center justify-center shadow-xl">


                <h1 className="text-primary font-bold text-2xl text-center">Create Project</h1>

                <form className="flex-col flex w-full justify-center items-center" action="/admin/create-project" method="post">

                    <div className="flex flex-col justify-center items-center p-2 px-6 w-full gap-2">
                        <div className="flex flex-row gap-2  w-full justify-center items-center relative">
                            <label
                                className="text-base absolute bottom-[20%] left-[20%] font-extralight text-gray-600 transition-all ease-in-out"
                                htmlFor="ProjectName">Project Name</label>
                            <i className="fa-solid fa-user text-gray-600 text-base"></i>
                            <input
                                className="p-2 border border-gray-400 h-fit hover:border-gray-900 focus:outline-secondary rounded-sm w-full"
                                type="text" id="ProjectName" name="ProjectName" />
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center p-2 px-6 w-full gap-2">
                        <div className="flex flex-row gap-2  w-full justify-center items-center relative">
                            <label
                                className="text-base absolute bottom-[20%] left-[20%] font-extralight text-gray-600 transition-all ease-in-out"
                                htmlFor="Description">Description</label>
                            <i className="fa-solid fa-user text-gray-600 text-base"></i>
                            <input
                                className="p-2 border border-gray-400 h-fit hover:border-gray-900 focus:outline-secondary rounded-sm w-full"
                                type="text" id="Description" name="Description" />
                        </div>
                    </div>


                    <div className="flex flex-col justify-center items-center p-2 px-6 w-full gap-2">
                        <div className="flex flex-row gap-2 w-full justify-center items-center relative">

                            <label
                                id="browsers-label"
                                className="text-base absolute bottom-[20%] left-[20%] z-10 font-extralight text-gray-600 transition-all ease-in-out"
                                htmlFor="browsers">Select Browser</label>

                            <i className="fa-solid fa-user text-gray-600 text-base"></i>
                            <div id="select-target" className="flex flex-col w-full relative">
                                <input autoComplete="off"
                                    className="p-2 border border-gray-400 h-fit  hover:border-gray-900 focus:outline-secondary rounded-sm w-full"
                                    id="browsers" name="browsers" />

                                    <datalist id="browsers"
                                        className="absolute w-full shadow-lg max-h-40 top-[100%] bg-white no-scrollbar border rounded-md border-t-0 p-2 overflow-y-scroll">
                                        {["user1", "user2", "user3", "user4"].map((user, index) => (
                                            <option
                                                key={index}
                                                className="bg-white hover:bg-indigo-200 rounded-md hover:font-extrabold text-gray-600 p-1 mb-1 text-base cursor-pointer"
                                                value={user}>{user}</option>
                                        ))}
                                    </datalist>
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button type="submit"
                            className="text-primary bg-secondary text-center p-2 rounded-md border-0 text-base font-bold
           cursor-pointer transition-all  ease-in-out shadow-lg hover:shadow-xl hover:text-lg hover:border-gray-600 hover:text-white">
                            submit
                        </button>
                    </div>

                </form>
            </div>
        </section>
    )
}

export default CreateProject

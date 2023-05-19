import CircleProgress from './CircleProgress'


interface ISubmitButtonProps {
    isValid: boolean;
    isLoading: boolean;
}


const SubmitButton = (props: ISubmitButtonProps) => {
    return (
        <div className="flex justify-center my-2">
            {!props.isValid ? (
                <button disabled
                    className="text-primary w-20 h-10 bg-gray-300 text-center p-2 cursor-not-allowed rounded-md border-0 text-base font-bold shadow-md">
                    submit
                </button>
            ) : (
                <button type="submit"
                    disabled={props.isLoading}
                    className={`text-primary w-20 h-10 bg-secondary flex justify-center items-center text-center p-2 rounded-md border-0 text-base font-bold ${props.isLoading ? "cursor-wait" : "cursor-pointer"} transition-all  ease-in-out shadow-lg hover:shadow-xl hover:border-gray-600 hover:text-white`}>
                    {props.isLoading ? <CircleProgress size="md" /> : "submit"}
                </button>
            )}
        </div>
    )
}

export default SubmitButton

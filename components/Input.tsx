import type { UseFormRegisterReturn } from "react-hook-form"

interface InputProps {
    label : string,
    name : string,
    type : string,
    kind? : "text" | "phone" | "price",
    register : UseFormRegisterReturn,
    required : boolean
    
}
const Input = (
        {label, name, type, kind="text", register, required} : InputProps
    ) => {



    return (
        <div>
            <label
                className=""
            >
                {label}
            </label>
            {
                kind==='text' ? (
                <div className="flex">
                    <input 
                        id={name}
                        type={type}
                        {...register}
                        required={required}
                        className="border-2 p-2 flex-1 rounded-md"
                    />
                </div>
                ) : null
            }
            {
                kind==='phone' ? (
                <div className="flex">
                    <span
                        className="border-l-2 border-y-2 p-2 rounded-l-md bg-slate-50 text-slate-500"
                    >
                        +82
                    </span>
                    <input 
                        id={name}
                        type={type}
                        {...register}
                        required={required}
                        className="border-2 p-2 flex-1 rounded-r-md"
                    />
                </div>
                ) : null
            }
            {
                kind==='price' ? (
                <div className="">
                    <input 
                        id={name}
                        type={type}
                        {...register}
                        required={required}
                        className=""
                    />
                </div>
                ) : null
            }
        </div>
    )
}


export default Input
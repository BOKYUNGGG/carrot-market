import Input from "components/Input";
import type { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@libs/client/useMutation";


interface EnterForm {
    email? : string,
    phone? : string
}
interface ConfirmForm {
    token : string
}
interface MutationResult {
    ok : boolean,
}
const Enter : NextPage = () => {
    const [enter, 
        {
            loading : enterLoading, 
            data : enterData, 
            error : enterError
        }
    ] = useMutation<MutationResult>('/api/users/enter')
    const [confirm, 
        {
            loading: confirmLoading,
            data : confirmData, 
            error : confirmError
        }
    ] = useMutation<MutationResult>('/api/users/confirm')
    const {
        register : enterRegister, 
        reset : enterReset,
        handleSubmit : enterHandleSubmit
    } = useForm<EnterForm>()
    const {
        register : confirmRegister, 
        reset : confirmReset, 
        handleSubmit : confirmHandleSubmit
    } = useForm<ConfirmForm>()
    const [method, setMethod] = useState<"email" | "phone">('email')
    const onEmailClick = () => {
        enterReset()
        setMethod("email")
    }
    const onPhoneClick = () => {
        enterReset()
        setMethod("phone")
    }
    const onEnterValid = (validForm : EnterForm) => {
        if(enterLoading) return
        enter(validForm)
    }
    const onConfirmValid = (validForm : ConfirmForm) => {
        if(confirmLoading) return
        confirm(validForm)
    }
    return(  
        <div className="flex justify-center">
            <div className="flex flex-col px-10 pt-24 w-1/2 gap-4">
                <h3 className="text-3xl font-bold text-center">Enter to Carrot</h3>
                {
                    enterData?.ok ? (
                        <>
                            <div className="">
                                <form 
                                    onSubmit={confirmHandleSubmit(onConfirmValid)}
                                    className="flex flex-col"
                                >
                                    <Input 
                                        register={confirmRegister('token', {required : true})}
                                        name="token"
                                        label="Confirmation Token"
                                        type='number'
                                        required
                                    />        
                                    <input 
                                        value={enterLoading ? "Loading" : "Confirm Token"}
                                        type='submit' 
                                        className="bg-orange-500 text-white rounded-md" 
                                    />
                                </form>
                            </div>
                        </>    
                    ) : 
                    (
                        <>
                            <div className="font-bold text-center text-slate-400">Enter Using :</div>
                            <div className="flex text-slate-400">
                                <span 
                                    className="w-1/2 text-center border-b-2 hover:border-orange-400 hover:text-orange-400"
                                    onClick={onEmailClick}
                                >Email</span>
                                <span 
                                    className="w-1/2 text-center border-b-2 hover:border-orange-400 hover:text-orange-400"
                                    onClick={onPhoneClick}
                                >Phone</span>
                            </div>
                            <div className="">
                                <form 
                                    onSubmit={enterHandleSubmit(onEnterValid)}
                                    className="flex flex-col"
                                >
                                    {
                                        method === 'email' ? (
                                            <Input 
                                                register={enterRegister('email', {required : true})}
                                                name="email"
                                                kind='text'
                                                label="Email address"
                                                type='email'
                                                required
                                            />
                                        ) : null
                                    }
                                    {
                                        method === 'phone' ? (
                                            <Input 
                                                register={enterRegister('phone', {required : true})}
                                                name="phone"
                                                kind="phone"
                                                label="Phone number"
                                                type='text'
                                                required
                                            />
                                        ) : null
                                    }
                                    {
                                        method === 'email' ? (
                                            <input 
                                                value={enterLoading ? "Loading" : "Get Login link"}
                                                type='submit' 
                                                className="bg-orange-500 text-white rounded-md" 
                                            />
                                        ) : null
                                    }
                                    {
                                        method === 'phone' ? (
                                            <input 
                                                value={enterLoading ? "Loading" : "Get one-time password"}
                                                type='submit' 
                                                className="bg-orange-500 text-white rounded-md" 
                                            />
                                        ) : null
                                    }
                                </form>
                            </div>
                        </>    
                    )
                }
                <div className="text-center text-slate-400">Or enter with</div>
                <div className="flex gap-2">
                    <div className="w-1/2 text-center border-2 rounded-md">Twitter</div>
                    <div className="w-1/2 text-center border-2 rounded-md">GitHub</div>
                </div>
            </div>
        </div>
    )

}


export default Enter
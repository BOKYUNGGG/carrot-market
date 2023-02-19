import { useState } from "react"

type UseMutationResult<T> = [
    (data : any)=>void, 
    UseMutationState<T>
]
interface UseMutationState<T> {
    loading : boolean, 
    data?: T,
    error : undefined | any
}
/**
 * aka. react-query + database mutation
 * function will be returned is for POST fetching data to the Back End
 * and mutate the database?
 * @param url 
 * @returns 
 */
const useMutation = <T = any>(url : string) : UseMutationResult<T>=> {
    const [state, setState] = useState<UseMutationState<T>>({
        loading : false,
        data : undefined,
        error : undefined
    })
    function mutation(data: any) {
        setState(prev => ({
            ...prev, loading : true
        }))
        fetch(url, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data)
        })
        .then((response)=> response.json().catch(()=> {}))
        .then( data => setState(prev => ({...prev, data})))
        .catch( error => setState(prev => ({...prev, error})))
        .finally(()=> setState(prev => ({...prev, loading : false})))
    }
 

    return [mutation, {...state}]
}



export {useMutation}


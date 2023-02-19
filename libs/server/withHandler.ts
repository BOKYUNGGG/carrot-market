import { NextApiRequest, NextApiResponse } from "next";
export interface ResponseType {
    ok : boolean,
    [key: string] : any,
}
export default function withHandler(
    methods : "GET" | "POST" | "DELETE",
    handler : (req: NextApiRequest, res: NextApiResponse) => Promise<any>
){


    return async function (req : NextApiRequest, res : NextApiResponse) {
        // 
        if(req.method !== methods){
            return res.status(405).end()
        }
        // 
        try{
            await handler(req, res)
        }
        //
        catch(error){
            console.error(error)
            return res.status(500).json({error})
        }
    }
}
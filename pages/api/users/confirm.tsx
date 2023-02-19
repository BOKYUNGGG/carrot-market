import {withIronSessionApiRoute} from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from "next";
import client from '@libs/server/prisma-client'
import type { ResponseType } from "@libs/server/withHandler";
import withHandler from "@libs/server/withHandler";

declare module "iron-session"{
    interface IronSessionData { 
        user? : {
            id : number
        }
    }
}

async function handler(
    req : NextApiRequest, 
    res : NextApiResponse<ResponseType> 
){
    const { token } = req.body
    console.log("Token of Request's body : ",token)

    const tokenExists = await client.token.findUnique({
        where : {
            payload : token
        }
    })
    if(!tokenExists) {
        return res.status(404).end()
    }

    console.log("Token Exists : ",tokenExists)
    req.session.user = {
        id : tokenExists.id
    }
    console.log("Session of Request : ", req.session)
    
    // maybe it doesn't work...
    await req.session.save().catch(error=>console.log("Save Error :",error))
    res.status(200).end()
}
export default withIronSessionApiRoute(withHandler("POST", handler), {
    cookieName : "carrot-session",
    password : "9845904809485098594385093840598df;slkgjfdl;gkfsdjg;ldfksjgdsflgjdfklgjdflgjflkgjdgd"
})
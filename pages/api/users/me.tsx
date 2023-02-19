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
    
    console.log("User in Session is : ",req.session)
    res.json({
        ok: true,
        
    })
    
}

export default withIronSessionApiRoute(withHandler("GET", handler),{
    cookieName : 'carrot-session',
    password : "asddasdasdadasdasdasadsdasdasdasasdfdsfdsfdsdfsdsdsadsaadsadsdasadsadsadsdasadsdasdas",
    cookieOptions : {
        httpOnly : false,
        secure : false
    }
})
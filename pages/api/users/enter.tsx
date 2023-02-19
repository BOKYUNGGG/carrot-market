import mail from '@sendgrid/mail';
import twilio from 'twilio'
import { NextApiRequest, NextApiResponse } from "next";
import client from '@libs/server/prisma-client'
import type { ResponseType } from "@libs/server/withHandler";
import withHandler from "@libs/server/withHandler";

mail.setApiKey(process.env.SENGRID_API_KEY!)
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

async function handler(
    req : NextApiRequest, 
    res : NextApiResponse<ResponseType>
){
    const { phone, email } = req.body
    /* version 1 : upsert()
    let user
    if(email){
        // 이메일 중복 확인
        user = await client.user.findUnique({
            where : {
                email : email
            }
        })
        // 중복 이메일이 없으면 유저 생성
        if(!user){
            console.log('중복 이메일 검사 통과 -> 유저 생성 중')
            user = await client.user.create({
                data : {
                    name : "Anonymous",
                    email : email,
                }
            })
        }
        if(user) {
            console.log("중복된 이메일 입력")
        }
    } // if(email)
    if(phone){
        // 번호 중복 확인
        user = await client.user.findUnique({
            where : {
                phone : +phone
            }
        })
        // 중복 번호가 없으면 유저 생성
        if(!user){
            console.log('중복 번호 검사 통과 -> 유저 생성 중')
            user = await client.user.create({
                data : {
                    name : "Anonymous",
                    phone : +phone,
                }
            })
        }
        if(user) {
            console.log("중복된 번호 입력")
        }
        console.log(user)
    } // if(email)
    */
    /* version 2 : upsert()
    let user
    if(email){
        user = await client.user.upsert({
            where : {
                email : email
            },
            create : {
                name : "Annonymous",
                email : email
            },
            update : {
    
            }
        })
    }
    if(phone){
        user = await client.user.upsert({
            where : {
                phone : +phone
            },
            create : {
                name : "Annonymous",
                phone : +phone
            },
            update : {
    
            }
        })
    }
    */
    /* version 3 : upsert()
    const user = await client.user.upsert({
        where : {
            ...(phone ? {phone : +phone } : {}),
            ...(email ? {email : email } : {}),
        },
        create : {
            name : "Annoymous",
            ...(phone ? {phone : +phone } : {}),
            ...(email ? {email : email } : {}),
        },
        update : {

        }
    })
    */
    /* version 4 : upsert()
    const payload = phone ? {phone : +phone} : {email : email}
    const user = await client.user.upsert({
        where : {
            ...payload
        },
        create : {
            name : "Annoymous",
            ...payload
        },
        update : {

        }
    })
    const token = await client.token.create({
        data : {
            payload : "12345",
            user : {
                connect : {
                    id : user.id
                }
            }
        }
    })
    */
    // version 5 : upsert()
    const user = phone ? {phone : +phone} : email ? {email : email} : null
    if(!user) return res.status(400).json({ok : false})
    const payload = Math.floor(100000 + Math.random() * 900000) + ""
    const token = await client.token.create({
        data : {
            payload : payload,
            user : {
                connectOrCreate : {
                    where : {
                        ...user
                    },
                    create : {
                        name : "Annoymous",
                        ...user
                    },
                }
            }
        }
    })
    if(phone){
        const message = await twilioClient.messages.create({
            messagingServiceSid : process.env.TWILIO_MSID,
            to : process.env.MY_PHONE!,
            body : `Your login Token is ${payload}`
        })
        console.log(message)
    }
    if(email){
        const email = await mail.send({
            from : "kyung8728@gmail.com",
            to : "kyung8728@gmail.com",
            subject : "Your Carrot Market verification email",
            text : `Your token is ${payload}`,
            html : `<strong>Your token is ${payload}</strong>`
        })
        console.log(email)
    }
    return res.json({
        ok:true,
    })
}

export default withHandler("POST", handler)
require('dotenv').config()
import express, { Request, Response, urlencoded } from "express";
import axios from "axios";
import url from 'url'
const PORT = process.env.PORT || 3001
const app = express()


let accessToken = ' '
let refreshToken = ''

app.get('/api/auth/discord/redirect', async (req: Request, res: Response) => {
    console.log(req.query)
    const { code } = req.query
    if (code) {
        try {
            const formData = new url.URLSearchParams({
                client_id: '1068827377305649202',
                client_secret: '6hM-LenYUerC2saajvuo7-ZZOI_cDRi8',
                grant_type: 'authorization_code',
                code: code.toString(),
                redirect_uri: 'http://localhost:3001/api/auth/discord/redirect'
            })
            const response = await axios.post('https://discord.com/api/v10/oauth2/token', 
            formData.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            )
            const { access_token, refresh_token } = response.data;
            accessToken = access_token
            refreshToken = refresh_token 
            res.send(200)
        } catch (e) {
            console.log(e)
            res.sendStatus(400)
        }
    }

})

app.get('/api/auth/user',async  (req: Request,res: Response) => {
    try { 
        const response = await axios.get('https://discord.com/api/v10/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        res.send(response.data)
    } catch(e){
        console.log(e)
        res.sendStatus(400)
    }
})

app.listen(PORT, () => {
    console.log('Succeseful connection')
})
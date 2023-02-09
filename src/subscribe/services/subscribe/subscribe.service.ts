import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateSubscriberDto } from 'src/subscribe/dtos/CreateSubscriber.dto';

@Injectable()
export class SubscribeService {
    

    async getToken(){

        var getTokenData = {
            "EmailAddress": process.env.ACCOUNT_EMAIL,
            "Password": process.env.ACCOUNT_PASSWORD
        };

        await axios.post(
            "https://useapi.useinbox.com/token",
            getTokenData,
            {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(async (res) => {
                var { access_token, token_type, refresh_token } = await res.data.resultObject;
                console.log("acces Token: " + typeof(access_token) + "\n pyld:");
                
                return await access_token;
            })
            .catch((err) => {
                console.log(err);
                return err;
            });

    }

    async saveSubscriber(createSubscriberDetails: CreateSubscriberDto) {
        // console.log("service mail:" + createSubscriberDetails.email);
        // console.log("ad:" + createSubscriberDetails.name);
        // console.log("soyad:" + createSubscriberDetails.surname);
        
        var postContactData = {
            "email": createSubscriberDetails.email,
            "customFields": 
            [
                {
                    "customFieldId": process.env.CUSTOM_FIELD_AD,
                    "value": createSubscriberDetails.name
                },
                {
                    "customFieldId": process.env.CUSTOM_FIELD_SOYAD,
                    "value": createSubscriberDetails.surname
                }
            ]
        };
        console.log("data:",postContactData);

        const access_token = await this.getToken();
        console.log(access_token);
        return await axios.post(
            "https://useapi.useinbox.com/inbox/v1/contactlists/" + process.env.LIST_ID + "/add",
            postContactData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + access_token,
                }
            })
            .then((res) => {
                //console.log(res.data);
                return res.data;
            })
            .catch((err) => {
                console.log(err);
                return err;
            });


    }


}

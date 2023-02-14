import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateSubscriberDto } from 'src/subscribe/dtos/CreateSubscriber.dto';

@Injectable()
export class SubscribeService {

    async getToken() {

        var getTokenData = {
            "EmailAddress": process.env.ACCOUNT_EMAIL,
            "Password": process.env.ACCOUNT_PASSWORD
        };

        return await axios.post(
            "https://useapi.useinbox.com/token",
            getTokenData,
            {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(async (res) => {
                var { access_token, token_type, refresh_token } = await res.data.resultObject;
                return access_token;
            })
            .catch((err) => {
                console.log(err);
                return err;
            });

    }

    async postReqToSubscribeUIBX(access_token: string, email: string, name: string, surname: string) {

        var postContactData = {
            "email": email,
            "customFields": [
                {
                    "customFieldId": process.env.CUSTOM_FIELD_AD,
                    "value": name
                },
                {
                    "customFieldId": process.env.CUSTOM_FIELD_SOYAD,
                    "value": surname
                }
            ]
        };
        
        return await axios.post(
            `https://useapi.useinbox.com/inbox/v1/contactlists/${process.env.LIST_ID}/add`,
            postContactData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + access_token,
                }
            })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err;
            });
    }

    async postReqToSubscribeMCP(email: string, name: string, surname: string) {
        var postContactData = {
            members: [
                {
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: name,
                        LNAME: surname
                    }
                }
            ]
        };

        await axios.post(
            `https://us8.api.mailchimp.com/3.0/lists/+${process.env.MCP_LIST_ID}`,
            postContactData,
            {
                headers: {
                    Authorization: "auth " + process.env.MCP_API_KEY,
                }
            })
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err;
            });
    }

    //(, options)
    async saveSubscriberUIBX(createSubscriberDetails: CreateSubscriberDto) {
        const access_token = await this.getToken();
        return await this.postReqToSubscribeUIBX(access_token,
            createSubscriberDetails.email,
            createSubscriberDetails.name,
            createSubscriberDetails.surname
        );
    }

    async saveSubscriberMCP(createSubscriberDetails: CreateSubscriberDto) {
        return await this.postReqToSubscribeMCP(
            createSubscriberDetails.email,
            createSubscriberDetails.name,
            createSubscriberDetails.surname
        );
    }
}

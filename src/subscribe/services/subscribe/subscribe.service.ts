import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SubscribeService {

    saveSubscriber(email: string) {
        console.log("service mail:"+email);
        var postContactData = JSON.stringify({
            "email": email,
            "customFields": []
        });

        var getTokenData = {
            "EmailAddress": process.env.ACCOUNT_EMAIL,
            "Password": process.env.ACCOUNT_PASSWORD
        };

        axios.post(
            "https://useapi.useinbox.com/token",
            getTokenData,
            {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((res) => {
                var { access_token, token_type, refresh_token } = res.data.resultObject;
                console.log("acces Token: " + access_token);



                axios.post(
                    "https://useapi.useinbox.com/inbox/v1/contactlists/" + process.env.LIST_ID + "/add",
                    postContactData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token_type + " " + access_token,
                        },
                    })
                    .then((res) => {
                        console.log(res.data)
                    })
                    .catch((err) => {
                        console.log(err)
                    });


            })
            .catch((err) => {
                console.log(err);
            });
    }


}

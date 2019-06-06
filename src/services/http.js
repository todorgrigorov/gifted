import axios from "axios";
import logger from './logger';
import apiRoutes from "../config/api-routes";

const instance = axios.create({
    baseURL: apiRoutes.ADDRESS,
});

export default {
    async request(url, verb = 'GET', body = null) {
        verb = verb || 'GET';
        body = body || null;

        logger.log(`fetching ${url} via ${verb}`);
        if (body) {
            logger.logObject(body);
        }

        let response = {};
        try {
            response = await instance.request({
                method: verb,
                url,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: body ? JSON.stringify(body) : null
            });
        } catch (error) {
            response = error;
        }
        logger.logObject(response);

        return {
            isNotValid: response.status === 400,
            isNotFound: response.status === 404,
            isError: response.status === 500,
            isForbidden: response.status === 403,
            isCreated: response.status === 201,
            isOkay: response.status === 200,
            status: response.status,
            data: response.data
        };
    }
}
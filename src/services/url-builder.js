export default {
    build(baseUrl, queryParameters = {}, urlParameters = []) {
        let url = baseUrl + '/';

        if (urlParameters) {
            let params = '';
            for (const param of urlParameters) {
                params += `${param}/`;
            }
            url += params;
        }

        if (queryParameters) {
            while (url.endsWith('/')) {
                url = url.substr(0, url.length - 1);
            }

            url = `${url}?` + Object.keys(queryParameters).map(function (key) {
                return [key, queryParameters[key]].map(encodeURIComponent).join("=");
            }).join("&");
        }

        return url;
    }
}
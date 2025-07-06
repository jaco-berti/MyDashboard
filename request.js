export class ApiRequest
{
    static async get(url)
    {
        let ret = null;

        await fetch(url)
        .then(res => {
            ret = res.json()
        })
        .catch(error => console.error(error));

        return ret;
    }

    static async post(data, url)
    {
        let ret = null;

        console.log(data);

        await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        })
        .then(res => res.json())
        .then(data => {
            ret = data;
        })
        .catch(error => console.error(error));

        return ret;
    }
}
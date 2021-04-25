# Merkoa (We are shit at naming things)

Middleware for mercuri's communication with various backend services.

## Usage

### Installation and starting the server

1. Make sure that the required services are running. Eg. Start caduceus server before starting this.

2. Install dependencies

```
npm install
```

3. Start the server

```
npm start
```

or in development mode

```
npm run dev
```

### Sending requests

There is **only one request endpoint per service.**
The request endpoint follows this nomenclature - `/<api version>/<service name>/`
**All requests are post requests** with the following request body 

```
{
    "request": {
        "method": <get/post/put/delete>,
        "endpoint": <API endpoint for the corresponding service>,
        "payload": <optional payload for post and put requests>
    }
}

```

### Example

1. Sending a POST request to caduceus to add a node

Send a POST request to endpoint `localhost:3000/api/v1/caduceus/` with payload

```
{
    "request": {
        "method": "post",
        "endpoint": "nodes/",
        "payload": {}
    }
}
```

The response is the response returned by the caduceus service

```
{
    "response": {
        "id": "eb1ea002452148cc96b51a9221099ec5",
        "container_id": "63ffbfa06ed739533af2a1928fdd6c70deb04374ced834e7db93f4b1a1dd5acf"
    }
}
```

2. Sending a GET request to get information about created node.

Send a POST request to endpoint `localhost:3000/api/v1/caduceus/` with payload
(node id from request above)

```
{
    "request": {
        "method": "get",
        "endpoint": "nodes/eb1ea002452148cc96b51a9221099ec5"
    }
}
```

The response will look like

```
{
    "response": [
        {
            "id": "eb1ea002452148cc96b51a9221099ec5",
            "input": null,
            "output": null,
            "docker_img_name": null,
            "container": {
                "container_id": "63ffbfa06ed739533af2a1928fdd6c70deb04374ced834e7db93f4b1a1dd5acf",
                "container_state": {
                    "Status": "running",
                    "Running": true,
                    "Paused": false,
                    "Restarting": false,
                    "OOMKilled": false,
                    "Dead": false,
                    "Pid": 1465,
                    "ExitCode": 0,
                    "Error": "",
                    "StartedAt": "2021-04-25T16:03:23.990375746Z",
                    "FinishedAt": "0001-01-01T00:00:00Z"
                }
            }
        }
    ]
}

```
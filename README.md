# Mercury Gateway

Middleware for mercury's communication with various backend services.

## Usage

### Installation and starting the server

1. Make sure that the required services are running. Eg. Start orchestration service before starting this.

2. Install dependencies

   ```bash
   npm install
   ```

3. Specify paths to orchetration and workspace service repositories in `config/defaults.json`

   ```
    {
        "orchestration": {
            "dir": <path of orchestration repo>,
            "port": "8888"
        },
        "workspace": {
            "dir": <path of workspace repo>,
            "port": "4000"
        }
    }
   ```

4. Start the server

   ```bash
   npm start
   ```

   or in development mode

   ```bash
   npm run dev
   ```

### Sending requests

The base endpoint for each request to a service follows this nomenclature: `/<api_version>/<service_name>/`.

Example of sending a post request to orchestration service to add a node:

```http
POST /v1/orchestration/nodes
Content-Type: application/json
Accept: application/json
```

To the above request, we can expect a response of the form:

```json
{
    "response": {
        "id": "5ac2801fa37f424c8c17ed4619f9fdc0",
        "container_id": "bbe0b0734351660bb58badbcefebaca21d8c9ab4ce0a6bcf6db86e67921a19dd",
        "notebook_url": "http://localhost:8888/notebooks/Untitled.ipynb?kernel_name=python3"
    }
}
```

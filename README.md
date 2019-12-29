English/[日本語](README_ja.md)

# Amidz

A knitting chart editor.

<img src="imgs/logo.svg" width="256"></img>

## Prototype Application

The GitHub Page of this repository delivers a [prototype application](https://kikuomax.github.io/amidz/).
The prototype application is a Progressive Web App (PWA).

### Locally testing the prototype application

The prototype application can be locally tested.
The [`/docs/pwa`](/docs/pwa) folder contains a JavsScript that starts a server that delivers the prototype application on `localhost:8000`.

Please take the following steps to start the server.

1. Move down to [`docs/pwa`](/docs/pwa).

    ```
    cd docs/pwa
    ```

2. Install necessary modules.

    ```
    npm install
    ```

3. Start the service.

    ```
    npm start
    ```

4. A server will start waiting for requests at http://localhost:8000/.
   It will show a screen similar to the following,

   ![Sample Screen](imgs/sample-screen.png)
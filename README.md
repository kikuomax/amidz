English/[日本語](README_ja.md)

# Amidz

A knitting and crochet pattern editor.

<img src="imgs/logo.svg" width="256"></img>

## Prototype Application

The GitHub Page of this repository delivers a [prototype application](https://kikuomax.github.io/amidz/).
The prototype application is a Progressive Web App (PWA).

### Usage scenarios

Please refer to [scenarios.md](scenarios.md).

### Locally testing the prototype application

The prototype application can be locally tested.
The [`/docs/pwa`](/docs/pwa) folder contains a JavsScript that starts a server that delivers the prototype application on `localhost:8000`.

Please take the following steps to start the server.

1. Move down to [`docs/pwa`](/docs/pwa).

    ```
    cd docs/pwa
    ```

2. Install necessary modules (first time only).

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

### Deploying a prototype application

The [`docs/pwa/www`](/docs/pwa/www) directory contains the latest prototype application files.
Those files can be built from the source files in the [`src`](/src) directory with [Webpack](https://webpack.js.org).
If you want to build a new application from the source files and deploy it, please take the following steps,

1. Suppose you are in the root directory of your copy of this repository.

2. Install necessary modules (first time only).

    ```
    npm install
    ```

3. Build an application.

    ```
    npm run build
    ```

4. You will find application files in a `dist` directory.

5. Replace the contents of the [`docs/pwa/www`](/docs/pwa/www) direcotry with those of the `dist` directory.

    ```
    rm -rf docs/pwa/www
    cp -r dist docs/pwa/www
    ```

Now you can run your application as described in the section [Locally testing the prototype application](#locally-testing-the-prototype-application).

### Debugging a prototype application

Before deploying your application, you should want to debug it.
Copying artifacts to the [`docs/pwa/www`](/docs/pwa/www) directory every time you build an application is cumbersome, so you can use a [Wabpack Dev Server](https://webpack.js.org/configuration/dev-server/) during you debug your application.
To start a Webpack Dev Server, please take the following steps,

1. Suppose you are in the root directory of your copy of this repository.

2. Install necessary modules (first time only).

    ```
    npm install
    ```

3. Start a Webpack Dev Server.

    ```
    npm run dev
    ```

4. Your default browser will open http://localhost:8080.

As a Webpack Dev Server monitors changes on source files and will automatically reload a rebuilt application, you do not need to manually reload the application when you edit a source file.

### Unit testing

Unit testing of Amidz is backed by the following packages,
- [Mochapack](https://github.com/sysgears/mochapack) as a test runner
- [Chai](https://www.chaijs.com) as an assertion library
- [Sinon](https://sinonjs.org) for spying
- [Vue Test Utils](https://vue-test-utils.vuejs.org) for testing Vue components

To run unit tests, please take the following steps,

1. Suppose you are in the root directory of your copy of this repository.

2. Install necessary modules (first time only).

    ```
    npm install
    ```

3. Run unit tests.

    ```
    npm test
    ```

4. You will see test results printed on the console.

You can run tests in the [watch mode](https://github.com/sysgears/mochapack#watch-mode---watch) by specifying `-- --watch` at the step 3.

```
npm test -- --watch
```

### Generating documentation of the code

The source code of Amidz is documented with [JSDoc](https://github.com/jsdoc/jsdoc) + the [jsdoc-vuejs](https://github.com/Kocal/jsdoc-vuejs) plugin.
If you want to generate documentation of the code, please take the following steps,

1. Suppose you are in the root directory of your copy of this repository.

2. Install necessary modules (first time only).

    ```
    npm install
    ```

3. Run JSDoc.

    ```
    npm run build:doc
    ```

4. You will find documentation in an `api-doc` directory.
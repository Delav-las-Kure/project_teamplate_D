# Introduction
TODO: Project template.

# Getting Started
1.	Installation process
2.	Working with ``webpack``
3.  Features

# 1. Installation process
```
$ git clone https://miralab.visualstudio.com/project%20template%20W/_git/project%20template%20W
```
Dependency Installation:
```
$ npm i
```

# 2. Working with webpack
**Build project**
-----------------------------------
***
Build command:
```
$ npm run build
```
**Dev mode**
-----------------------------------
***
Run ``dev`` mode:
```
$ npm run serve
```
# 3. Features
1.  Embedded images and files in `` pug``.
    1.  Load ``img``:
        ```
        img(src=require("./img/logo.png").default, alt="")
        ```
    2.   Load as ``background-image``:
            ```
            div(style="background-image: url(" + require('./img/logo.png').default + ")")
            ```
2.  External modules.
    1.  All external scripts can be installed via `` npm i`` and connected already at the place of requirement, for example
        ```
        import * as $ from "jquery";
        ```

3.  To connect global styles and scripts, use `` import`` in the file `` app.js``, for example
    ```
    /**
    * fonts
    */
    import './fonts/OpenSans/stylesheet.css';
    import './fonts/Roboto/stylesheet.css';

    /**
    * main style
    */
    import './scss/main.scss';

    /**
    * script
    */
    import { MainApp } from './ts/main';
    ```
**Dynamic import**
-----------------------------------
***
1.  Dynamic import allows you to load modules as needed, for example
    ```
    /// file: slidebars.js
    export var slidebars = function () {
        //////////any code///////////
    }

    /// file: navigation.js
    import(/* webpackChunkName: "slidebars" */"../lib/js/slidebars.js").then((importStatement: any) => {
        controller = new importStatement.slidebars();
        //////////any code///////////
    });
    ```
    Here `` webpackChunkName`` sets the name of the output file for `` slidebars.js``. In this case, the output file will be `` dist / lib / chunk-slidebars.js``.

2.  Modules can also be loaded in advance, so that the module has already been loaded during code execution.
    ```
    import(/* webpackPrefetch: true, webpackChunkName: "slidebar" */"../lib/js/slidebars.js");
    ```
    In this case, the module itself will be connected to the `` head`` as a separate tag.
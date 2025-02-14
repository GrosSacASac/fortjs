import {
    View,
    declareView
} from "eshtml";

// you can give any name but make sure its unique among all other views.
@declareView('controller:default,action:default')
export class DefaultView extends View {
    async render() {
        return `<!doctype html>
        <html>
        <head>
        <title>FortJs</title>
        </head>
        <body>
        <div class="text-center" style="margin-top:50px;">
        <img src="/static/fort_js_logo_200_137.png"/>
        <span class="app-name">FortJs</span>
        </div>
        <div class="text-center">
        Congrats ! You Own A Fort Now.
        </div>
        <div class="text-center" style="margin-top:50px;font-size:40px;">
        Fill up your fort with <a target="_blank" href="http://fortjs.info/tutorial/guard/">guards</a>, 
        <a target="_blank" href="http://fortjs.info/tutorial/shield/">shields</a> and 
        <a href="http://fortjs.info/tutorial/wall/" target="_blank">walls</a>.
        </div>
        <div>
        <ul>
        <li><i class="fas fa-globe"></i> Docs - http://fortjs.info/ </li>
        <li><i class="fab fa-medium-m"></i> Medium - https://medium.com/fortjs</li>
        </ul>
        </div>
        <style>
        body{
            background-color:#000000;
            color:white;
        }
        .text-center{
            text-align:center;
        }
        .app-name{
            font-size:200px;
        }
        a{
            color:#8fff35;
        }
        ul{
            margin-top:100px;
            font-size:30px;
            text-align:center;
            padding-left:30%;
        }
        ul li {
            text-align:left;
            padding-top:20px;   
        }
        </style>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossorigin="anonymous">
        </body>
        </html>
        `;
    }
}
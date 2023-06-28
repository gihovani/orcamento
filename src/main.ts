import {App} from "./telas/app";
import {BarraDeNavegacao} from "./telas/barradenavegacao";

new App(
    document.getElementById('app'),
    new BarraDeNavegacao()
);
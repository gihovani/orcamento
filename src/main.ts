import {FormularioLogin} from "./telas/formulariologin";
import {ApiVendedorMock} from "./servicos/apivendedor";
import {App} from "./telas/app";
import {BarraDeNavegacao} from "./telas/barradenavegacao";


const apiVendedor = new ApiVendedorMock();
new App(
    document.getElementById('app'),
    new FormularioLogin(apiVendedor),
    new BarraDeNavegacao()
);
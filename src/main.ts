import {FormularioLogin} from "./telas/formulariologin";
import {ApiVendedorMock} from "./servicos/apivendedor";
import {App} from "./telas/app";
import {BarraDeNavegacao} from "./telas/barradenavegacao";
import {Configuracoes} from "./entidades/configuracoes";


const apiVendedor = new ApiVendedorMock();
const configuracoes = new Configuracoes();
new App(
    document.getElementById('app'),
    configuracoes,
    new FormularioLogin(apiVendedor),
    new BarraDeNavegacao(configuracoes)
);
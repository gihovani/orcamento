import {ApiVendedorMock} from "./servicos/apivendedor";
import {App} from "./telas/app";
import {BarraDeNavegacao} from "./telas/barradenavegacao";
import {Configuracoes} from "./entidades/configuracoes";

const configuracoes = new Configuracoes();
new App(
    document.getElementById('app'),
    configuracoes,
    new BarraDeNavegacao(configuracoes)
);
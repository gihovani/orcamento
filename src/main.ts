import {Carrinho} from "./entidades/carrinho";
import {criarElementoHtml} from "./util/helper";
import {Regrapromocional} from "./entidades/regrapromocional";
import {ApiClienteMock} from "./servicos/apicliente";
import {FormularioCliente} from "./telas/formulariocliente";
import {ListagemDeProdutos} from "./telas/listagemdeprodutos";
import {ApiProduto} from "./servicos/apiproduto";
import {ApiCepViaCep} from "./servicos/apibuscacep";
import {FormularioEndereco} from "./telas/formularioendereco";
import {ListaDeCompras} from "./telas/listadecompras";
import {FormularioLogin} from "./telas/formulariologin";
import {ApiVendedorMock} from "./servicos/apivendedor";
import {Vendedor} from "./entidades/vendedor";

const criaCarrinho = () => {
    const regra10PorcentoDeDescontoProduto = new Regrapromocional(
        '10% de desconto - ACR8615A - Organizador de Gaveta - Preto - ACRIMET',
        1,
        true,
        new Date(2023, 0, 1),
        new Date(2023, 11, 31),
        [{'tipo': 'id', 'operacao': 'igual', 'valor': 'ACR8615A'}],
        {'tipo': 'desconto_porcentagem', 'valor': 10},
    );
    return new Carrinho([regra10PorcentoDeDescontoProduto]);
};

const adicionaMenu = (titulo: string, callback: () => void) => {
    const menu = document.getElementById('navbarSupportedContent').querySelector('ul');
    const a = criarElementoHtml('a', ['nav-link'], [{nome: 'href', valor: '#'}], titulo);
    a.addEventListener('click', callback);
    const li = criarElementoHtml('li', ['nav-item']);
    li.appendChild(a);
    menu.appendChild(li);
};
const app = document.getElementById('app');
const apiVendedor = new ApiVendedorMock();
new FormularioLogin(app, apiVendedor).renderizar();
app.addEventListener('autenticacao', (e: Event) => {
    app.innerHTML = '';
    const carrinho = criaCarrinho();
    const apiCliente = new ApiClienteMock();
    const apiCep = new ApiCepViaCep();
    const apiProduto = new ApiProduto();
    adicionaMenu('Cliente', () => {
        new FormularioCliente(app, apiCliente).renderizar();
    });
    adicionaMenu('Endereço de Entrega', () => {
        new FormularioEndereco(app, apiCep).renderizar();
    });
    adicionaMenu('Lista de Produtos', () => {
        new ListagemDeProdutos(app, apiProduto, carrinho).renderizar();
    });
    adicionaMenu('Carrinho', () => {
        new ListaDeCompras(app, carrinho).renderizar();
    });
});

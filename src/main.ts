import {ListaDeProduto} from "./entidades/listadeproduto";
import {Carrinho} from "./entidades/carrinho";
import {Produto} from "./entidades/produto";
import {
    criarElementoHtml,
    pegaDadosGoogleMerchant,
    pegaTextoDoElementoXml,
    transformaDinheiroEmNumero
} from "./util/helper";
import {HTMLListaDeProduto} from "./telas/listadeprodutos";
import {Regrapromocional} from "./entidades/regrapromocional";
import {ClienteCadastro} from "./entidades/clientecadastro";
import {ApiCepViaCep} from "./servicos/apibuscacep";
import {ApiClienteMock} from "./servicos/apicliente";
import {HTMLCadastroCliente} from "./telas/clientecadastro";

const app = document.getElementById('app');
const adicionaMenu = (titulo: string, callback: () => void) => {
    const menu = document.getElementById('navbarSupportedContent').querySelector('ul');
    const a = criarElementoHtml('a', ['nav-link'], [{nome: 'href', valor: '#'}], titulo);
    a.addEventListener('click', callback);
    const li = criarElementoHtml('li', ['nav-item']);
    li.appendChild(a);
    menu.appendChild(li);
};
adicionaMenu('Cadastro de Cliente', () => {
    const apiCep = new ApiCepViaCep();
    const apiCliente = new ApiClienteMock();
    new HTMLCadastroCliente(
        app,
        new ClienteCadastro(),
        apiCliente,
        apiCep
    ).renderizar();
});
adicionaMenu('Lista de Produtos', () => {
    pegaDadosGoogleMerchant('xml/google.xml', (data) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const listaDeProduto = new ListaDeProduto();
        listaDeProduto.produtos = Array.from(xmlDoc.querySelectorAll('item')).map(item => {
            const price = pegaTextoDoElementoXml(item, 'price');
            const sale_price = pegaTextoDoElementoXml(item, 'sale_price');
            return new Produto(
                pegaTextoDoElementoXml(item, 'id'),
                pegaTextoDoElementoXml(item, 'title'),
                transformaDinheiroEmNumero(price),
                pegaTextoDoElementoXml(item, 'availability') === 'In Stock',
                pegaTextoDoElementoXml(item, 'title'),
                transformaDinheiroEmNumero(sale_price),
                pegaTextoDoElementoXml(item, 'image_link'),
                pegaTextoDoElementoXml(item, 'link'),
                pegaTextoDoElementoXml(item, 'product_type').split(',')[0],
                pegaTextoDoElementoXml(item, 'brand'),
                pegaTextoDoElementoXml(item, 'gtin')
            );
        });
        const regra10PorcentoDeDescontoProduto = new Regrapromocional(
            '10% de desconto - ACR8615A - Organizador de Gaveta - Preto - ACRIMET',
            1,
            true,
            new Date(2023, 0, 1),
            new Date(2023, 11, 31),
            [{'tipo': 'id', 'operacao': 'igual', 'valor': 'ACR8615A'}],
            {'tipo': 'desconto_porcentagem', 'valor': 10},
        );
        const carrinho = new Carrinho([regra10PorcentoDeDescontoProduto]);
        new HTMLListaDeProduto(app, listaDeProduto, carrinho).renderizar();
    });
});
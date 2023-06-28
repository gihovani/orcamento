import {ApiFormasDeEntregaMagento, ApiFormasDeEntregaMock} from "../servicos/apiformasdeentrega";
import {ApiProduto} from "../servicos/apiproduto";
import {Carrinho} from "../entidades/carrinho";
import {ApiConfiguracoes} from "../servicos/apiconfiguracoes";

const apiFormasDeEntregaMagento = new ApiFormasDeEntregaMagento();
const apiFormasDeEntregaMock = new ApiFormasDeEntregaMock();

ApiConfiguracoes.instancia().loja.google_merchant.url = 'xml/test.xml';
const listaDeProduto = new ApiProduto();
const cep = '88106-000';
listaDeProduto.listar().then(produtos => {
    const carrinho = new Carrinho();
    produtos.map(produto => carrinho.adicionarProduto(produto));
    apiFormasDeEntregaMock.consultar(cep, carrinho).then((formas) => {
        console.log(`Calcular Formas de Entrega Mock do Cep ${cep}:`, formas[0].titulo == 'Frete Expresso');
    });
});

listaDeProduto.listar().then(produtos => {
    const carrinho = new Carrinho();
    produtos.map(produto => produto.id != 'ALP11420H' && carrinho.adicionarProduto(produto));
    apiFormasDeEntregaMagento.consultar(cep, carrinho).then((formas) => {
        console.log(`Calcular Formas de Entrega Magento do Cep ${cep}:`, formas[0].titulo == 'Frete Normal');
    });
});

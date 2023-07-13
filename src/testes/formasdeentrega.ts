import {ApiFormasDeEntregaMagento, ApiFormasDeEntregaMock} from "../servicos/apiformasdeentrega";
import {ApiProduto} from "../servicos/apiproduto";
import {Carrinho} from "../entidades/carrinho";
import {ApiConfiguracoes} from "../servicos/apiconfiguracoes";
import {Endereco} from "../entidades/endereco";

const apiFormasDeEntregaMagento = new ApiFormasDeEntregaMagento();
const apiFormasDeEntregaMock = new ApiFormasDeEntregaMock();

ApiConfiguracoes.instancia().loja.google_merchant.url = 'xml/test.xml';
const listaDeProduto = new ApiProduto();
const endereco = new Endereco('88106-000', 'Rua José Carlos de Freitas', 'São Paulo', 'São Paulo', 'SP', '123', '48999999999');
listaDeProduto.listar().then(produtos => {
    const carrinho = new Carrinho();
    produtos.map(produto => carrinho.adicionarProduto(produto));
    apiFormasDeEntregaMock.consultar(endereco, carrinho).then((formas) => {
        console.log(`Calcular Formas de Entrega Mock do Cep ${endereco.cep}:`, formas[0].titulo == 'Frete Expresso');
    });
});

listaDeProduto.listar().then(produtos => {
    const carrinho = new Carrinho();
    produtos.map(produto => produto.sku != 'ALP11420H' && carrinho.adicionarProduto(produto));
    apiFormasDeEntregaMagento.consultar(endereco, carrinho).then((formas) => {
        console.log(`Calcular Formas de Entrega Magento do Cep ${endereco.cep}:`, formas[0].titulo == 'Frete Normal');
    });
});

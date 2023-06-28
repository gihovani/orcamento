import {ApiProduto} from "../servicos/apiproduto";
import {ApiConfiguracoes} from "../servicos/apiconfiguracoes";

const configuracoes = ApiConfiguracoes.instancia();
console.log('-------------------------------------------');
console.log('---------- Lista De Produtos --------------');

const listaDeProduto1 = new ApiProduto();
configuracoes.loja.google_merchant.url = 'xml/teste.xml';
listaDeProduto1.listar(true).then(produtos => {
    const filtros = listaDeProduto1.filtros();
    console.log('Quantidade de produtos [3 itens na lista]: ', produtos.length === 6);
    console.log('Filtro dos produtos [1 Categoria]: ', filtros.get('categorias').length === 6);
    console.log('Filtro dos produtos [2 Marcas]: ', filtros.get('marca').length === 4);
});

const listaDeProduto2 = new ApiProduto();
listaDeProduto2.listar(true).then(() => {
    console.log('Filtro por categoria (Massinha): [1 produtos]: ', listaDeProduto2.filtrarPorCategoria('Utilidades Clínicas > Utilidades & Decoração > Kids > Massinha').length === 1);
});

const listaDeProduto3 = new ApiProduto();
listaDeProduto3.listar(true).then(() => {
    console.log('Filtro por marca (ALLPRIME): [3 produto]: ', listaDeProduto3.filtrarPorMarca('ALLPRIME').length === 3);
});

const listaDeProduto4 = new ApiProduto();
listaDeProduto4.listar(true).then(() => {
    console.log('Filtro por codigo de barra 7891153850191: [1 produto]: ', listaDeProduto4.filtrarPorCodigoBarra('7891153850191')[0].id === 'ACR10286A');
});
const listaDeProduto5 = new ApiProduto();
listaDeProduto5.listar(true).then(() => {
    const produtos = listaDeProduto5.filtrarPorPreco(5, 30);
    console.log('Filtro por preco > 5 e < 30: [4 produto]: ', produtos.length === 4);
});
const listaDeProduto6 = new ApiProduto();
listaDeProduto6.listar(true).then(() => {
    console.log('Filtro por nome (ALLPRIME): ', listaDeProduto6.filtrarPorNome('ALLPRIME').length === 3);
});
const listaDeProduto7 = new ApiProduto();
listaDeProduto7.listar(true).then(() => {
    console.log('Pegar dados do produto por sku: ', listaDeProduto6.consultar('ACR10286A').preco === 6.10);
});
setTimeout(() => {
    configuracoes.loja.google_merchant.filtros = 'marca=CREDEAL';
    const listaDeProduto99 = new ApiProduto();
    listaDeProduto99.listar(true).then((produtos) => {
        console.log('Pegar dados do produto por sku: ', produtos.length === 1);
    });
}, 2000);

import {Carrinho} from "./entidades/carrinho";
import {Produto} from "./entidades/produto";
import {ApiCepViaCep} from "./servicos/apibuscacep";
import {ApiClienteMock} from "./servicos/apicliente";
import {Regrapromocional} from "./entidades/regrapromocional";
import {ApiProduto} from "./servicos/apiproduto";
import {Configuracoes} from "./entidades/configuracoes";

const configuracoes = new Configuracoes();
configuracoes.url_google_merchant = 'xml/test.xml';
const produto1 = new Produto(
    'SKU',
    'Nome do Produto',
    10,
    true,
    'Descrição do Produto',
    10,
    'https://gg2.com.br/img.jpg',
    'https://gg2.com.br/',
    'Nome da Categoria',
    'GG2',
    '1234567890'
);
const produto2 = new Produto(
    'SKU2',
    'Nome do Produto2',
    20,
    true
);
const produto3 = new Produto(
    'SKU3',
    'Nome do Produto3',
    30,
    false,
    'Lorem Ipsum Descrição',
    30,
    'https://gg2.com.br/img3.jpg',
    'https://gg2.com.br/',
    'Nome da Categoria',
    'GG',
    '1234567891',
);
(() => {
    const listaDeProduto = new ApiProduto(configuracoes);
    const inicializaListaDeProduto = () => {
        listaDeProduto.listar(true);
    };
    console.log('-------------------------------------------');
    console.log('---------- Lista De Produtos --------------');

    inicializaListaDeProduto();
    const filtros = listaDeProduto.filtros();
    console.log('Quantidade de produtos [3 itens na lista]: ', listaDeProduto.produtos.length === 3);
    console.log('Filtro dos produtos [1 Categoria]: ', filtros.get('categorias').length === 1);
    console.log('Filtro dos produtos [2 Marcas]: ', filtros.get('marca').length === 2);

    inicializaListaDeProduto();
    listaDeProduto.filtrarPorCategoria('Nome da Categoria');
    console.log('Filtro por categoria: [2 produtos]: ', listaDeProduto.produtos.length === 2);


    inicializaListaDeProduto();
    listaDeProduto.filtrarPorMarca('GG');
    console.log('Filtro por marca: [1 produto]: ', listaDeProduto.produtos.length === 1);


    inicializaListaDeProduto();
    listaDeProduto.filtrarPorCodigoBarra('0123456789');
    console.log('Filtro por codigo de barra 0123456789: [1 produto]: ', listaDeProduto.produtos.length === 1);

    inicializaListaDeProduto();
    listaDeProduto.filtrarPorPreco(10, 24);
    console.log('Filtro por preco > 10 e < 24: [2 produto]: ', listaDeProduto.produtos.length === 2);

    console.log('-------------------------------------------');
    inicializaListaDeProduto();
    console.log('Pegar dados do produto por sku: ', listaDeProduto.consultar('SKU3') === produto3);
    console.log('-------------------------------------------');
})();


(() => {
    const carrinho = new Carrinho();
    const regra1 = new Regrapromocional(
        '10% de desconto - Produtos SKU,SKU2',
        1,
        true,
        new Date(2023, 4, 1),
        new Date(2023, 11, 31),
        [{'tipo': 'id', 'operacao': 'e_um_dos', 'valor': 'SKU,SKU2'}],
        {'tipo' : 'desconto_porcentagem', 'valor': 10, 'valor_maximo': 4},
    );
    const regra2 = new Regrapromocional(
        'Desconto na marca GG R$ 5,4',
        2,
        true,
        new Date(2023, 4, 1),
        new Date(2023, 11, 31),
        [{'tipo': 'marca', 'operacao': 'igual', 'valor': 'GG'}],
        {'tipo' : 'desconto_fixo', 'valor': 5.4},
    );
    const regra3 = new Regrapromocional(
        'Regra Vencida',
        99,
        true,
        new Date(2022, 4, 1),
        new Date(2022, 11, 31),
        [],
        {'tipo' : 'desconto_fixo', 'valor': 1000},
    );
    const regra4 = new Regrapromocional(
        'Regra Todos Produtos - 50',
        3,
        true,
        new Date(2022, 4, 1),
        new Date(2022, 11, 31),
        [],
        {'tipo' : 'valor_unitario', 'valor': 4},
    );
    console.log('\n\n-------------------------------------------');
    console.log('---------- Sacola / Carrinho --------------');
    carrinho.promocoes = [regra1, regra2, regra3, regra4];

    carrinho.adicionarProduto(produto1, 10);
    carrinho.adicionarProduto(produto2, 20);
    carrinho.adicionarProduto(produto3, 30);
    carrinho.totalizar(true);
    console.log(carrinho);
    return;
    console.log('Adicionar produtos [3 itens na lista]: ', carrinho.produtos.length === 3);
    console.log('Total em Quantidade [6 itens]: ', carrinho.totalizador.quantidade_produtos === 6);
    console.log('Total em Valor [140]: ', carrinho.totalizador.valor_total === 140);


    carrinho.adicionarProduto(produto3, 1);
    carrinho.totalizar(true);
    console.log('Atualizar quantidade de Produtos: ', carrinho.totalizador.quantidade_produtos === 4);
    console.log('Valor total atualizado [80]: ', carrinho.totalizador.valor_total === 80);


    carrinho.removerProduto(produto2);
    carrinho.totalizar(true);
    console.log('Remover produto [2 itens na lista]: ', carrinho.produtos.length === 2);
    console.log('Atualizada quantidade de Produtos: ', carrinho.totalizador.quantidade_produtos === 2);
    console.log('Valor total atualizado [40]: ', carrinho.totalizador.valor_total === 40);
    console.log('-------------------------------------------');
})();

(() => {
    const apiCep = new ApiCepViaCep();
    const apiCliente = new ApiClienteMock();

    apiCep.consultar('88106-000').then((dados) => {
        console.log(dados);
    });

    apiCliente.consultar('041.843.018-78').then((dados) => {
        console.log(dados);
    });
})();
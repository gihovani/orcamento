import {Carrinho} from "../entidades/carrinho";
import {Produto} from "../entidades/produto";
import {RegraPromocional} from "../entidades/regrapromocional";
import {ApiConfiguracoes} from "../servicos/apiconfiguracoes";

const configuracoes = ApiConfiguracoes.instancia();
configuracoes.loja.google_merchant.url = 'xml/test.xml';
const produto1 = new Produto(
    'SKU', 'SKU',
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
    'SKU2', 'SKU2',
    'Nome do Produto2',
    20,
    true
);
const produto3 = new Produto(
    'SKU3', 'SKU3',
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
const regra1 = new RegraPromocional(
    '10% de desconto - Produtos SKU,SKU2',
    1,
    true,
    new Date(2023, 4, 1),
    new Date(2023, 11, 31),
    [{'tipo': 'id', 'operacao': 'e_um_dos', 'valor': 'SKU,SKU2'}],
    {'tipo': 'desconto_porcentagem', 'valor': 10, 'valor_maximo': 4},
);
const regra2 = new RegraPromocional(
    'Desconto na marca GG R$ 5,4',
    2,
    true,
    new Date(2023, 4, 1),
    new Date(2023, 11, 31),
    [{'tipo': 'marca', 'operacao': 'igual', 'valor': 'GG'}],
    {'tipo': 'desconto_fixo', 'valor': 5.4},
);
const regra3 = new RegraPromocional(
    'Regra Vencida',
    99,
    true,
    new Date(2022, 4, 1),
    new Date(2022, 11, 31),
    [],
    {'tipo': 'desconto_fixo', 'valor': 1000},
);
const regra4 = new RegraPromocional(
    'Regra Todos Produtos - 50',
    3,
    true,
    new Date(2022, 4, 1),
    new Date(2022, 11, 31),
    [],
    {'tipo': 'valor_unitario', 'valor': 4},
);
const carrinho = new Carrinho([regra1, regra2, regra3, regra4]);
//
console.log('\n\n-------------------------------------------');
console.log('---------- Sacola / Carrinho --------------');

carrinho.adicionarProduto(produto1, 1);
carrinho.adicionarProduto(produto2, 2);
carrinho.adicionarProduto(produto3, 3);

console.log('Adicionar produtos [3 itens na lista]: ', carrinho.produtos.length === 3);
console.log('Total em Quantidade [6 itens]: ', carrinho.totalizador.quantidade_produtos === 6);
console.log('Total em Valor [140]: ', carrinho.totalizador.valor_total, carrinho.totalizador.valor_total === 140);


carrinho.adicionarProduto(produto3, 1, true);
console.log('Atualizar quantidade de Produtos: ', carrinho.totalizador.quantidade_produtos, carrinho.totalizador.quantidade_produtos === 4);
console.log('Valor total atualizado [80]: ', carrinho.totalizador.valor_total, carrinho.totalizador.valor_total === 80);


carrinho.removerProduto(produto2);
console.log('Remover produto [2 itens na lista]: ', carrinho.produtos.length === 2);
console.log('Atualizada quantidade de Produtos: ', carrinho.totalizador.quantidade_produtos === 2);
console.log('Valor total atualizado [40]: ', carrinho.totalizador.valor_total, carrinho.totalizador.valor_total === 40);
console.log('-------------------------------------------');


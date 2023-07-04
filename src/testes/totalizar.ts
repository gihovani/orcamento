import {ApiCarrinhoMagento, ApiCarrinhoMock} from "../servicos/apicarrinho";

const apiCarrinho = new ApiCarrinhoMock();
apiCarrinho.totalizar().then((carrinho) => {
    console.log('-------------------------------------------');
    console.log('---------- Totalizar Produtos --------------');
    console.log(`Carrinho Total: ${carrinho.totalizador.valor_total}: `, carrinho.totalizador.valor_total === 17.99);
    console.log(`Carrinho Produtos: ${carrinho.produtos.length}: `, carrinho.produtos.length === 1);
});
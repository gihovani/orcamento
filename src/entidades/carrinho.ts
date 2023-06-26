import {arredondarValor} from "../util/helper";
import {
    ICarrinho,
    ICarrinhoProduto,
    ICarrinhoTotalizador
} from "../contratos/carrinho";
import {IRegraPromocional} from "../contratos/regrapromocional";
import {IProduto} from "../contratos/entidades/produto";

export class Carrinho implements ICarrinho {
    produtos: ICarrinhoProduto[];
    promocoes: IRegraPromocional[];
    totalizador: ICarrinhoTotalizador;

    constructor(promocoes: IRegraPromocional[] = []) {
        this.produtos = [];
        this.promocoes = promocoes;
    }

    adicionarProduto(produto: IProduto, quantidade?: number, update: boolean = false) {
        if (!quantidade || isNaN(quantidade)) {
            quantidade = 1;
        }
        const item = this.produtos.find(item => item.produto.id === produto.id);
        if (item) {
            item.quantidade = (update) ? quantidade : item.quantidade + quantidade;
        } else {
            this.produtos.push({
                quantidade,
                preco_unitario: produto.preco,
                desconto: 0,
                produto,
                e_brinde: false
            });
        }
    }

    removerProduto(produto: IProduto) {
        this.produtos = this.produtos.filter(item => item.produto.id !== produto.id);
    }

    limparPromocoesProdutos() {
        this.produtos.forEach(produto => {
            if (produto.e_brinde) {
                this.removerProduto(produto.produto);
            }
            produto.desconto = 0;
            produto.preco_unitario = produto.produto.preco
        });
    }

    aplicarPromocoes() {
        this.limparPromocoesProdutos();
        this.promocoes.sort((a, b) => b.prioridade - a.prioridade);
        for (const promocao of this.promocoes) {
            if (promocao.atendeCriteriosDaPromocao(this.produtos)) {
                promocao.aplicarPromocao();
            }
        }
    }

    totalizar(calcular_promocoes: boolean) {
        if (calcular_promocoes) {
            this.aplicarPromocoes();
        }

        this.totalizador = {
            quantidade_produtos: 0,
            valor_total: 0,
            valor_subtotal: 0,
            valor_desconto: 0,
            detalhes_decontos: []
        };
        this.totalizador.detalhes_decontos.push(['produto', 'preco_original', 'quantidade', 'preco_unitario', 'desconto', 'valor'].join(';'));
        for (const item of this.produtos) {
            const valor = arredondarValor(item.quantidade * item.preco_unitario);
            const desconto = arredondarValor(item.quantidade * item.desconto);
            const valor_subtotal = arredondarValor(item.quantidade * item.produto.preco);

            this.totalizador.quantidade_produtos += item.quantidade;
            this.totalizador.valor_subtotal = arredondarValor(this.totalizador.valor_subtotal + valor_subtotal);
            this.totalizador.valor_total = arredondarValor(this.totalizador.valor_total + valor);
            this.totalizador.valor_desconto = arredondarValor(this.totalizador.valor_desconto + desconto);
            this.totalizador.detalhes_decontos.push([
                item.produto.id,
                item.produto.preco,
                item.quantidade,
                item.preco_unitario,
                item.desconto,
                valor
            ].join(';'));
        }
    }
}

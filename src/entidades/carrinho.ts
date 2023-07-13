import {arredondarValor} from "../util/helper";
import {
    ICarrinho,
    ICarrinhoProduto,
    ICarrinhoTotalizador
} from "../contratos/carrinho";
import {IRegraPromocional} from "../contratos/regrapromocional";
import {IProduto} from "../contratos/entidades/produto";

export class Carrinho implements ICarrinho {
    private _produtos: ICarrinhoProduto[] = [];
    private _promocoes: IRegraPromocional[] = [];
    brindes: IProduto[] = [];
    totalizador: ICarrinhoTotalizador = {
        quantidade_produtos: 0,
        valor_total: 0,
        valor_subtotal: 0,
        valor_desconto: 0,
        detalhes_decontos: []
    };

    constructor(promocoes: IRegraPromocional[] = []) {
        this.promocoes = promocoes;
        this.produtos = [];
        this.brindes = [];
    }

    set produtos(produtos: ICarrinhoProduto[]) {
        this._produtos = produtos;
    }

    get produtos(): ICarrinhoProduto[] {
        return this._produtos;
    }

    set promocoes(promocoes: IRegraPromocional[]) {
        promocoes.sort((a, b) => a.prioridade - b.prioridade);
        this._promocoes = promocoes;
    }

    get promocoes(): IRegraPromocional[] {
        return this._promocoes;
    }

    adicionarProduto(produto: IProduto, quantidade?: number, update: boolean = false, personalizacao: string = ''): void {
        if (!quantidade || isNaN(quantidade)) {
            quantidade = 1;
        }
        const item = this.produtos.find(item => item.produto.sku === produto.sku);
        if (item) {
            item.quantidade = (update) ? quantidade : item.quantidade + quantidade;
            if (personalizacao) {
                item.personalizacao = personalizacao;
            }
        } else {
            this.produtos.push({
                quantidade,
                preco_unitario: produto.preco,
                desconto: 0,
                produto,
                personalizacao
            });
        }
        this.totalizar();
    }

    removerProduto(produto: IProduto): void {
        this.produtos = this.produtos.filter(item => item.produto.sku !== produto.sku);
        this.totalizar();
    }

    limparPromocoesProdutos(): void {
        this.brindes = [];
        this._produtos.map(produto => {
            produto.desconto = 0;
            produto.preco_unitario = produto.produto.preco
        });
    }

    aplicarPromocoes(): void {
        this.limparPromocoesProdutos();
        for (const promocao of this.promocoes) {
            if (promocao.atendeCriteriosDaPromocao(this.produtos)) {
                promocao.aplicarPromocao(this);
            }
        }
    }

    totalizar(): void {
        this.aplicarPromocoes();
        this.totalizador = {
            quantidade_produtos: 0,
            valor_total: 0,
            valor_subtotal: 0,
            valor_desconto: 0,
            detalhes_decontos: []
        };
        this.totalizador.detalhes_decontos.push(['produto', 'preco_original', 'quantidade', 'preco_unitario', 'desconto', 'valor'].join(';'));
        for (const item of this._produtos) {
            const valor = arredondarValor(item.quantidade * item.preco_unitario);
            const desconto = arredondarValor(item.quantidade * item.desconto);
            const valor_subtotal = arredondarValor(item.quantidade * item.produto.preco);

            this.totalizador.quantidade_produtos += item.quantidade;
            this.totalizador.valor_subtotal = arredondarValor(this.totalizador.valor_subtotal + valor_subtotal);
            this.totalizador.valor_total = arredondarValor(this.totalizador.valor_total + valor);
            this.totalizador.valor_desconto = arredondarValor(this.totalizador.valor_desconto + desconto);
            this.totalizador.detalhes_decontos.push([
                item.produto.sku,
                item.produto.preco,
                item.quantidade,
                item.preco_unitario,
                item.desconto,
                valor
            ].join(';'));
        }
    }
}

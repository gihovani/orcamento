import {ICarrinho, ICarrinhoProduto} from "../contratos/carrinho";
import {arredondarValor} from "../util/helper";
import {IRegraPromocional, IRegraPromocionalAcao, IRegraPromocionalCondicao} from "../contratos/regrapromocional";

export class RegraPromocional implements IRegraPromocional {
    private _carrinho_itens: ICarrinhoProduto[];
    private _promocao_aplicada: boolean = false;

    constructor(
        public nome: string,
        public prioridade: number,
        public situacao: boolean,
        public data_inicio: Date,
        public data_fim: Date,
        public condicoes: IRegraPromocionalCondicao[],
        public acao: IRegraPromocionalAcao,
        public descricao?: string,
        public imagem?: string
    ) {
    }

    get promocao_aplicada(): boolean {
        return this._promocao_aplicada;
    }

    atendeCriteriosDaPromocao(produtos: ICarrinhoProduto[]): boolean {
        this._promocao_aplicada = false;
        if (!this.situacao) {
            return false;
        }
        const data_atual = new Date();
        if (this.data_inicio && this.data_inicio > data_atual) {
            this.situacao = false;
            return false;
        }
        if (this.data_fim && this.data_fim < data_atual) {
            this.situacao = false;
            return false;
        }

        this._carrinho_itens = produtos;
        if (this.condicoes.length === 0) {
            return this._carrinho_itens.length > 0;
        }
        for (const condicao of this.condicoes) {
            if (['sku', 'preco', 'categorias', 'marca'].indexOf(condicao.tipo) >= 0) {
                this._carrinho_itens = this._carrinho_itens.filter(item => this.verificarCondicao(condicao, item.produto));
            }
            if (['valor_itens', 'quantidade_itens'].indexOf(condicao.tipo) >= 0) {
                this._carrinho_itens = this.verificaValorOuQuantidade(this._carrinho_itens, condicao);
            }
            if (['valor_total', 'quantidade_total'].indexOf(condicao.tipo) >= 0) {
                this._carrinho_itens = this.verificaValorOuQuantidade(produtos, condicao);
            }
        }

        return this._carrinho_itens.length > 0;

    }

    private verificaValorOuQuantidade(produtos: ICarrinhoProduto[], condicao: IRegraPromocionalCondicao): ICarrinhoProduto[] {
        let valor = 0;
        let quantidade = 0;
        produtos.map(item => {
            valor += item.preco_unitario * item.quantidade;
            quantidade += item.quantidade;
        });
        const item = {};
        item[condicao.tipo] = valor;
        if (!this.verificarCondicao(condicao, item)) {
            produtos = [];
        }
        return produtos;
    }

    private verificarCondicao(condicao: IRegraPromocionalCondicao, item: any): boolean {
        const {tipo, operacao, valor} = condicao;
        if (!(tipo in item)) {
            return false;
        }
        let tmp = [];
        if (tipo === 'categorias') {
            tmp = item[tipo].toLowerCase().split(' > ');
        }
        switch (operacao) {
            case 'igual':
                if (tmp.length) {
                    return tmp.indexOf(valor.toLowerCase()) >= 0;
                }
                return item[tipo] == valor;
            case 'diferente':
                if (tmp.length) {
                    return tmp.indexOf(valor.toLowerCase()) < 0;
                }
                return item[tipo] != valor;
            case 'maior':
                return item[tipo] > valor;
            case 'menor':
                return item[tipo] < valor;
            case 'maior_igual':
                return item[tipo] >= valor;
            case 'menor_igual':
                return item[tipo] <= valor;
            case 'e_um_dos':
                if (tmp.length) {
                    const filteredArray = valor.split(',').filter(value => tmp.includes(value));
                    return filteredArray.length > 0;
                }
                return valor.split(',').includes(String(item[tipo]));
            case 'nao_e_um_dos':
                if (tmp.length) {
                    const filteredArray = valor.split(',').filter(value => tmp.includes(value));
                    return filteredArray.length <= 0;
                }
                return !valor.split(',').includes(String(item[tipo]));
            default:
                return false;
        }
    }

    aplicarPromocao(carrinho: ICarrinho): void {
        if (this._carrinho_itens.length === 0) {
            return;
        }
        this._promocao_aplicada = true;
        switch (this.acao.tipo) {
            case 'desconto_porcentagem':
                this.regraDescontoPorcentagem(carrinho);
                break;
            case 'desconto_fixo':
                this.regraDescontoFixo(carrinho);
                break;
            case 'valor_unitario':
                this.regraDescontoValorUnitario(carrinho);
                break;
            case 'brinde_unico':
                this.regraDeBrindeUnico(carrinho);
                break;
        }
    }

    private regraDeBrindeUnico(carrinho: ICarrinho): void {
        this.acao.brindes.map(brinde => {
            carrinho.brindes.push(brinde);
        });
    }

    private regraDescontoFixo(carrinho: ICarrinho): void {
        let itens = this._carrinho_itens;
        if (this.acao.skus) {
            itens = itens.filter(item => this.acao.skus.split(',').includes(item.produto.sku));
        }
        itens.map(produto => {
            const desconto = this.verificaValorMaximoDeDesconto(this.acao.valor);
            this.atualizaValorUnitario(produto, desconto);
        });
    }

    private regraDescontoValorUnitario(carrinho: ICarrinho): void {
        let itens = this._carrinho_itens;
        if (this.acao.skus) {
            itens = itens.filter(item => this.acao.skus.split(',').includes(item.produto.sku));
        }
        itens.map(produto => {
            const desconto = this.verificaValorMaximoDeDesconto(this.acao.valor * produto.quantidade);
            this.atualizaValorUnitario(produto, desconto);
        });
    }

    private regraDescontoPorcentagem(carrinho: ICarrinho): void {
        let itens = this._carrinho_itens;
        if (this.acao.skus) {
            itens = itens.filter(item => this.acao.skus.split(',').includes(item.produto.sku));
        }
        itens.map(produto => {
            let desconto = (produto.preco_unitario * (this.acao.valor / 100));
            desconto = this.verificaValorMaximoDeDesconto(desconto * produto.quantidade);
            this.atualizaValorUnitario(produto, desconto);
        });
    }

    private verificaValorMaximoDeDesconto(valor: number): number {
        if (!this.acao.valor_maximo) {
            return valor;
        }
        return valor;
    }

    private atualizaValorUnitario(produto: ICarrinhoProduto, desconto: number): void {
        if (!desconto) {
            return;
        }
        desconto = arredondarValor(desconto / produto.quantidade);
        produto.desconto += desconto;
        produto.preco_unitario = arredondarValor(produto.preco_unitario - desconto);
    }
}

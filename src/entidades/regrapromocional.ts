import {ICarrinhoProduto} from "../contratos/carrinho";
import {arredondarValor} from "../util/helper";
import {IRegraPromocional, IRegraPromocionalAcao, IRegraPromocionalCondicao} from "../contratos/regrapromocional";
import {IProduto} from "../contratos/entidades/produto";

export class Regrapromocional implements IRegraPromocional {
    private produtos: ICarrinhoProduto[];

    constructor(
        public nome: string,
        public prioridade: number,
        public situacao: boolean,
        public dataInicio: Date,
        public dataFim: Date,
        public condicoes: IRegraPromocionalCondicao[],
        public acao: IRegraPromocionalAcao,
        public descricao?: string
    ) {
    }

    atendeCriteriosDaPromocao(produtos: ICarrinhoProduto[]) {
        if (!this.situacao) {
            return false;
        }
        const dataAtual = new Date();
        if (this.dataInicio && this.dataInicio > dataAtual) {
            this.situacao = false;
            return false;
        }
        if (this.dataFim && this.dataFim < dataAtual) {
            this.situacao = false;
            return false;
        }

        if (this.condicoes.length !== 0) {
            for (const condicao of this.condicoes) {
                this.produtos = produtos.filter(item => this.verificarCondicao(condicao, item.produto));
            }
        } else {
            this.produtos = produtos;
        }
        return this.produtos.length > 0;
    }

    verificarCondicao(condicao: IRegraPromocionalCondicao, item: IProduto) {
        const {tipo, operacao, valor} = condicao;
        switch (operacao) {
            case 'igual':
                return item[tipo] === valor;
            case 'diferente':
                return item[tipo] !== valor;
            case 'maior':
                return item[tipo] > valor;
            case 'menor':
                return item[tipo] < valor;
            case 'maior_igual':
                return item[tipo] >= valor;
            case 'menor_igual':
                return item[tipo] <= valor;
            case 'e_um_dos':
                return valor.split(',').includes(String(item[tipo]));
            case 'nao_e_um_dos':
                return !valor.split(',').includes(String(item[tipo]));
            default:
                return false;
        }
    }

    aplicarPromocao() {
        if (this.produtos.length === 0) {
            return;
        }
        switch (this.acao.tipo) {
            case 'desconto_porcentagem':
                    this.regraDescontoPorcentagem();
                break;
            case 'desconto_fixo':
                // Implemente a lógica para adicionar um produto brinde com valor zerado
                break;
            case 'valor_unitario':
                // Implemente a lógica para adicionar um produto brinde com valor zerado
                break;
            case 'brinde_unico':
                // Implemente a lógica para adicionar um produto brinde com valor zerado
                break;
        }
    }

    regraDescontoPorcentagem() {
        this.produtos.forEach(produto => {
            let desconto = (produto.preco_unitario * (this.acao.valor / 100));
            desconto = this.verificaValorMaximoDeDesconto(desconto * produto.quantidade);
            this.atualizaValorUnitario(produto, desconto);
        });
    }

    verificaValorMaximoDeDesconto(valor: number) {
        if (!this.acao.valor_maximo) {
            return valor;
        }
        return valor;
    }

    atualizaValorUnitario(produto: ICarrinhoProduto, desconto: number) {
        if (!desconto) {
            return;
        }
        desconto = arredondarValor(desconto / produto.quantidade);
        produto.desconto += desconto;
        produto.preco_unitario = arredondarValor(produto.preco_unitario - desconto);
    }
}

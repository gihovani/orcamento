import {ILayout} from "../contratos/layout";
import {criarElementoHtml} from "../util/helper";
import {ITela} from "../contratos/tela";
import {Regrapromocional} from "../entidades/regrapromocional";
import {Carrinho} from "../entidades/carrinho";
import {ApiClienteMock} from "../servicos/apicliente";
import {ApiCepViaCep} from "../servicos/apibuscacep";
import {ApiProduto} from "../servicos/apiproduto";
import {BarraDeNavegacao} from "./barradenavegacao";
import {FormularioCliente} from "./formulariocliente";
import {FormularioEndereco} from "./formularioendereco";
import {ListagemDeProdutos} from "./listagemdeprodutos";
import {ListaDeCompras} from "./listadecompras";
import {MensagemBoasVindas} from "./mensagemboasvindas";
import {IConfiguracoes} from "../contratos/entidades/configuracoes";
import {FormularioConfiguracoes} from "./formularioconfiguracoes";

export class App extends ILayout {
    private _tela: ITela;

    constructor(
        public elemento: HTMLElement,
        public configuracoes: IConfiguracoes,
        tela: ITela,
        public barraDeNavegacao: BarraDeNavegacao
    ) {
        super();
        this.tela = tela;
        this.inicializaEventos();
    }

    conteudo(): HTMLElement {
        return this.tela.conteudo();
    }

    get tela(): ITela {
        return this._tela;
    }

    set tela(tela: ITela) {
        this._tela = tela;
        this.renderizar();
    }

    inicializaEventos() {
        document.addEventListener('atualizar-tela', (e: CustomEvent) => {
            this.renderizar();
        });
        document.addEventListener('autenticacao', (e: CustomEvent) => {
            const carrinho = this.criaCarrinho();
            const apiCliente = new ApiClienteMock();
            const apiCep = new ApiCepViaCep();
            const apiProduto = new ApiProduto(this.configuracoes);
            this.tela = new MensagemBoasVindas(e.detail);
            this.barraDeNavegacao.adicionaMenu('Configurações', () => {
                this.tela = new FormularioConfiguracoes(this.configuracoes, apiProduto);
            });
            this.barraDeNavegacao.adicionaMenu('Cliente', () => {
                this.tela = new FormularioCliente(apiCliente);
            });
            this.barraDeNavegacao.adicionaMenu('Endereço de Entrega', () => {
                this.tela = new FormularioEndereco(apiCep);
            });
            this.barraDeNavegacao.adicionaMenu('Lista de Produtos', () => {
                this.tela = new ListagemDeProdutos(apiProduto, carrinho);
            });
            this.barraDeNavegacao.adicionaMenu('Carrinho', () => {
                this.tela = new ListaDeCompras(carrinho);
            });
            this.barraDeNavegacao.adicionaMenu('Logout', () => {
                window.location.reload();
            });
            this.renderizar();
        });
    }

    private criaCarrinho() {
        const regra10PorcentoDeDescontoProduto = new Regrapromocional(
            '10% de desconto - ACR8615A - Organizador de Gaveta - Preto - ACRIMET',
            1,
            true,
            new Date(2023, 0, 1),
            new Date(2023, 11, 31),
            [{'tipo': 'id', 'operacao': 'igual', 'valor': 'ACR8615A'}],
            {'tipo': 'desconto_porcentagem', 'valor': 10},
        );
        return new Carrinho([regra10PorcentoDeDescontoProduto]);
    }

    cabecalho(): HTMLElement {
        return this.barraDeNavegacao.conteudo();
    }

    rodape(): HTMLElement {
        return criarElementoHtml('div');
    }
}
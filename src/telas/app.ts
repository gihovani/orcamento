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
import {ApiVendedorMock} from "../servicos/apivendedor";
import {FormularioLogin} from "./formulariologin";
import {INotificacao} from "../contratos/componentes/notificacao";
import {Notificacao} from "./componentes/notificacao";
import {ICarregando} from "../contratos/componentes/carregando";
import {Carregando} from "./componentes/carregando";
import {FormularioPagamentoCartaoDeCredito} from "./formulariopagamentocartaodecredito";
import {ApiBin} from "../servicos/apibin";
import {Apiparcelamento} from "../servicos/apiparcelamento";
import {FormularioPagamentoBoletoParcelado} from "./formulariopagamentoboletoparcelado";
import {FormularioPagamentoCartaoDeCreditoMaquineta} from "./formulariopagamentocartaodecreditomaquineta";

export class App extends ILayout {
    private _tela: ITela;
    private _notificacao: INotificacao;
    private _carregando: ICarregando;

    constructor(
        public elemento: HTMLElement,
        public configuracoes: IConfiguracoes,
        public barraDeNavegacao: BarraDeNavegacao
    ) {
        super();
        this.inicializar();
    }

    inicializar() {
        const body = document.querySelector('body')
        const apiVendedor = new ApiVendedorMock();
        this._notificacao = new Notificacao(body);
        this._carregando = new Carregando(body);
        this.tela = new FormularioLogin(apiVendedor, this._notificacao);
        body.classList.add('tema-ds');
        
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
            const apiBin = new ApiBin();
            const apiparcelamento = new Apiparcelamento();
            const apiProduto = new ApiProduto(this.configuracoes);
            this.tela = new MensagemBoasVindas(e.detail);
            this.barraDeNavegacao.adicionaMenu('Configurações', () => {
                this.tela = new FormularioConfiguracoes(this.configuracoes, apiProduto, this._notificacao, this._carregando);
            });
            this.barraDeNavegacao.adicionaMenu('Cliente', () => {
                this.tela = new FormularioCliente(apiCliente, this._notificacao);
            });
            this.barraDeNavegacao.adicionaMenu('Endereço de Entrega', () => {
                this.tela = new FormularioEndereco(apiCep, this._notificacao);
            });
            this.barraDeNavegacao.adicionaMenu('Lista de Produtos', () => {
                this.tela = new ListagemDeProdutos(apiProduto, carrinho, this._notificacao, this._carregando);
            });
            this.barraDeNavegacao.adicionaMenu('Carrinho', () => {
                this.tela = new ListaDeCompras(carrinho, this._notificacao);
            });
            this.barraDeNavegacao.adicionaMenu('Cartão de Crédito Maquineta', () => {
                this.tela = new FormularioPagamentoCartaoDeCreditoMaquineta(carrinho, apiparcelamento, this._notificacao);
            });
            this.barraDeNavegacao.adicionaMenu('Cartão de Crédito', () => {
                this.tela = new FormularioPagamentoCartaoDeCredito(carrinho, apiparcelamento, apiBin, this._notificacao);
            });
            this.barraDeNavegacao.adicionaMenu('Boleto Parcelado', () => {
                this.tela = new FormularioPagamentoBoletoParcelado(carrinho, apiparcelamento, this._notificacao);
            });
            this.barraDeNavegacao.adicionaMenu('Logout', () => {
                window.location.reload();
            });
            this.renderizar();
        });
    }

    private criaCarrinho() {
        const regra10PorcentoDeDescontoProduto = new Regrapromocional(
            '10% de desconto - MARCA ALLPRIME',
            1,
            true,
            new Date(2023, 0, 1),
            new Date(2023, 11, 31),
            [{'tipo': 'marca', 'operacao': 'igual', 'valor': 'ALLPRIME'}],
            {'tipo': 'desconto_porcentagem', 'valor': 10},
        );
        return new Carrinho([regra10PorcentoDeDescontoProduto]);
    }

    cabecalho(): HTMLElement {
        return this.barraDeNavegacao.conteudo();
    }

    rodape(): HTMLElement {
        const footer = criarElementoHtml('footer', ['footer', 'mt-auto', 'py-3', 'bg-body-tertiary', 'row']);
        const dataAtual = new Date();
        footer.innerHTML = `<div class="container">
            <span class="text-body-secondary">
            © 1988–${dataAtual.getFullYear()} GG2 Soluções (v.:${this.configuracoes.versao}). 
            Todos os direitos reservados.
            </span>
        </div>`;
        return footer;
    }
}
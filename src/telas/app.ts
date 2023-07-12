import {ILayout} from "../contratos/layout";
import {criarElementoHtml} from "../util/helper";
import {ITela} from "../contratos/tela";
import {Carrinho} from "../entidades/carrinho";
import {ApiClienteMock} from "../servicos/apicliente";
import {ApiCepViaCep} from "../servicos/apibuscacep";
import {ApiProduto} from "../servicos/apiproduto";
import {BarraDeNavegacao} from "./barradenavegacao";
import {ListagemDeProdutos} from "./listagemdeprodutos";
import {ListaDeCompras} from "./listadecompras";
import {MensagemBoasVindas} from "./mensagemboasvindas";
import {FormularioConfiguracoes} from "./formularioconfiguracoes";
import {ApiVendedorMock} from "../servicos/apivendedor";
import {FormularioLogin} from "./formulariologin";
import {INotificacao} from "../contratos/componentes/notificacao";
import {Notificacao} from "./componentes/notificacao";
import {ICarregando} from "../contratos/componentes/carregando";
import {Carregando} from "./componentes/carregando";
import {ApiBin} from "../servicos/apibin";
import {ApiConfiguracoes} from "../servicos/apiconfiguracoes";
import {FormularioPagamento} from "./formulariopagamento";
import {IApiVendedor} from "../contratos/servicos/apivendedor";
import {ListaDePromocoes} from "./listadepromocoes";
import {ICarrinho} from "../contratos/carrinho";
import {ApiFormasDeEntregaMagento} from "../servicos/apiformasdeentrega";
import {ApiCarrinhoMagento} from "../servicos/apicarrinho";
import {ApiFormasDePagamentoMagento} from "../servicos/apiformasdepagamento";
import {ApiRegraPromocional} from "../servicos/apiregrapromocional";


export class App extends ILayout {
    private _tela: ITela;
    private _carrinho: ICarrinho;
    private _apiVendedor: IApiVendedor;
    private _notificacao: INotificacao;
    private _carregando: ICarregando;
    private _barraDeNavegacao: BarraDeNavegacao;

    constructor(
        public elemento: HTMLElement
    ) {
        super();
        this.inicializar();
    }

    inicializar() {
        const body = document.querySelector('body');
        this._carrinho = this.criaCarrinho();
        this._apiVendedor = new ApiVendedorMock();
        this._notificacao = new Notificacao(body);
        this._carregando = new Carregando(body);
        this._barraDeNavegacao = new BarraDeNavegacao(this._carrinho);
        this.tela = new FormularioLogin(this._apiVendedor, this._notificacao);
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

    inicializaEventos(): void {
        document.addEventListener('atualizar-tela', () => {
            this.renderizar();
        });

        document.addEventListener('autenticacao', (e: CustomEvent) => {
            const apiCliente = new ApiClienteMock();
            const apiCep = new ApiCepViaCep();
            const apiBin = new ApiBin();
            const apiFormaDePagamento = new ApiFormasDePagamentoMagento();
            const apiProduto = new ApiProduto();
            const apiFormasDeEntrega = new ApiFormasDeEntregaMagento();
            const apiCarrinho = new ApiCarrinhoMagento();

            const mensagemBoasVindas = new MensagemBoasVindas(e.detail);
            const formularioConfiguracoes = new FormularioConfiguracoes(apiProduto, this._notificacao, this._carregando);

            const listagemDeProdutos = new ListagemDeProdutos(apiProduto, this._carrinho, this._barraDeNavegacao, this._carregando);
            const listaDePromocoes = new ListaDePromocoes(this._carrinho);
            const listaDeCompras = new ListaDeCompras(this._carrinho, this._barraDeNavegacao, this._notificacao);
            const formularioPagamento = new FormularioPagamento(this._carrinho, apiCliente, apiCep, apiFormasDeEntrega, apiCarrinho, apiFormaDePagamento, apiBin, this._notificacao, this._carregando);

            this.tela = mensagemBoasVindas;
            this._barraDeNavegacao.adicionaMenu('menu-configuracoes', 'Configurações', () => {
                this.tela = formularioConfiguracoes;
            });
            this._barraDeNavegacao.adicionaMenu('menu-lista-de-produtos', 'Lista de Produtos', () => {
                listagemDeProdutos.pegaDadosDosProdutos();
                this.tela = listagemDeProdutos;
            });
            this._barraDeNavegacao.adicionaMenu('menu-pagamento', 'Promoções', () => {
                this.tela = listaDePromocoes;
            });
            this._barraDeNavegacao.adicionaMenu('menu-carrinho', 'Carrinho', () => {
                this.tela = listaDeCompras;
            });
            this._barraDeNavegacao.adicionaMenu('menu-pagamento', 'Pagamento', () => {
                this.tela = formularioPagamento;
            });
            this._barraDeNavegacao.adicionaMenu('menu-deslogar', 'Logout', () => {
                window.location.reload();
            });
            this.renderizar();
        });
    }

    private criaCarrinho(): ICarrinho {
        const apiRegras = new ApiRegraPromocional();
        const carrinho = new Carrinho();
        apiRegras.listar().then(regras => carrinho.promocoes = regras);
        return carrinho;
    }

    cabecalho(): HTMLElement {
        return this._barraDeNavegacao.conteudo();
    }

    rodape(): HTMLElement {
        const configuracoes = ApiConfiguracoes.instancia();
        const footer = criarElementoHtml('footer', ['footer', 'mt-auto', 'py-3', 'bg-body-tertiary', 'row']);
        const dataAtual = new Date();
        footer.innerHTML = `<div class="container text-center">
            <span class="text-body-secondary">
            © 1988–${dataAtual.getFullYear()} GG2 Soluções (v.:${configuracoes.versao}). 
            Todos os direitos reservados.
            </span>
        </div>`;
        return footer;
    }
}
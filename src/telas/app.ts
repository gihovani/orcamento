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
import {FormularioConfiguracoes} from "./formularioconfiguracoes";
import {ApiVendedorMock} from "../servicos/apivendedor";
import {FormularioLogin} from "./formulariologin";
import {INotificacao} from "../contratos/componentes/notificacao";
import {Notificacao} from "./componentes/notificacao";
import {ICarregando} from "../contratos/componentes/carregando";
import {Carregando} from "./componentes/carregando";
import {FormularioPagamentoCartaoDeCredito} from "./formulariopagamentocartaodecredito";
import {ApiBin} from "../servicos/apibin";
import {ApiParcelamento} from "../servicos/apiparcelamento";
import {FormularioPagamentoBoletoParcelado} from "./formulariopagamentoboletoparcelado";
import {FormularioPagamentoCartaoDeCreditoMaquineta} from "./formulariopagamentocartaodecreditomaquineta";
import {ApiConfiguracoes} from "../servicos/apiconfiguracoes";
import {FormularioPagamento} from "./formulariopagamento";

export class App extends ILayout {
    private _tela: ITela;
    private _notificacao: INotificacao;
    private _carregando: ICarregando;

    constructor(
        public elemento: HTMLElement,
        public barraDeNavegacao: BarraDeNavegacao
    ) {
        super();
        this.inicializar();
    }


    defineTema(tema) {
        const tagEstilosDoTema = criarElementoHtml('link', [], [{
            nome: 'rel', valor: 'stylesheet'
        }, {
            nome: 'href', valor: './' + tema + '.css'
        }]);
        const head = document.querySelector('head');
        head.appendChild(tagEstilosDoTema)
    }

    inicializar() {
        const body = document.querySelector('body')
        const apiVendedor = new ApiVendedorMock();
        const tema = 'tema-ds';
        this._notificacao = new Notificacao(body);
        this._carregando = new Carregando(body);
        this.tela = new FormularioLogin(apiVendedor, this._notificacao);
        body.classList.add(tema);

        this.defineTema(tema);
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
            const apiParcelamento = new ApiParcelamento();
            const apiProduto = new ApiProduto();
            const mensagemBoasVindas = new MensagemBoasVindas(e.detail);
            const formularioConfiguracoes = new FormularioConfiguracoes(apiProduto, this._notificacao, this._carregando);
            const formularioCliente = new FormularioCliente(apiCliente, this._notificacao, this._carregando);
            const formularioEndereco = new FormularioEndereco(apiCep, this._notificacao, this._carregando);
            const listagemDeProdutos = new ListagemDeProdutos(apiProduto, carrinho, this._carregando);
            const formularioPagamentoCartaoDeCreditoMaquineta = new FormularioPagamentoCartaoDeCreditoMaquineta(carrinho, apiParcelamento, this._notificacao);
            const formularioPagamentoCartaoDeCredito = new FormularioPagamentoCartaoDeCredito(carrinho, apiParcelamento, apiBin, this._notificacao);
            const formularioPagamentoBoletoParcelado = new FormularioPagamentoBoletoParcelado(carrinho, apiParcelamento, this._notificacao);
            const formularioPagamento = new FormularioPagamento(carrinho, apiCliente, apiCep, apiParcelamento, apiBin, this._notificacao, this._carregando);
            const listaDeCompras = new ListaDeCompras(carrinho, this._notificacao);

            this.tela = mensagemBoasVindas;
            this.barraDeNavegacao.adicionaMenu('menu-configuracoes', 'Configurações', () => {
                this.tela = formularioConfiguracoes;
            });
            this.barraDeNavegacao.adicionaMenu('menu-cliente', 'Cliente', () => {
                this.tela = formularioCliente;
            });
            this.barraDeNavegacao.adicionaMenu('menu-endereco', 'Endereço de Entrega', () => {
                this.tela = formularioEndereco;
            });
            this.barraDeNavegacao.adicionaMenu('menu-lista-de-produtos', 'Lista de Produtos', () => {
                this.tela = listagemDeProdutos;
            });
            this.barraDeNavegacao.adicionaMenu('menu-cartao-de-credito-maquineta', 'CC Maquineta', () => {
                this.tela = formularioPagamentoCartaoDeCreditoMaquineta;
            });
            this.barraDeNavegacao.adicionaMenu('menu-cartao-de-credito', 'CC', () => {
                this.tela = formularioPagamentoCartaoDeCredito;
            });
            this.barraDeNavegacao.adicionaMenu('menu-boleto-parcelado', 'Boleto Parcelado', () => {
                this.tela = formularioPagamentoBoletoParcelado;
            });
            this.barraDeNavegacao.adicionaMenu('menu-pagamento', 'Pagamento', () => {
                this.tela = formularioPagamento;
            });
            this.barraDeNavegacao.adicionaMenu('menu-carrinho', 'Carrinho', () => {
                this.tela = listaDeCompras;
            });
            this.barraDeNavegacao.adicionaMenu('menu-deslogar', 'Logout', () => {
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
        const configuracoes = ApiConfiguracoes.instancia();
        const footer = criarElementoHtml('footer', ['footer', 'mt-auto', 'py-3', 'bg-body-tertiary', 'row']);
        const dataAtual = new Date();
        footer.innerHTML = `<div class="container">
            <span class="text-body-secondary text-center">
            © 1988–${dataAtual.getFullYear()} GG2 Soluções (v.:${configuracoes.versao}). 
            Todos os direitos reservados.
            </span>
        </div>`;
        return footer;
    }
}
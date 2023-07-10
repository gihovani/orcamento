import {ILayout} from "../contratos/layout";
import {criarElementoHtml} from "../util/helper";
import {ITela} from "../contratos/tela";
import {RegraPromocional} from "../entidades/regrapromocional";
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
import {Produto} from "../entidades/produto";
import {ListaDePromocoes} from "./listadepromocoes";
import {ICarrinho} from "../contratos/carrinho";
import {ApiFormasDeEntregaMagento} from "../servicos/apiformasdeentrega";
import {ApiCarrinhoMagento} from "../servicos/apicarrinho";
import {ApiFormasDePagamentoMagento} from "../servicos/apiformasdepagamento";
import {FormularioCliente} from "./descontinuadas/formulariocliente";
import {FormularioEndereco} from "./descontinuadas/formularioendereco";
import {FormularioPagamentoCartaoMaquineta} from "./descontinuadas/formulariopagamentocartaomaquineta";
import {FormularioPagamentoCartaoDeCredito} from "./descontinuadas/formulariopagamentocartaodecredito";
import {FormularioPagamentoBoletoParcelado} from "./descontinuadas/formulariopagamentoboletoparcelado";

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
            const ehAdministrador = this._apiVendedor.ehAdministrador();

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

            //Descontinuadas
            const formularioCliente = new FormularioCliente(apiCliente, this._notificacao, this._carregando);
            const formularioEndereco = new FormularioEndereco(apiCep, this._notificacao, this._carregando);
            const formularioPagamentoCartaoDeCreditoMaquineta = new FormularioPagamentoCartaoMaquineta(this._carrinho, this._notificacao);
            const formularioPagamentoCartaoDeCredito = new FormularioPagamentoCartaoDeCredito(this._carrinho, apiBin, this._notificacao);
            const formularioPagamentoBoletoParcelado = new FormularioPagamentoBoletoParcelado(this._carrinho, this._notificacao);

            this.tela = mensagemBoasVindas;
            this._barraDeNavegacao.adicionaMenu('menu-configuracoes', 'Configurações', () => {
                this.tela = formularioConfiguracoes;
            });
            ehAdministrador && this._barraDeNavegacao.adicionaMenu('menu-cliente', 'Cliente', () => {
                this.tela = formularioCliente;
            });
            ehAdministrador && this._barraDeNavegacao.adicionaMenu('menu-endereco', 'Endereço de Entrega', () => {
                this.tela = formularioEndereco;
            });
            this._barraDeNavegacao.adicionaMenu('menu-lista-de-produtos', 'Lista de Produtos', () => {
                listagemDeProdutos.pegaDadosDosProdutos();
                this.tela = listagemDeProdutos;
            });
            ehAdministrador && this._barraDeNavegacao.adicionaMenu('menu-cartao-de-credito-maquineta', 'CC Maquineta', () => {
                this.tela = formularioPagamentoCartaoDeCreditoMaquineta;
            });
            ehAdministrador && this._barraDeNavegacao.adicionaMenu('menu-cartao-de-credito', 'CC', () => {
                this.tela = formularioPagamentoCartaoDeCredito;
            });
            ehAdministrador && this._barraDeNavegacao.adicionaMenu('menu-boleto-parcelado', 'Boleto Parcelado', () => {
                this.tela = formularioPagamentoBoletoParcelado;
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
        const carrinho = new Carrinho();
        let prioridade = 1;

        carrinho.promocoes.push(new RegraPromocional(
            '10% de desconto - MARCA ALLPRIME',
            prioridade++,
            true,
            new Date(2023, 0, 1),
            new Date(2023, 11, 31),
            [
                {'tipo': 'marca', 'operacao': 'igual', 'valor': 'ALLPRIME'},
                {'tipo': 'valor_itens', 'operacao': 'maior_igual', 'valor': '50'}
            ],
            {'tipo': 'desconto_porcentagem', 'valor': 10},
        ));
        carrinho.promocoes.push(this.criarRegraBrinde(
            prioridade,
            'Mini Creme - COLGATE',
            'Compre R$ 99,99 em COLGATE e Ganhe Mini Creme Colgate',
            'https://cdn.dentalspeed.com/produtos/210/creme-dental-colgate-total-12-gum-30g-colgate-dentalspeed-19764a-1.jpg',
            'marca',
            'COLGATE',
            '99',
            'https://cdn.dentalspeed.com/home/jun-23/home/brindes/26-06/desktop-pagina-brinde-fashion-week-creme-DS.png'
        ));
        carrinho.promocoes.push(this.criarRegraBrinde(
            prioridade,
            'Gorro - FUN WORK',
            'Compre R$ 399,99 na marca FUN WORK e Ganhe Gorro',
            'https://cdn.dentalspeed.com/produtos/210/gorro-tradicional-gabardine-branco-fun18033a.jpg',
            'marca',
            'FUN WORK',
            '399',
            'https://cdn.dentalspeed.com/home/jun-23/home/brindes/26-06/desktop-pagina-brinde-fashion-week-gorro-DS.png'
        ));
        carrinho.promocoes.push(this.criarRegraBrinde(
            prioridade,
            'Sacochila - Dra. Cherie',
            'Compre R$ 599,99 na marca Dra. Cherie e Ganhe Sacochila',
            'https://cdn.dentalspeed.com/produtos/210/brinde-sacochila-estampada-gift-dra-cherie-bdrc32587a.jpg',
            'marca',
            'DRA. CHERIE',
            '599',
            'https://cdn.dentalspeed.com/home/jun-23/home/brindes/26-06/desktop-pagina-brinde-fashion-week-sacochila-DS.png'
        ));
        carrinho.promocoes.push(this.criarRegraBrinde(
            prioridade,
            'Resina Palfique Omnichroma - PHS',
            'Compre R$ 399,99 na marca FUN WORK e Ganhe Gorro',
            'https://cdn.dentalspeed.com/produtos/210/resina-palfique-omnichroma-trial-syringe-1ml-tokuyama-dental-ds-28093a-1.jpg',
            'marca',
            'PHS',
            '399',
            'https://cdn.dentalspeed.com/home/jun-23/brindes/desktop-brinde-phs.png'
        ));
        return carrinho;
    }

    private criarRegraBrinde(
        prioridade: number,
        brinde_nome: string,
        brinde_descricao: string,
        brinde_imagem: string,
        tipo: 'marca' | 'categorias',
        valor_tipo: string,
        valor_produtos: string,
        promocao_imagem: string
    ): RegraPromocional {
        const brinde = new Produto(`BRINDE${prioridade}`, brinde_nome, 0, true);
        brinde.imagem = brinde_imagem;
        brinde.descricao = brinde_descricao;
        return new RegraPromocional(
            brinde_descricao,
            prioridade++,
            true,
            new Date(2023, 0, 1),
            new Date(2023, 11, 31),
            [
                {'tipo': tipo, 'operacao': 'igual', 'valor': valor_tipo},
                {'tipo': 'valor_itens', 'operacao': 'maior_igual', 'valor': valor_produtos}
            ],
            {'tipo': 'brinde_unico', 'valor': 1, 'brindes': [brinde]},
            '',
            promocao_imagem
        );
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
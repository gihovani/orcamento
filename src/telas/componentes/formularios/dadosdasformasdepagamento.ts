import {criarElementoHtml} from "../../../util/helper";
import {INotificacao} from "../../../contratos/componentes/notificacao";
import {ICarregando} from "../../../contratos/componentes/carregando";
import {ICarrinho} from "../../../contratos/carrinho";
import {IFormaDePagamento} from "../../../contratos/entidades/formadepagamento";
import {IApiFormasDePagamento} from "../../../contratos/servicos/apiformasdepagamento";
import {IApiBin} from "../../../contratos/servicos/apibin";
import {IFormulario} from "../../../contratos/componentes/formulario";
import {DadosDoPagamentoBoleto} from "./dadosdopagamentoboleto";
import {DadosDoPagamentoCartaoMaquineta} from "./dadosdopagamentocartaomaquineta";
import {DadosDoPagamentoCartaoDeCredito} from "./dadosdopagamentocartaodecredito";

export class DadosDaFormasDePagamento implements IFormulario {
    readonly ID: string = 'dados-da-forma-de-pagamento';
    private _div: HTMLElement;
    private _formulario: IFormulario;
    private _formularioBoleto: IFormulario;
    private _formularioCartaoMaquineta: IFormulario;
    private _formularioCartaoDeCredito: IFormulario;

    constructor(
        public elemento: HTMLElement,
        public carrinho: ICarrinho,
        public apiFormasDePagamento: IApiFormasDePagamento,
        public apiBin: IApiBin,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {
        this._div = criarElementoHtml('div');
        this._div.setAttribute('id', this.ID);

        this._formularioBoleto = new DadosDoPagamentoBoleto(this._div, this.carrinho, this.notificacao);
        this._formularioCartaoMaquineta = new DadosDoPagamentoCartaoMaquineta(this._div, this.carrinho, this.notificacao);
        this._formularioCartaoDeCredito = new DadosDoPagamentoCartaoDeCredito(this._div, this.carrinho, this.apiBin, this.notificacao);
    }

    public preencheDados(formasDePagamento: IFormaDePagamento): void {
        const input = (this._div.querySelector(`#${this.ID}-${formasDePagamento.tipo}`) as HTMLInputElement);
        if (input) {
            input.setAttribute('checked', 'true');
            this.apiFormasDePagamento.dados = formasDePagamento;
        }
    }

    public pegaDados(): IFormaDePagamento {
        return this._formulario.pegaDados();
    }

    esconder(): void {
        this._div.innerHTML = '';
    }

    mostrar(): void {
        this.esconder();
        this.htmlFormasDePagamentos();
        setTimeout(() => {
            this.htmlFormaDePagamentoSelecionada();
        }, 50);
        this.elemento.appendChild(this._div);
    }

    private htmlFormasDePagamentos(): void {
        this.apiFormasDePagamento.consultar().then((formas) => {
            formas.map((forma) => {
                this.htmlOpcaoFormaDePagamento(forma);
            });
        });
    }

    private htmlOpcaoFormaDePagamento(forma: IFormaDePagamento): void {
        const formaSelecionada = this.apiFormasDePagamento.dados;
        const div = criarElementoHtml('div', ['form-check']);
        const input = criarElementoHtml('input', ['form-check-input']);
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'forma-pagamento');
        input.setAttribute('id', `${this.ID}-${forma.tipo}`)
        input.setAttribute('value', forma.tipo);
        if (forma.tipo === formaSelecionada.tipo) {
            input.setAttribute('checked', 'checked');
        }
        input.addEventListener('change', (event) => {
            event.preventDefault();
            this.apiFormasDePagamento.dados = forma;
            this.htmlFormaDePagamentoSelecionada();
        });
        div.appendChild(input);

        const label = criarElementoHtml('label', ['form-check-label']);
        label.innerHTML = `${forma.tipo}`;
        label.setAttribute('for', `${this.ID}-${forma.tipo}`);
        div.appendChild(label);
        this._div.appendChild(div);
    }

    private htmlFormaDePagamentoSelecionada(): void {
        const formaSelecionada = this.apiFormasDePagamento.dados;
        this._formularioBoleto.esconder();
        this._formularioCartaoMaquineta.esconder();
        this._formularioCartaoDeCredito.esconder();

        if (formaSelecionada.tipo === 'Boleto') {
            this._formulario = this._formularioBoleto;
        } else if (formaSelecionada.tipo === 'Cartão Maquineta') {
            this._formulario = this._formularioCartaoMaquineta;
        } else if (formaSelecionada.tipo === 'Cartão De Crédito') {
            this._formulario = this._formularioCartaoDeCredito;
        }
        this._formulario.mostrar();
    }
}

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
    private _formulario: IFormulario;

    constructor(
        public elemento: HTMLElement,
        public carrinho: ICarrinho,
        public apiFormasDePagamento: IApiFormasDePagamento,
        public apiBin: IApiBin,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {
    }

    public preencheDados(formasDePagamento: IFormaDePagamento): void {
        const input = (this.elemento.querySelector(`#${this.ID}-${formasDePagamento.tipo}`) as HTMLInputElement);
        if (input) {
            input.setAttribute('checked', 'true');
            this.apiFormasDePagamento.dados = formasDePagamento;
        }
    }

    public pegaDados(): IFormaDePagamento {
        return this._formulario.pegaDados();
    }

    mostrar(): void {
        this.elemento.querySelector('#' + this.ID)?.remove();
        const div = criarElementoHtml('div');
        div.setAttribute('id', this.ID);

        this.htmlFormasDePagamentos(div);
        setTimeout(() => {
            this.htmlFormaDePagamentoSelecionada(div);
        }, 50);
        this.elemento.appendChild(div);
    }

    private htmlFormasDePagamentos(div: HTMLElement): void {
        div.innerHTML = '';
        this.apiFormasDePagamento.consultar().then((formas) => {
            formas.map((forma) => {
                this.htmlOpcaoFormaDePagamento(div, forma);
            });
        });
    }

    private htmlOpcaoFormaDePagamento(divPai: HTMLElement, forma: IFormaDePagamento): void {
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
            this.htmlFormaDePagamentoSelecionada(divPai);
        });
        div.appendChild(input);

        const label = criarElementoHtml('label', ['form-check-label']);
        label.innerHTML = `${forma.tipo}`;
        label.setAttribute('for', `${this.ID}-${forma.tipo}`);
        div.appendChild(label);
        divPai.appendChild(div);
    }

    private htmlFormaDePagamentoSelecionada(divPai: HTMLElement): void {
        divPai.querySelector(`#${this.ID}-selecionada`)?.remove();

        const formaSelecionada = this.apiFormasDePagamento.dados;
        const div = criarElementoHtml('div');
        div.setAttribute('id', `${this.ID}-selecionada`);

        if (formaSelecionada.tipo === 'Boleto') {
            this._formulario = new DadosDoPagamentoBoleto(div, this.carrinho, this.notificacao);
        } else if (formaSelecionada.tipo === 'Cartão Maquineta') {
            this._formulario = new DadosDoPagamentoCartaoMaquineta(div, this.carrinho, this.notificacao);
        } else if (formaSelecionada.tipo === 'Cartão De Crédito') {
            this._formulario = new DadosDoPagamentoCartaoDeCredito(div, this.carrinho, this.apiBin, this.notificacao);
        }
        this._formulario.mostrar();
        divPai.appendChild(div);
    }
}

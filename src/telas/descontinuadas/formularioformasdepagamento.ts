import {criarElementoHtml} from "../../util/helper";
import {ITela} from "../../contratos/tela";
import {INotificacao} from "../../contratos/componentes/notificacao";
import {ICarrinho} from "../../contratos/carrinho";
import {Boleto} from "../../entidades/formadepagamento";
import {IApiFormasDePagamento} from "../../contratos/servicos/apiformasdepagamento";
import {IFormaDePagamento} from "../../contratos/entidades/formadepagamento";
import {IFormulario} from "../../contratos/componentes/formulario";
import {DadosDoPagamentoBoleto} from "../componentes/formularios/dadosdopagamentoboleto";
import {DadosDoPagamentoCartaoMaquineta} from "../componentes/formularios/dadosdopagamentocartaomaquineta";
import {DadosDoPagamentoCartaoDeCredito} from "../componentes/formularios/dadosdopagamentocartaodecredito";
import {IApiBin} from "../../contratos/servicos/apibin";

export class FormularioFormasDePagamento implements ITela {
    readonly ID = 'gg2';

    constructor(
        public carrinho: ICarrinho,
        public apiFormasDePagamento: IApiFormasDePagamento,
        public apiBin: IApiBin,
        public notificacao: INotificacao
    ) {
    }

    conteudo(): HTMLElement {
        const div = criarElementoHtml('div');
        div.setAttribute('id', 'html-formas-de-pagamento');
        this.htmlFormasDePagamentos(div);
        setTimeout(() => {
            this.htmlFormaDePagamentoSelecionada(div);
        }, 50);
        return div
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
        const formaSelecionada = this.apiFormasDePagamento.dados;
        document.querySelector(`#${this.ID}-selecionada`)?.remove();
        const div = criarElementoHtml('div');
        div.setAttribute('id', `${this.ID}-selecionada`);
        let formulario: IFormulario;
        if (formaSelecionada.tipo === 'Boleto') {
            formulario = new DadosDoPagamentoBoleto(div, this.carrinho, this.notificacao);
        } else if (formaSelecionada.tipo === 'Cartão Maquineta') {
            formulario = new DadosDoPagamentoCartaoMaquineta(div, this.carrinho, this.notificacao);
        } else if (formaSelecionada.tipo === 'Cartão De Crédito') {
            formulario = new DadosDoPagamentoCartaoDeCredito(div, this.carrinho, this.apiBin, this.notificacao);
        }
        formulario.mostrar();
        divPai.appendChild(div);
    }
}
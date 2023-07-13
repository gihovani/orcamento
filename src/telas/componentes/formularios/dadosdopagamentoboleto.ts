import {criarElementoHtml, formataNumeroEmDinheiro} from "../../../util/helper";
import {INotificacao} from "../../../contratos/componentes/notificacao";
import {ICarrinho} from "../../../contratos/carrinho";
import {Boleto} from "../../../entidades/formadepagamento";
import {IFormulario} from "../../../contratos/componentes/formulario";

export class DadosDoPagamentoBoleto implements IFormulario {
    readonly ID: string = 'dados-do-pagamento-boleto';

    constructor(
        public elemento: HTMLElement,
        public carrinho: ICarrinho,
        public notificacao: INotificacao
    ) {
    }

    preencheDados(boleto: Boleto): void {
        (this.elemento.querySelector(`#${this.ID}-parcelamento`) as HTMLInputElement).value = String(boleto.parcelamento);
    }

    pegaDados(): Boleto {
        const parcelamento = (this.elemento.querySelector(`#${this.ID}-parcelamento`) as HTMLInputElement)?.value;
        return new Boleto(parseInt(parcelamento));
    }

    esconder(): void {
        this.elemento.querySelector('#' + this.ID)?.remove();
    }

    mostrar(): void {
        this.esconder();
        const div = criarElementoHtml('div', ['row']);
        div.setAttribute('id', this.ID);
        div.innerHTML = `<h3 class="h4 mb-1 mt-1 fw-normal">Boleto</h3>
<div class="mb-1 col-12">
    <label class="form-label mb-0" for="${this.ID}-parcelamento">Número de Parcelas</label>
    <select class="form-select" id="${this.ID}-parcelamento" required></select>
    <small class="text-muted">Número de Parcelas.</small>
</div>`;
        const total = this.carrinho.totalizador?.valor_total || 0;
        const maximoParcelas = new Boleto().numeroParcelasDisponiveis(total);
        const parcelamento = div.querySelector(`#${this.ID}-parcelamento`);
        for (let parcelas = 1; parcelas <= maximoParcelas; parcelas++) {
            const options = criarElementoHtml('option', []);
            options.setAttribute('value', String(parcelas));
            options.setAttribute('label', `${parcelas}x R$ ${formataNumeroEmDinheiro(total / parcelas)}`);
            parcelamento.appendChild(options)
        }
        this.elemento.appendChild(div);
    }
}
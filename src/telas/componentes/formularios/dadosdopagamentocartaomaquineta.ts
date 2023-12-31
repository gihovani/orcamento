import {criarElementoHtml, formataNumeroEmDinheiro} from "../../../util/helper";
import {INotificacao} from "../../../contratos/componentes/notificacao";
import {ICarrinho} from "../../../contratos/carrinho";
import {CartaoMaquineta} from "../../../entidades/formadepagamento";
import {IFormulario} from "../../../contratos/componentes/formulario";

export class DadosDoPagamentoCartaoMaquineta implements IFormulario {
    readonly ID: string = 'dados-do-pagamento-cartao-maquineta';

    constructor(
        public elemento: HTMLElement,
        public carrinho: ICarrinho,
        public notificacao: INotificacao
    ) {
    }

    preencheDados(dados: CartaoMaquineta): void {
        (this.elemento.querySelector(`#${this.ID}-parcelamento`) as HTMLInputElement).value = String(dados.parcelamento);
        (this.elemento.querySelector(`#${this.ID}-bandeira`) as HTMLInputElement).value = dados.bandeira;
        (this.elemento.querySelector(`#${this.ID}-codigo_nsu`) as HTMLInputElement).value = dados.codigo_nsu;
        (this.elemento.querySelector(`#${this.ID}-codigo_autorizacao`) as HTMLInputElement).value = dados.codigo_autorizacao;
    }

    pegaDados(): CartaoMaquineta {
        const form = this.elemento;
        const parcelamento = (form.querySelector(`#${this.ID}-parcelamento`) as HTMLInputElement)?.value;
        const bandeira = (form.querySelector(`#${this.ID}-bandeira`) as HTMLInputElement)?.value;
        const codigo_nsu = (form.querySelector(`#${this.ID}-codigo_nsu`) as HTMLInputElement)?.value;
        const codigo_autorizacao = (form.querySelector(`#${this.ID}-codigo_autorizacao`) as HTMLInputElement)?.value;
        return new CartaoMaquineta(parseInt(parcelamento), bandeira, codigo_nsu, codigo_autorizacao);
    }

    esconder(): void {
        this.elemento.querySelector('#' + this.ID)?.remove();
    }

    mostrar(): void {
        this.esconder();
        const div = criarElementoHtml('div', ['row']);
        div.setAttribute('id', this.ID);
        div.innerHTML = `<h3 class="h4 mb-1 mt-1 fw-normal">Cartão Maquineta</h3>
<div class="col-md-6 mb-1">
  <label for="${this.ID}-parcelamento" class="form-label mb-0">Número de Parcelas</label>
  <select class="form-select" id="${this.ID}-parcelamento" required></select>
</div>
<div class="col-md-6 mb-1">
  <label for="${this.ID}-bandeira" class="form-label mb-0">Bandeira do Cartão</label>
  <select class="form-select" id="${this.ID}-bandeira" required>
    <option value="VISA">VISA</option>
    <option value="MASTERCARD">MASTERCARD</option>
    <option value="ELO">ELO</option>
    <option value="HIPERCARD">HIPERCARD</option>
    <option value="AMEX">AMERICAN EXPRESS</option>
  </select>
  <div class="invalid-feedback">A bandeira do cartão de crédito é obrigatório.</div>
</div>
<div class="col-md-6 mb-1">
  <label for="${this.ID}-codigo_nsu" class="form-label mb-0">Código NSU</label>
  <input type="text" class="form-control" id="${this.ID}-codigo_nsu" required>
  <small class="text-muted">Código NSU Impresso no Comprovante.</small>
  <div class="invalid-feedback">O Código NSU que está no comprovante é obrigatório.</div>
</div>
<div class="col-md-6 mb-1">
  <label for="${this.ID}-codigo_autorizacao" class="form-label mb-0">Código Autorização</label>
  <input type="text" class="form-control" id="${this.ID}-codigo_autorizacao" required>
  <small class="text-muted">Código Autorização Impresso no Comprovante.</small>
  <div class="invalid-feedback">O Código Autorização que está no comprovante é obrigatório.</div>
</div>`;
        const total = this.carrinho.totalizador?.valor_total || 0;
        const maximoParcelas = new CartaoMaquineta().numeroParcelasDisponiveis(total);
        const parcelamento = div.querySelector(`#${this.ID}-parcelamento`);
        for (let parcelas = 1; parcelas <= maximoParcelas; parcelas++) {
            const options = criarElementoHtml('option', [], [{nome: 'value', valor: String(parcelas)}, {
                nome: 'label',
                valor: `${parcelas}x R$ ${formataNumeroEmDinheiro(total / parcelas)}`
            }]);
            parcelamento.appendChild(options)
        }
        this.elemento.appendChild(div);
    }
}
import {criarElementoHtml, formataNumeroEmDinheiro} from "../../../util/helper";
import {INotificacao} from "../../../contratos/componentes/notificacao";
import {IApiBin} from "../../../contratos/servicos/apibin";
import {ICarrinho} from "../../../contratos/carrinho";
import {CartaoDeCredito} from "../../../entidades/formadepagamento";
import {IFormulario} from "../../../contratos/componentes/formulario";

export class DadosDoPagamentoCartaoDeCredito implements IFormulario {
    readonly ID: string = 'dados-do-pagamento-cartao-de-credito';

    constructor(
        public elemento: HTMLElement,
        public carrinho: ICarrinho,
        public apiBin: IApiBin,
        public notificacao: INotificacao
    ) {
    }

    preencheDados(dados: CartaoDeCredito): void {
        const [data_expiracao_mes, data_expiracao_ano] = dados.data_expiracao.split('/');
        (this.elemento.querySelector(`#${this.ID}-parcelamento`) as HTMLInputElement).value = String(dados.parcelamento);
        (this.elemento.querySelector(`#${this.ID}-bandeira`) as HTMLInputElement).value = dados.bandeira;
        (this.elemento.querySelector(`#${this.ID}-nome`) as HTMLInputElement).value = dados.nome;
        (this.elemento.querySelector(`#${this.ID}-data_expiracao_mes`) as HTMLInputElement).value = data_expiracao_mes;
        (this.elemento.querySelector(`#${this.ID}-data_expiracao_ano`) as HTMLInputElement).value = data_expiracao_ano;
        (this.elemento.querySelector(`#${this.ID}-codigo_verificacao`) as HTMLInputElement).value = dados.codigo_verificacao;
        (this.elemento.querySelector(`#${this.ID}-numero`) as HTMLInputElement).value = dados.numero;
    }

    pegaDados(): CartaoDeCredito {
        const form = this.elemento;
        const parcelamento = (form.querySelector(`#${this.ID}-parcelamento`) as HTMLInputElement)?.value;
        const bandeira = (form.querySelector(`#${this.ID}-bandeira`) as HTMLInputElement)?.value;
        const nome = (form.querySelector(`#${this.ID}-nome`) as HTMLInputElement)?.value;
        const data_expiracao_mes = (form.querySelector(`#${this.ID}-data_expiracao_mes`) as HTMLInputElement)?.value;
        const data_expiracao_ano = (form.querySelector(`#${this.ID}-data_expiracao_ano`) as HTMLInputElement)?.value;
        const codigo_verificacao = (form.querySelector(`#${this.ID}-codigo_verificacao`) as HTMLInputElement)?.value;
        const numero = (form.querySelector(`#${this.ID}-numero`) as HTMLInputElement)?.value;
        const data_expiracao = (parseInt(data_expiracao_mes) > 10) ? `${data_expiracao_mes}/${data_expiracao_ano}` : `0${data_expiracao_mes}/${data_expiracao_ano}`;
        return new CartaoDeCredito(parseInt(parcelamento), bandeira, nome, numero, data_expiracao, codigo_verificacao);
    }

    mostrar(): void {
        this.elemento.querySelector(`#${this.ID}`)?.remove();
        const div = criarElementoHtml('div', ['row']);
        div.setAttribute('id', this.ID);
        div.innerHTML = `<h3 class="h4 mb-3 fw-normal">Cartão de Crédito</h3>
<div class="col-md-4 mb-3">
  <label for="${this.ID}-parcelamento">Número de Parcelas</label>
  <select class="form-select" id="${this.ID}-parcelamento" required></select>
  <small class="text-muted">Número de Parcelas.</small>
</div>
<div class="col-md-8 mb-3">
  <label for="${this.ID}-numero">Número do cartão de crédito</label>
  <input type="text" class="form-control" id="${this.ID}-numero" placeholder="Número do cartão de crédito" required maxlength="16">
  <div class="invalid-feedback">O número do cartão de crédito é obrigatório.</div>
</div>
<div class="col-md-4 mb-3">
  <label for="${this.ID}-bandeira">Bandeira do Cartão</label>
  <select class="form-select" id="${this.ID}-bandeira" required>
    <option value="VISA">VISA</option>
    <option value="MASTERCARD">MASTERCARD</option>
    <option value="ELO">ELO</option>
    <option value="HIPERCARD">HIPERCARD</option>
    <option value="AMEX">AMERICAN EXPRESS</option>
  </select>
  <small class="text-muted">Bandeira, do seu cartão.</small>
  <div class="invalid-feedback">A bandeira do cartão de crédito é obrigatório.</div>
</div>
<div class="col-md-8 mb-3">
  <label for="${this.ID}-nome">Nome no cartão</label>
  <input type="text" class="form-control" id="${this.ID}-nome" placeholder="Nome no Cartão" required>
  <small class="text-muted">Nome completo, como mostrado no cartão.</small>
  <div class="invalid-feedback">O nome que está no cartão é obrigatório.</div>
</div>
<div class="col-md-8 mb-3">
  <label for="${this.ID}-data_expiracao_mes">Data de expiração</label>
  <div class="input-group">
    <div class="input-group-prepend">
      <select class="form-select" id="${this.ID}-data_expiracao_mes" required>
        ${(() => {
          const options = [];
          for (let mes = 1; mes <= 12; mes++) {
            options.push(`<option value="${mes}">${mes}</option>`);
          }
          return options.join('');
        })()}
      </select>
    </div>
    <select class="form-select" id="${this.ID}-data_expiracao_ano" required>
      ${((primeiro, ultimo) => {
        const options = [];
        for (let ano = primeiro; ano < ultimo; ano++) {
          options.push(`<option value="${ano}">${ano}</option>`);
        }
        return options.join('');
      })(2023, 2050)}
    </select>
  </div>
  <div class="invalid-feedback">Data de expiração é obrigatória.</div>
</div>
<div class="col-md-4 mb-3">
  <label for="${this.ID}-codigo_verificacao">Código de Verificação</label>
  <input type="text" class="form-control" id="${this.ID}-codigo_verificacao" placeholder="Código de Verificação" required maxlength="4">
  <div class="invalid-feedback">Código de segurança é obrigatório.</div>
</div>`;
        const total = this.carrinho.totalizador?.valor_total || 0;
        const maximoParcelas = new CartaoDeCredito().numeroParcelasDisponiveis(total);
        const parcelamento = div.querySelector(`#${this.ID}-parcelamento`);
        for (let parcelas = 1; parcelas <= maximoParcelas; parcelas++) {
            const options = criarElementoHtml('option');
            options.setAttribute('value', String(parcelas));
            options.setAttribute('label', `${parcelas}x R$ ${formataNumeroEmDinheiro(total / parcelas)}`);
            parcelamento.appendChild(options)
        }
        div.querySelector(`#${this.ID}-numero`)?.addEventListener('keyup', (e) => {
            const numero = (e.target as HTMLInputElement).value;
            if (numero.length >= 14) {
                this.apiBin.consultar(numero).then((bandeira) => {
                    (div.querySelector(`#${this.ID}-bandeira`) as HTMLSelectElement).value = bandeira;
                });
            }
        });
        this.elemento.appendChild(div);
    }
}
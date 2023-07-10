import {criarElementoHtml, formataNumeroEmDinheiro} from "../../../util/helper";
import {INotificacao} from "../../../contratos/componentes/notificacao";
import {ICarrinho} from "../../../contratos/carrinho";
import {CartaoMaquineta} from "../../../entidades/formadepagamento";
import {IFormulario} from "../../../contratos/componentes/formulario";

export class DadosDoPagamentoCartaoMaquineta implements IFormulario {
    constructor(
        public elemento: HTMLElement,
        public carrinho: ICarrinho,
        public notificacao: INotificacao
    ) {
    }

    preencheDados(dados: CartaoMaquineta): void {
        (this.elemento.querySelector('#parcelamento') as HTMLInputElement).value = String(dados.parcelamento);
        (this.elemento.querySelector('#bandeira') as HTMLInputElement).value = dados.bandeira;
        (this.elemento.querySelector('#codigo_nsu') as HTMLInputElement).value = dados.codigo_nsu;
        (this.elemento.querySelector('#codigo_autorizacao') as HTMLInputElement).value = dados.codigo_autorizacao;
    }

    pegaDados(): CartaoMaquineta {
        const form = this.elemento;
        const parcelamento = (form.querySelector('#parcelamento') as HTMLInputElement)?.value;
        const bandeira = (form.querySelector('#bandeira') as HTMLInputElement)?.value;
        const codigo_nsu = (form.querySelector('#codigo_nsu') as HTMLInputElement)?.value;
        const codigo_autorizacao = (form.querySelector('#codigo_autorizacao') as HTMLInputElement)?.value;
        return new CartaoMaquineta(parseInt(parcelamento), bandeira, codigo_nsu, codigo_autorizacao);
    }

    mostrar(): HTMLElement {
        const main = criarElementoHtml('main', ['row']);
        main.innerHTML = `<form class="p-5 rounded mt-3 mb-3 m-auto needs-validation" autocomplete="off">
  <h1 class="h3 mb-3 fw-normal">Cartão de Crédito Maquineta</h1>
  <div class="row">
    <div class="col-md-3 mb-3">
      <label for="parcelamento">Número de Parcelas</label>
      <select class="form-select" id="parcelamento" required></select>
      <small class="text-muted">Número de Parcelas.</small>
    </div>
    <div class="col-md-3 mb-3">
      <label for="bandeira">Bandeira do Cartão</label>
      <select class="form-select" id="bandeira" required>
        <option value="VISA">VISA</option>
        <option value="MASTERCARD">MASTERCARD</option>
        <option value="ELO">ELO</option>
        <option value="HIPERCARD">HIPERCARD</option>
        <option value="AMEX">AMERICAN EXPRESS</option>
      </select>
      <small class="text-muted">Nome completo, como mostrado no cartão.</small>
      <div class="invalid-feedback">A bandeira do cartão de crédito é obrigatório.</div>
    </div>
    <div class="col-md-3 mb-3">
      <label for="codigo_nsu">Código NSU</label>
      <input type="text" class="form-control" id="codigo_nsu" placeholder="Código NSU" required>
      <small class="text-muted">Código NSU Impresso no Comprovante.</small>
      <div class="invalid-feedback">O Código NSU que está no comprovante é obrigatório.</div>
    </div>
    <div class="col-md-3 mb-3">
      <label for="codigo_autorizacao">Código Autorização</label>
      <input type="text" class="form-control" id="codigo_autorizacao" placeholder="Código Autorização" required>
      <small class="text-muted">Código Autorização Impresso no Comprovante.</small>
      <div class="invalid-feedback">O Código Autorização que está no comprovante é obrigatório.</div>
    </div>
  </div>
  <button type="submit" class="btn btn-primary">SALVAR</button>
</form>`;
        const total = this.carrinho.totalizador?.valor_total || 0;
        const maximoParcelas = new CartaoMaquineta().numeroParcelasDisponiveis(total);
        const parcelamento = main.querySelector('#parcelamento');
        for (let parcelas = 1; parcelas <= maximoParcelas; parcelas++) {
            const options = criarElementoHtml('option', [], [{nome: 'value', valor: String(parcelas)}, {
                nome: 'label',
                valor: `${parcelas}x R$ ${formataNumeroEmDinheiro(total / parcelas)}`
            }]);
            parcelamento.appendChild(options)
        }
        const form = main.querySelector('form') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const cartaoDeCredito = this.pegaDados();
                this.notificacao.mostrar('Sucesso', `Os Dados do Cartão de Crédito (${cartaoDeCredito.bandeira}) Foram Salvos!`, 'success');
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
            }

        });
        return main;
    }
}
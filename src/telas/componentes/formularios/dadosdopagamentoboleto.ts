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
        (this.elemento.querySelector('#parcelamento') as HTMLInputElement).value = String(boleto.parcelamento);
    }

    pegaDados(): Boleto {
        const parcelamento = (this.elemento.querySelector('#parcelamento') as HTMLInputElement)?.value;
        return new Boleto(parseInt(parcelamento));
    }

    mostrar(): void {
        const main = criarElementoHtml('main', ['row']);
        main.innerHTML = `<form class="p-5 rounded mt-3 mb-3 m-auto needs-validation" autocomplete="off">
  <h1 class="h3 mb-3 fw-normal">Boleto Parcelado</h1>
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="parcelamento">Número de Parcelas</label>
      <select class="form-select" id="parcelamento" required></select>
      <small class="text-muted">Número de Parcelas.</small>
    </div>
  </div>
  <button type="submit" class="btn btn-primary">SALVAR</button>
</form>`;
        const total = this.carrinho.totalizador?.valor_total || 0;
        const maximoParcelas = new Boleto().numeroParcelasDisponiveis(total);
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
                const boleto = this.pegaDados();
                this.notificacao.mostrar('Sucesso', `Os Dados do (${boleto.tipo}) Foram Salvos!`);
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
            }
        });
        this.elemento.appendChild(main);
    }
}
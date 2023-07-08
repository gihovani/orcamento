import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ITela} from "../contratos/tela";
import {INotificacao} from "../contratos/componentes/notificacao";
import {IApiParcelamento} from "../contratos/servicos/apiparcelamento";
import {ICarrinho} from "../contratos/carrinho";
import {Boleto} from "../entidades/formadepagamento";

export class FormularioPagamentoBoletoParcelado implements ITela {
    constructor(
        public carrinho: ICarrinho,
        public apiParcelamento: IApiParcelamento,
        public notificacao: INotificacao
    ) {
    }

    public pegaDadosDoFormulario(form: HTMLFormElement): Boleto {
        const parcelamento = (form.querySelector('#parcelamento') as HTMLInputElement)?.value;
        return new Boleto(parseInt(parcelamento));
    }

    conteudo(): HTMLElement {
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
        this.apiParcelamento.consultar('boleto', this.carrinho).then((maximoParcelas) => {
            const parcelamento = main.querySelector('#parcelamento');
            const total = this.carrinho.totalizador?.valor_total || 0;
            for (let parcelas = 1; parcelas <= maximoParcelas; parcelas++) {
                const options = criarElementoHtml('option', [], [{nome: 'value', valor: String(parcelas)}, {
                    nome: 'label',
                    valor: `${parcelas}x R$ ${formataNumeroEmDinheiro(total/parcelas)}`
                }]);
                parcelamento.appendChild(options)
            }
        });
        const form = main.querySelector('form') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const boletoParcelado = this.pegaDadosDoFormulario(form);
            this.notificacao.mostrar('Sucesso', `Os Dados do Boleto Parcelado em (${boletoParcelado.parcelamento})x Foi Salvo!`);
        });
        return main;
    }
}
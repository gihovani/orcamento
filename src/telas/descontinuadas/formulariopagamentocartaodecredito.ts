import {criarElementoHtml, formataNumeroEmDinheiro} from "../../util/helper";
import {ITela} from "../../contratos/tela";
import {INotificacao} from "../../contratos/componentes/notificacao";
import {IApiBin} from "../../contratos/servicos/apibin";
import {ICarrinho} from "../../contratos/carrinho";
import {CartaoDeCredito} from "../../entidades/formadepagamento";

export class FormularioPagamentoCartaoDeCredito implements ITela {
    constructor(
        public carrinho: ICarrinho,
        public apiBin: IApiBin,
        public notificacao: INotificacao
    ) {
    }

    private pegaDadosDoFormulario(form: HTMLFormElement): CartaoDeCredito {
        const parcelamento = (form.querySelector('#parcelamento') as HTMLInputElement)?.value;
        const bandeira = (form.querySelector('#bandeira') as HTMLInputElement)?.value;
        const nome = (form.querySelector('#nome') as HTMLInputElement)?.value;
        const data_expiracao_mes = (form.querySelector('#data_expiracao_mes') as HTMLInputElement)?.value;
        const data_expiracao_ano = (form.querySelector('#data_expiracao_ano') as HTMLInputElement)?.value;
        const codigo_verificacao = (form.querySelector('#codigo_verificacao') as HTMLInputElement)?.value;
        const numero = (form.querySelector('#numero') as HTMLInputElement)?.value;
        const data_expiracao = (parseInt(data_expiracao_mes) > 10) ? `${data_expiracao_mes}/${data_expiracao_ano}` : `0${data_expiracao_mes}/${data_expiracao_ano}`;
        return new CartaoDeCredito(parseInt(parcelamento), bandeira, nome, numero, data_expiracao, codigo_verificacao);
    }

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main', ['row']);
        main.innerHTML = `<form class="p-5 rounded mt-3 mb-3 m-auto needs-validation" autocomplete="off">
  <h1 class="h3 mb-3 fw-normal">Cartão de Crédito</h1>
  <div class="row">
    <div class="col-md-2 mb-3">
      <label for="parcelamento">Número de Parcelas</label>
      <select class="form-select" id="parcelamento" required></select>
      <small class="text-muted">Número de Parcelas.</small>
    </div>
    <div class="col-md-6 mb-3">
      <label for="numero">Número do cartão de crédito</label>
      <input type="text" class="form-control" id="numero" placeholder="Número do cartão de crédito" required>
      <div class="invalid-feedback">O número do cartão de crédito é obrigatório.</div>
    </div>
    <div class="col-md-2 mb-3">
      <label for="data_expiracao_mes">Data de expiração</label>
      <div class="input-group">
        <div class="input-group-prepend">
          <select class="form-select" id="data_expiracao_mes" required>
          ${(() => {
            const options = [];
            for (let mes = 1; mes <= 12; mes++) {
                options.push(`<option value="${mes}">${mes}</option>`);
            }
            return options.join('');
        })()}
          </select>
        </div>
        <select class="form-select" id="data_expiracao_ano" required>
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
    <div class="col-md-2 mb-3">
      <label for="codigo_verificacao">Código de Verificação</label>
      <input type="text" class="form-control" id="codigo_verificacao" placeholder="Código de Verificação" required maxlength="4">
      <div class="invalid-feedback">Código de segurança é obrigatório.</div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 mb-3">
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
    <div class="col-md-6 mb-3">
      <label for="nome">Nome no cartão</label>
      <input type="text" class="form-control" id="nome" placeholder="Nome no Cartão" required>
      <small class="text-muted">Nome completo, como mostrado no cartão.</small>
      <div class="invalid-feedback">O nome que está no cartão é obrigatório.</div>
    </div>
  </div>
  <button type="submit" class="btn btn-primary">SALVAR</button>
</form>`;
        const total = this.carrinho.totalizador?.valor_total || 0;
        const maximoParcelas = new CartaoDeCredito().numeroParcelasDisponiveis(total);
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
                const cartaoDeCredito = this.pegaDadosDoFormulario(form);
                this.notificacao.mostrar('Sucesso', `Os Dados do Cartão de Crédito (${cartaoDeCredito.bandeira}) Foram Salvos!`, 'success');
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
            }
        });
        form.querySelector('#numero')?.addEventListener('change', (e) => {
            const numero = (e.target as HTMLInputElement).value;
            if (numero.length >= 14) {
                this.apiBin.consultar(numero).then((bandeira) => {
                    (form.querySelector('#bandeira') as HTMLSelectElement).value = bandeira;
                });
            }
        });
        return main;
    }
}
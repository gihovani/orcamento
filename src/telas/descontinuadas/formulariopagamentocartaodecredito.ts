import {criarElementoHtml} from "../../util/helper";
import {ITela} from "../../contratos/tela";
import {INotificacao} from "../../contratos/componentes/notificacao";
import {IApiBin} from "../../contratos/servicos/apibin";
import {ICarrinho} from "../../contratos/carrinho";
import {DadosDoPagamentoCartaoDeCredito} from "../componentes/formularios/dadosdopagamentocartaodecredito";

export class FormularioPagamentoCartaoDeCredito implements ITela {
    constructor(
        public carrinho: ICarrinho,
        public apiBin: IApiBin,
        public notificacao: INotificacao
    ) {
    }

    conteudo(): HTMLElement {
        const form = criarElementoHtml('form', ['needs-validation']);
        form.setAttribute('autocomplete', 'off');

        const formulario = new DadosDoPagamentoCartaoDeCredito(form, this.carrinho, this.apiBin, this.notificacao);
        formulario.mostrar();

        const button = criarElementoHtml('button', ['btn', 'btn-primary'], [{nome: 'type', valor: 'submit'}], 'SALVAR');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const cartaoDeCredito = formulario.pegaDados();
                this.notificacao.mostrar('Sucesso', `Os Dados do Cartão de Crédito (${cartaoDeCredito.bandeira}) Foram Salvos!`, 'success');
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
            }
        });
        form.appendChild(button);
        return form;
    }
}
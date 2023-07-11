import {criarElementoHtml} from "../../util/helper";
import {ITela} from "../../contratos/tela";
import {INotificacao} from "../../contratos/componentes/notificacao";
import {ICarrinho} from "../../contratos/carrinho";
import {DadosDoPagamentoBoleto} from "../componentes/formularios/dadosdopagamentoboleto";

export class FormularioPagamentoBoletoParcelado implements ITela {
    constructor(
        public carrinho: ICarrinho,
        public notificacao: INotificacao
    ) {
    }

    conteudo(): HTMLElement {
        const form = criarElementoHtml('form', ['needs-validation']);
        form.setAttribute('autocomplete', 'off');

        const formulario = new DadosDoPagamentoBoleto(form, this.carrinho, this.notificacao);
        formulario.mostrar();

        const button = criarElementoHtml('button', ['btn', 'btn-primary'], [{nome: 'type', valor: 'submit'}], 'SALVAR');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const boleto = formulario.pegaDados();
                this.notificacao.mostrar('Sucesso', `Os Dadossss do (${boleto.tipo}) Foram Salvos!`, 'success');
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
            }
        });
        form.appendChild(button);
        return form;
    }
}
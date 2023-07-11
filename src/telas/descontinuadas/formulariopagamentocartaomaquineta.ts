import {criarElementoHtml} from "../../util/helper";
import {ITela} from "../../contratos/tela";
import {INotificacao} from "../../contratos/componentes/notificacao";
import {ICarrinho} from "../../contratos/carrinho";
import {DadosDoPagamentoCartaoMaquineta} from "../componentes/formularios/dadosdopagamentocartaomaquineta";

export class FormularioPagamentoCartaoMaquineta implements ITela {
    constructor(public carrinho: ICarrinho, public notificacao: INotificacao) {
    }

    conteudo(): HTMLElement {
        const form = criarElementoHtml('form', ['needs-validation']);
        form.setAttribute('autocomplete', 'off');

        const formulario = new DadosDoPagamentoCartaoMaquineta(form, this.carrinho, this.notificacao);
        formulario.mostrar();

        const button = criarElementoHtml('button', ['btn', 'btn-primary'], [{nome: 'type', valor: 'submit'}], 'SALVAR');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const cartaoDeCredito = formulario.pegaDados();
                this.notificacao.mostrar('Sucesso', `Os Dados do Cartão Maquineta (${cartaoDeCredito.codigo_nsu}) Foram Salvos!`, 'success');
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
            }
        });
        form.appendChild(button);
        return form;
    }
}
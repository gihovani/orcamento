import {ITela} from "../contratos/tela";
import {criarElementoHtml} from "../util/helper";
import {IApiCliente} from "../contratos/servicos/apicliente";
import {INotificacao} from "../contratos/componentes/notificacao";
import {ICarregando} from "../contratos/componentes/carregando";
import {DadosDoCliente} from "./componentes/dadosdocliente";

export class FormularioCliente implements ITela {
    constructor(
        public apiCliente: IApiCliente,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {
    }


    conteudo(): HTMLElement {
        const form = criarElementoHtml('form');
        const dadosDoCliente = new DadosDoCliente(form, this.apiCliente, this.carregando);
        dadosDoCliente.mostrar();

        const button = criarElementoHtml('button', ['btn', 'btn-primary'], [{nome: 'type', valor: 'submit'}], 'SALVAR');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.carregando.mostrar();
            try {
                const dados = dadosDoCliente.pegaDados();
                this.apiCliente.salvar(dados).then(() => {
                    this.notificacao.mostrar('Sucesso', `Os Dados do Cliente ${dados.nome} Foram Salvos!`, 'success');
                })
                    .catch(error => this.notificacao.mostrar('Erro', error, 'danger'))
                    .finally(() => this.carregando.esconder());
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
                this.carregando.esconder()
            }
        });
        form.append(button);
        return form;
    }
}
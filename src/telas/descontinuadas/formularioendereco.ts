import {criarElementoHtml} from "../../util/helper";
import {IApiCep} from "../../contratos/servicos/apicep";
import {ITela} from "../../contratos/tela";
import {INotificacao} from "../../contratos/componentes/notificacao";
import {ICarregando} from "../../contratos/componentes/carregando";
import {DadosDoEndereco} from "../componentes/formularios/dadosdoendereco";

export class FormularioEndereco implements ITela {
    constructor(
        public apiCep: IApiCep,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {
    }

    conteudo(): HTMLElement {
        const form = criarElementoHtml('form', ['needs-validation']);
        form.setAttribute('autocomplete', 'off');
        const dadosDoEndereco = new DadosDoEndereco(form, this.apiCep, this.notificacao, this.carregando);
        dadosDoEndereco.mostrar();

        const button = criarElementoHtml('button', ['btn', 'btn-primary'], [{nome: 'type', valor: 'submit'}], 'SALVAR');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.carregando.mostrar();
            try {
                const dados = dadosDoEndereco.pegaDados();
                this.notificacao.mostrar('Sucesso', `Os Dados do Endereço ${dados.cep} Foram Salvos!`, 'success');
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
            }
            this.carregando.esconder();
        });
        form.appendChild(button);
        return form;
    }
}
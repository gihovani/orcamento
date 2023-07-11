import {criarElementoHtml, formataNumeroEmDinheiro} from "../../../util/helper";
import {INotificacao} from "../../../contratos/componentes/notificacao";
import {IApiFormasDeEntrega} from "../../../contratos/servicos/apiformasdeentrega";
import {IFormaDeEntrega} from "../../../contratos/entidades/formadeentrega";
import {FormaDeEntrega} from "../../../entidades/formadeentrega";
import {ApiConfiguracoes} from "../../../servicos/apiconfiguracoes";
import {IApiCep} from "../../../contratos/servicos/apicep";
import {ICarregando} from "../../../contratos/componentes/carregando";
import {ICarrinho} from "../../../contratos/carrinho";
import {IEndereco} from "../../../contratos/entidades/endereco";
import {IFormulario} from "../../../contratos/componentes/formulario";
import {DadosDoEndereco} from "./dadosdoendereco";

export class DadosDaFormasDeEntrega implements IFormulario {
    readonly ID: string = 'dados-da-forma-de-entrega';
    private _formasDeEntrega: IFormaDeEntrega[];

    constructor(
        public elemento: HTMLElement,
        public carrinho: ICarrinho,
        public apiFormasDeEntrega: IApiFormasDeEntrega,
        public apiCep: IApiCep,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {
        this.formasDeEntrega = [];
    }

    set formasDeEntrega(formasDeEntrega: IFormaDeEntrega[]) {
        this._formasDeEntrega = formasDeEntrega;
    }

    get formasDeEntrega(): IFormaDeEntrega[] {
        return this._formasDeEntrega;
    }

    preencheDados(formaDeEntrega: IFormaDeEntrega): void {
        const input = (this.elemento.querySelector(`#${this.ID}-${formaDeEntrega.tipo}`) as HTMLInputElement);
        if (input) {
            input.setAttribute('checked', 'true');
            this.apiFormasDeEntrega.dados = formaDeEntrega;
        }
    }

    pegaDados(): IFormaDeEntrega {
        const dados = this.apiFormasDeEntrega.dados;
        for (const forma of this.formasDeEntrega) {
            if (forma.tipo === dados.tipo) {
                dados.valor = forma.valor;
                dados.prazodeentrega = forma.prazodeentrega;
                dados.titulo = forma.titulo;
                break;
            }
        }
        return dados;
    }

    mostrar(): void {
        this.elemento.querySelector('#' + this.ID)?.remove();
        const div = criarElementoHtml('div');
        div.setAttribute('id', this.ID);

        const dadosDoEndereco = new DadosDoEndereco(div, this.apiCep, this.notificacao, this.carregando);
        dadosDoEndereco.mostrar();
        const button = criarElementoHtml('button', ['btn', 'btn-secondary'], [{
            nome: 'type',
            valor: 'button'
        }], 'Opções de Entrega');
        div.appendChild(button);
        div.appendChild(criarElementoHtml('hr', ['mb-4']));

        const divFormasDeEntrega = criarElementoHtml('div');
        div.appendChild(divFormasDeEntrega);

        button.addEventListener('click', async (e): Promise<void> => {
            e.preventDefault();
            this.carregando.mostrar();
            try {
                const endereco = dadosDoEndereco.pegaDados();
                await this.atualizaFormasDeEntrega(divFormasDeEntrega, endereco);
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
            }
            this.carregando.esconder();
        });
        this.elemento.appendChild(div);
    }

    private htmlFormasDeEntrega(div: HTMLElement): void {
        div.innerHTML = '';
        this.formasDeEntrega.map((forma) => {
            div.appendChild(this.htmlFormaDeEntrega(forma));
        });
    }

    private async atualizaFormasDeEntrega(div: HTMLElement, endereco: IEndereco): Promise<void> {
        let formasDeEntrega = [];
        const configuracoes = ApiConfiguracoes.instancia();
        if (!configuracoes.offline) {
            this.carregando.mostrar();
            try {
                formasDeEntrega = await this.apiFormasDeEntrega.consultar(endereco, this.carrinho);
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
            }
            this.carregando.esconder();
        }
        if (configuracoes.retirada_permitida) {
            formasDeEntrega.unshift(new FormaDeEntrega('no_evento', 'No Evento', 'Retirada no Local', 0));
        }
        this.formasDeEntrega = formasDeEntrega;
        this.htmlFormasDeEntrega(div);
    }

    private htmlFormaDeEntrega(forma: IFormaDeEntrega): HTMLElement {
        const formaSelecionada = this.apiFormasDeEntrega.dados;
        const div = criarElementoHtml('div', ['form-check']);
        const input = criarElementoHtml('input', ['form-check-input']);
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'forma-entrega');
        input.setAttribute('id', `${this.ID}-${forma.tipo}`)
        input.setAttribute('value', forma.tipo);
        if (forma.tipo === formaSelecionada.tipo) {
            input.setAttribute('checked', 'checked');
        }
        input.addEventListener('change', (event) => {
            event.preventDefault();
            this.apiFormasDeEntrega.dados = forma;
        });
        div.appendChild(input);

        const label = criarElementoHtml('label', ['form-check-label']);
        label.innerHTML = `${forma.titulo} - R$ ${formataNumeroEmDinheiro(forma.valor)} - ${forma.prazodeentrega}`;
        label.setAttribute('for', `${this.ID}-${forma.tipo}`);
        div.appendChild(label);
        return div;
    }
}

import {criarElementoHtml} from "../../../util/helper";
import {INotificacao} from "../../../contratos/componentes/notificacao";
import {FormaDeEntrega} from "../../../entidades/formadeentrega";
import {ApiConfiguracoes} from "../../../servicos/apiconfiguracoes";
import {ICarregando} from "../../../contratos/componentes/carregando";
import {ICarrinho} from "../../../contratos/carrinho";
import {IFormaDePagamento} from "../../../contratos/entidades/formadepagamento";
import {IApiFormasDePagamento} from "../../../contratos/servicos/apiformasdepagamento";
import {IApiBin} from "../../../contratos/servicos/apibin";
import {IFormulario} from "../../../contratos/componentes/formulario";

export class DadosDaFormasDePagamento implements IFormulario {
    readonly ID: string = 'dados-da-forma-de-pagamento';
    private _formasDePagamento: IFormaDePagamento[];

    constructor(
        public elemento: HTMLElement,
        public carrinho: ICarrinho,
        public apiFormasDePagamento: IApiFormasDePagamento,
        public apiBin: IApiBin,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {
        this.formasDePagamento = [];
    }

    set formasDePagamento(formasDePagamento: IFormaDePagamento[]) {
        this._formasDePagamento = formasDePagamento;
    }

    get formasDePagamento(): IFormaDePagamento[] {
        return this._formasDePagamento;
    }

    public preencheDados(formasDePagamento: IFormaDePagamento): void {
        const input = (this.elemento.querySelector(`#${this.ID}-${formasDePagamento.tipo}`) as HTMLInputElement);
        if (input) {
            input.setAttribute('checked', 'true');
            this.apiFormasDePagamento.dados = formasDePagamento;
        }
    }

    public pegaDados(): IFormaDePagamento | null {
        const dados = this.apiFormasDePagamento.dados;
        for (const forma of this.formasDePagamento) {
            if (forma.tipo === dados.tipo) {
                return forma;
            }
        }
        return null;
    }

    mostrar(): void {
        this.elemento.querySelector('#' + this.ID)?.remove();
        const div = criarElementoHtml('div');
        div.setAttribute('id', this.ID);

        const divFormasDeEntrega = criarElementoHtml('div');
        divFormasDeEntrega.setAttribute('id', 'html-formas-de-pagamento');
        div.appendChild(divFormasDeEntrega);
        this.atualizaFormasDePagamento(divFormasDeEntrega).then(() => {
            this.elemento.appendChild(div);
        });
    }

    private htmlFormasDeEntrega(div: HTMLElement): void {
        div.innerHTML = '';
        this.formasDePagamento.map((forma) => {
            div.appendChild(this.htmlFormaDePagamento(forma));
        });
    }

    private async atualizaFormasDePagamento(div: HTMLElement): Promise<void> {
        let formasDePagamento = [];
        const configuracoes = ApiConfiguracoes.instancia();
        if (!configuracoes.offline) {
            this.carregando.mostrar();
            try {
                formasDePagamento = await this.apiFormasDePagamento.consultar();
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
            }
            this.carregando.esconder();
        }
        if (configuracoes.retirada_permitida) {
            formasDePagamento.unshift(new FormaDeEntrega('no_evento', 'No Evento', 'Retirada no Local', 0));
        }
        this.formasDePagamento = formasDePagamento;
        this.htmlFormasDeEntrega(div);
    }

    htmlFormaDePagamento(forma: IFormaDePagamento): HTMLElement {
        const formaSelecionada = this.apiFormasDePagamento.dados;
        const div = criarElementoHtml('div', ['form-check']);
        const input = criarElementoHtml('input', ['form-check-input']);
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'forma-pagamento');
        input.setAttribute('id', `${this.ID}-${forma.tipo}`)
        input.setAttribute('value', forma.tipo);
        if (forma.tipo === formaSelecionada.tipo) {
            input.setAttribute('checked', 'checked');
        }
        input.addEventListener('change', (event) => {
            event.preventDefault();
            this.apiFormasDePagamento.dados = forma;
        });
        div.appendChild(input);

        const label = criarElementoHtml('label', ['form-check-label']);
        label.innerHTML = `${forma.tipo}`;
        label.setAttribute('for', `${this.ID}-${forma.tipo}`);
        div.appendChild(label);
        return div;
    }
}

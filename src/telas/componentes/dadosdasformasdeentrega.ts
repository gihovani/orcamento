import {criarElementoHtml, formataNumeroEmDinheiro} from "../../util/helper";
import {INotificacao} from "../../contratos/componentes/notificacao";
import {IApiFormasDeEntrega} from "../../contratos/servicos/apiformasdeentrega";
import {IFormaDeEntrega} from "../../contratos/entidades/formadeentrega";
import {IDadosDaFormasDeEntrega} from "../../contratos/componentes/dadosdasformasdeentrega";
import {FormaDeEntrega} from "../../entidades/formadeentrega";

export class DadosDaFormasDeEntrega implements IDadosDaFormasDeEntrega {
    readonly ID: string = 'dados-da-forma-de-entrega';
    private _formasDeEntrega: IFormaDeEntrega[];

    constructor(
        public elemento: HTMLElement,
        public apiFormasDeEntrega: IApiFormasDeEntrega,
        public notificacao: INotificacao
    ) {
        this.formasDeEntrega = [];
    }

    set formasDeEntrega(formasDeEntrega: IFormaDeEntrega[]) {
        this._formasDeEntrega = formasDeEntrega;
        this.mostrar();
    }

    get formasDeEntrega(): IFormaDeEntrega[] {
        return this._formasDeEntrega;
    }

    public preencheDados(formaDeEntrega: IFormaDeEntrega): void {
        const input = (this.elemento.querySelector(`#${this.ID}-${formaDeEntrega.tipo}`) as HTMLInputElement);
        if (input) {
            input.setAttribute('checked', 'true');
            this.apiFormasDeEntrega.dados = formaDeEntrega;
        }
    }

    public pegaDados(): IFormaDeEntrega {
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
        let div = this.elemento.querySelector('#' + this.ID);
        if (div) {
            div.innerHTML = '';
        } else {
            div = criarElementoHtml('div', ['row']);
            div.setAttribute('id', this.ID);
        }
        this.formasDeEntrega.map((forma) => {
            div.appendChild(this.htmlFormaDeEntrega(forma));
        });
        div.appendChild(this.htmlFormaDeEntrega(new FormaDeEntrega('no_evento', 'No Evento', 'Retirada no Local', 0)));
        this.elemento.appendChild(div);
    }

    htmlFormaDeEntrega(forma: IFormaDeEntrega): HTMLElement {
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

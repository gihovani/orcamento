import {criarElementoHtml} from "../../util/helper";
import {ICarregando} from "../../contratos/componentes/carregando";

export class Carregando implements ICarregando {
    private temporizador;
    readonly TEMPO_DE_ESPERA = 30000;
    readonly ID: string = 'barra-de-carregamento';

    constructor(public elemento: HTMLElement) {
    }

    mostrar() {
        const div = criarElementoHtml('div', ['align-items-center', 'position-fixed', 'top-50', 'start-50', 'p-3']);
        div.setAttribute('id', this.ID);
        div.innerHTML = `<strong>Carregando...</strong><div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>`;
        this.elemento.appendChild(div);
        this.temporizador = setTimeout(() => {
            if (!this.elemento.querySelector(`#${this.ID}`)) {
                return;
            }

            if (window.confirm(`Detectamos uma lentidão no sistema, verifique a conexao com a internet!
Se for uma operação demorada pode desconsiderar este alerta!`)) {
                this.esconder();
            }
        }, this.TEMPO_DE_ESPERA);
    }

    esconder() {
        this.elemento.querySelector(`#${this.ID}`)?.remove();
        clearTimeout(this.temporizador);
    }
}

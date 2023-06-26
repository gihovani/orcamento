import {criarElementoHtml} from "../../util/helper";
import {ICarregando} from "../../contratos/componentes/carregando";

export class Carregando implements ICarregando {
    readonly ID: string = 'barra-de-carregamento';
    constructor(public elemento: HTMLElement) {
    }

    mostrar() {
        const div = criarElementoHtml('div', ['align-items-center', 'position-fixed', 'top-50', 'start-50', 'p-3'], [{nome: 'id', valor: this.ID}]);
        div.innerHTML = `<strong>Loading...</strong><div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>`;
        this.elemento.appendChild(div);
    }

    esconder() {
        const div = this.elemento.querySelector(`#${this.ID}`);
        if (div) {
            div.remove();
        }
    }
}

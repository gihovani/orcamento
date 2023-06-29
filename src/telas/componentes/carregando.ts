import {criarElementoHtml} from "../../util/helper";
import {ICarregando} from "../../contratos/componentes/carregando";

export class Carregando implements ICarregando {
    private mostrou = false;
    readonly ID: string = 'barra-de-carregamento';

    constructor(public elemento: HTMLElement) {
    }

    mostrar() {
        this.mostrou = true;
        const div = criarElementoHtml('div', ['align-items-center', 'position-fixed', 'top-50', 'start-50', 'p-3'], [{
            nome: 'id',
            valor: this.ID
        }]);
        div.innerHTML = `<strong>Carregando...</strong><div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>`;
        this.elemento.appendChild(div);
        setTimeout(() => {
            if (this.mostrou) {
                if (window.confirm(`Detectamos uma lentidão no sistema, verifique a conexao com a internet!
Se for uma operação demorada pode cancelar este alerta!`)) {
                    this.esconder();
                }
            }
        }, 10000);
    }

    esconder() {
        this.mostrou = false;
        const div = this.elemento.querySelector(`#${this.ID}`);
        if (div) {
            div.remove();
        }
    }
}

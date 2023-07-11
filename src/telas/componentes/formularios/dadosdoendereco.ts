import {criarElementoHtml} from "../../../util/helper";
import {ICarregando} from "../../../contratos/componentes/carregando";
import {IApiCep} from "../../../contratos/servicos/apicep";
import {IEndereco} from "../../../contratos/entidades/endereco";
import {INotificacao} from "../../../contratos/componentes/notificacao";
import {IFormulario} from "../../../contratos/componentes/formulario";
import {validarCEP} from "../../../util/validacoes";

export class DadosDoEndereco implements IFormulario {
    readonly ID: string = 'dados-do-endereco';

    constructor(
        public elemento: HTMLElement,
        public apiCep: IApiCep,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {
    }

    preencheDados(endereco: IEndereco): void {
        (this.elemento.querySelector(`#${this.ID}-cep`) as HTMLInputElement).value = endereco.cep;
        (this.elemento.querySelector(`#${this.ID}-rua`) as HTMLInputElement).value = endereco.rua;
        (this.elemento.querySelector(`#${this.ID}-bairro`) as HTMLInputElement).value = endereco.bairro;
        (this.elemento.querySelector(`#${this.ID}-cidade`) as HTMLInputElement).value = endereco.cidade;
        (this.elemento.querySelector(`#${this.ID}-uf`) as HTMLInputElement).value = endereco.uf;
        (this.elemento.querySelector(`#${this.ID}-numero`) as HTMLInputElement).value = endereco.numero;
        (this.elemento.querySelector(`#${this.ID}-complemento`) as HTMLInputElement).value = endereco.complemento;
    }

    pegaDados(): IEndereco {
        const dados = this.apiCep.dados;
        dados.cep = (this.elemento.querySelector(`#${this.ID}-cep`) as HTMLInputElement)?.value;
        dados.rua = (this.elemento.querySelector(`#${this.ID}-rua`) as HTMLInputElement)?.value;
        dados.bairro = (this.elemento.querySelector(`#${this.ID}-bairro`) as HTMLInputElement)?.value;
        dados.cidade = (this.elemento.querySelector(`#${this.ID}-cidade`) as HTMLInputElement)?.value;
        dados.uf = (this.elemento.querySelector(`#${this.ID}-uf`) as HTMLInputElement)?.value;
        dados.numero = (this.elemento.querySelector(`#${this.ID}-numero`) as HTMLInputElement)?.value;
        dados.complemento = (this.elemento.querySelector(`#${this.ID}-complemento`) as HTMLInputElement)?.value;
        dados.telefone = (this.elemento.querySelector(`#${this.ID}-telefone`) as HTMLInputElement)?.value;
        return dados;
    }

    mostrar(): void {
        this.elemento.querySelector('#' + this.ID)?.remove();
        const div = criarElementoHtml('div', ['row']);
        div.setAttribute('id', this.ID);
        const endereco = this.apiCep.dados;
        div.innerHTML = `
<h3 class="h4 mb-3 fw-normal">Endereço de Entrega</h3>
<div class="col-sm-2 mb-3">
    <label class="form-label" for="${this.ID}-cep">CEP</label>
    <input class="form-control" type="text" id="${this.ID}-cep" maxlength="9" value="${endereco?.cep ?? ''}" required />
</div>
<div class="col-sm-5 mb-3">
    <label class="form-label" for="${this.ID}-rua">Rua</label>
    <input class="form-control" type="text" id="${this.ID}-rua" maxlength="100" value="${endereco?.rua ?? ''}" required />
</div>
<div class="col-sm-2 mb-3">
    <label class="form-label" for="${this.ID}-numero">Número</label>
    <input class="form-control" type="text" id="${this.ID}-numero" maxlength="20" value="${endereco?.numero ?? ''}" />
</div>
<div class="col-sm-3 mb-3">
    <label class="form-label" for="${this.ID}-complemento">Complemento</label>
    <input class="form-control" type="text" id="${this.ID}-complemento" maxlength="50" value="${endereco?.complemento ?? ''}" />
</div>
<div class="col-sm-4 mb-3">
    <label class="form-label" for="${this.ID}-bairro">Bairro</label>
    <input class="form-control" type="text" id="${this.ID}-bairro" maxlength="100" value="${endereco?.bairro ?? ''}" required />
</div>
<div class="col-sm-4 mb-3">
    <label class="form-label" for="${this.ID}-cidade">Cidade</label>
    <input class="form-control" type="text" id="${this.ID}-cidade" maxlength="100" value="${endereco?.cidade ?? ''}" required />
</div>
<div class="col-sm-1 mb-3">
    <label class="form-label" for="${this.ID}-uf">UF</label>
    <input class="form-control" type="text" id="${this.ID}-uf" maxlength="2" value="${endereco?.uf ?? ''}" required />
</div>
<div class="col-sm-3 mb-3">
    <label class="form-label" for="${this.ID}-telefone">Telefone</label>
    <input class="form-control" type="text" id="${this.ID}-telefone" maxlength="15" value="${endereco?.telefone ?? ''}" required />
</div>   
        `;
        div.querySelector(`#${this.ID}-cep`)?.addEventListener('keyup', (e) => {
            const cep = (e.target as HTMLInputElement).value;
            if (validarCEP(cep)) {
                this.carregando.mostrar();
                this.apiCep.consultar(cep).then((endereco) => {
                    this.preencheDados(endereco);
                })
                    .catch(error => this.notificacao.mostrar('Erro', error, 'danger'))
                    .finally(() => this.carregando.esconder());
            }
        });
        this.elemento.appendChild(div);
    }
}
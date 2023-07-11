import {ICliente} from "../../../contratos/entidades/cliente";
import {criarElementoHtml} from "../../../util/helper";
import {IApiCliente} from "../../../contratos/servicos/apicliente";
import {ICarregando} from "../../../contratos/componentes/carregando";
import {INotificacao} from "../../../contratos/componentes/notificacao";
import {validarCPF} from "../../../util/validacoes";
import {IFormulario} from "../../../contratos/componentes/formulario";

export class DadosDoCliente implements IFormulario {
    readonly ID: string = 'dados-do-cliente';

    constructor(
        public elemento: HTMLElement,
        public apiCliente: IApiCliente,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {
    }

    preencheDados(cliente: ICliente): void {
        (this.elemento.querySelector(`#${this.ID}-documento`) as HTMLInputElement).value = cliente.documento;
        (this.elemento.querySelector(`#${this.ID}-nome`) as HTMLInputElement).value = cliente.nome;
        (this.elemento.querySelector(`#${this.ID}-sexo`) as HTMLInputElement).value = cliente.sexo;
        (this.elemento.querySelector(`#${this.ID}-data_nascimento`) as HTMLInputElement).value = cliente.data_nascimento;
        (this.elemento.querySelector(`#${this.ID}-profissao`) as HTMLInputElement).value = cliente.profissao;
        (this.elemento.querySelector(`#${this.ID}-email`) as HTMLInputElement).value = cliente.email;
        (this.elemento.querySelector(`#${this.ID}-registro`) as HTMLInputElement).value = cliente.registro;
        (this.elemento.querySelector(`#${this.ID}-registro_uf`) as HTMLInputElement).value = cliente.registro_uf;
        (this.elemento.querySelector(`#${this.ID}-rg`) as HTMLInputElement).value = cliente.rg;
        (this.elemento.querySelector(`#${this.ID}-rg_uf`) as HTMLInputElement).value = cliente.rg_uf;
        (this.elemento.querySelector(`#${this.ID}-telefone`) as HTMLInputElement).value = cliente.telefone;
        (this.elemento.querySelector(`#${this.ID}-celular`) as HTMLInputElement).value = cliente.celular;
    }

    pegaDados(): ICliente {
        const dados = this.apiCliente.dados;
        dados.documento = (this.elemento.querySelector(`#${this.ID}-documento`) as HTMLInputElement)?.value;
        dados.nome = (this.elemento.querySelector(`#${this.ID}-nome`) as HTMLInputElement)?.value;
        dados.sexo = (this.elemento.querySelector(`#${this.ID}-sexo`) as HTMLInputElement)?.value;
        dados.data_nascimento = (this.elemento.querySelector(`#${this.ID}-data_nascimento`) as HTMLInputElement)?.value;
        dados.profissao = (this.elemento.querySelector(`#${this.ID}-profissao`) as HTMLInputElement)?.value;
        dados.email = (this.elemento.querySelector(`#${this.ID}-email`) as HTMLInputElement)?.value;
        dados.registro = (this.elemento.querySelector(`#${this.ID}-registro`) as HTMLInputElement)?.value;
        dados.registro_uf = (this.elemento.querySelector(`#${this.ID}-registro_uf`) as HTMLInputElement)?.value;
        dados.rg = (this.elemento.querySelector(`#${this.ID}-rg`) as HTMLInputElement)?.value;
        dados.rg_uf = (this.elemento.querySelector(`#${this.ID}-rg_uf`) as HTMLInputElement)?.value;
        dados.telefone = (this.elemento.querySelector(`#${this.ID}-telefone`) as HTMLInputElement)?.value;
        dados.celular = (this.elemento.querySelector(`#${this.ID}-celular`) as HTMLInputElement)?.value;
        return dados;
    }

    esconder(): void {
        this.elemento.querySelector('#' + this.ID)?.remove();
    }

    mostrar(): void {
        this.esconder();
        const div = criarElementoHtml('div', ['row']);
        div.setAttribute('id', this.ID);
        const cliente = this.apiCliente.dados;
        div.innerHTML = `
<h3 class="h4 mb-1 fw-normal">Cadastro de cliente</h3>
<div class="mb-1 col-sm-4">
    <label class="form-label mb-0" for="${this.ID}-documento">Documento</label>
    <input class="form-control" type="text" id="${this.ID}-documento" value="${cliente?.documento ?? ''}" maxlength="15" required />
</div>
<div class="mb-1 col-sm-8">
    <label class="form-label mb-0" for="${this.ID}-nome">Nome</label>
    <input class="form-control" type="text" id="${this.ID}-nome" value="${cliente?.nome ?? ''}" max="100" required />
</div>
<div class="mb-1 col-sm-4">
    <label class="form-label mb-0" for="${this.ID}-sexo">Sexo</label>
    <select class="form-select" id="${this.ID}-sexo" required>
        <option value="M" ${cliente?.sexo === 'M' ? 'selected' : ''}>Masculino</option>
        <option value="F" ${cliente?.sexo === 'F' ? 'selected' : ''}>Feminino</option>
    </select>
</div>
<div class="mb-1 col-sm-4">
    <label class="form-label mb-0" for="${this.ID}-data_nascimento">Data Nascimento</label>
    <input class="form-control" type="text" id="${this.ID}-data_nascimento" maxlength="10" value="${cliente?.data_nascimento ?? ''}" />
</div>
<div class="mb-1 col-sm-4">
    <label class="form-label mb-0" for="${this.ID}-profissao">Profissão</label>
    <select class="form-select" id="${this.ID}-profissao">
        <option value="Cirurgião-Dentista" ${cliente?.profissao === 'Cirurgião-Dentista' ? 'selected' : ''}>Cirurgião-Dentista</option>
        <option value="Clínica Odontológica" ${cliente?.profissao === 'Clínica Odontológica' ? 'selected' : ''}>Clínica Odontológica</option>
    </select>
</div>
<div class="mb-1 col-sm-3">
    <label class="form-label mb-0" for="${this.ID}-registro">Registro</label>
    <input class="form-control" type="text" id="${this.ID}-registro" maxlength="10" value="${cliente?.registro ?? ''}" />
</div>
<div class="mb-1 col-sm-3">
    <label class="form-label mb-0" for="${this.ID}-registro_uf">Registro UF</label>
    <input class="form-control" type="text" id="${this.ID}-registro_uf" maxlength="2" value="${cliente?.registro_uf ?? ''}" />
</div>
<div class="mb-1 col-sm-3">
    <label class="form-label mb-0" for="${this.ID}-rg">RG</label>
    <input class="form-control" type="text" id="${this.ID}-rg" maxlength="10" value="${cliente?.rg ?? ''}" />
</div>
<div class="mb-1 col-sm-3">
    <label class="form-label mb-0" for="${this.ID}-rg_uf">RG UF</label>
    <input class="form-control" type="text" id="${this.ID}-rg_uf" maxlength="2" value="${cliente?.rg_uf ?? ''}" />
</div>
<div class="mb-1 col-sm-3">
    <label class="form-label mb-0" for="${this.ID}-telefone">Telefone</label>
    <input class="form-control" type="text" id="${this.ID}-telefone" maxlength="15" value="${cliente?.telefone ?? ''}" required />
</div>
<div class="mb-1 col-sm-3">
    <label class="form-label mb-0" for="${this.ID}-celular">Celular</label>
    <input class="form-control" type="text" id="${this.ID}-celular" maxlength="15" value="${cliente?.celular ?? ''}" />
</div>
<div class="mb-1 col-sm-6">
    <label class="form-label mb-0" for="${this.ID}-email">E-mail</label>
    <input class="form-control" type="email" id="${this.ID}-email" maxlength="100" value="${cliente?.email ?? ''}" required />
</div>`;
        div.querySelector(`#${this.ID}-documento`)?.addEventListener('keyup', (e) => {
            const documento = (e.target as HTMLInputElement).value;
            if (validarCPF(documento)) {
                this.carregando.mostrar();
                this.apiCliente.consultar(documento).then((cliente) => {
                    this.preencheDados(cliente);
                })
                    .catch(error => this.notificacao.mostrar('Erro', error, 'danger'))
                    .finally(() => this.carregando.esconder());
            }
        });
        this.elemento.appendChild(div);
    }
}
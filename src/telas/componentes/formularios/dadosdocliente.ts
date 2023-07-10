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
        (this.elemento.querySelector('#cliente-documento') as HTMLInputElement).value = cliente.documento;
        (this.elemento.querySelector('#cliente-nome') as HTMLInputElement).value = cliente.nome;
        (this.elemento.querySelector('#cliente-sexo') as HTMLInputElement).value = cliente.sexo;
        (this.elemento.querySelector('#cliente-data_nascimento') as HTMLInputElement).value = cliente.data_nascimento;
        (this.elemento.querySelector('#cliente-profissao') as HTMLInputElement).value = cliente.profissao;
        (this.elemento.querySelector('#cliente-email') as HTMLInputElement).value = cliente.email;
        (this.elemento.querySelector('#cliente-registro') as HTMLInputElement).value = cliente.registro;
        (this.elemento.querySelector('#cliente-registro_uf') as HTMLInputElement).value = cliente.registro_uf;
        (this.elemento.querySelector('#cliente-rg') as HTMLInputElement).value = cliente.rg;
        (this.elemento.querySelector('#cliente-rg_uf') as HTMLInputElement).value = cliente.rg_uf;
        (this.elemento.querySelector('#cliente-telefone') as HTMLInputElement).value = cliente.telefone;
        (this.elemento.querySelector('#cliente-celular') as HTMLInputElement).value = cliente.celular;
    }

    pegaDados(): ICliente {
        const dados = this.apiCliente.dados;
        dados.documento = (this.elemento.querySelector('#cliente-documento') as HTMLInputElement)?.value;
        dados.nome = (this.elemento.querySelector('#cliente-nome') as HTMLInputElement)?.value;
        dados.sexo = (this.elemento.querySelector('#cliente-sexo') as HTMLInputElement)?.value;
        dados.data_nascimento = (this.elemento.querySelector('#cliente-data_nascimento') as HTMLInputElement)?.value;
        dados.profissao = (this.elemento.querySelector('#cliente-profissao') as HTMLInputElement)?.value;
        dados.email = (this.elemento.querySelector('#cliente-email') as HTMLInputElement)?.value;
        dados.registro = (this.elemento.querySelector('#cliente-registro') as HTMLInputElement)?.value;
        dados.registro_uf = (this.elemento.querySelector('#cliente-registro_uf') as HTMLInputElement)?.value;
        dados.rg = (this.elemento.querySelector('#cliente-rg') as HTMLInputElement)?.value;
        dados.rg_uf = (this.elemento.querySelector('#cliente-rg_uf') as HTMLInputElement)?.value;
        dados.telefone = (this.elemento.querySelector('#cliente-telefone') as HTMLInputElement)?.value;
        dados.celular = (this.elemento.querySelector('#cliente-celular') as HTMLInputElement)?.value;
        return dados;
    }

    mostrar(): void {
        this.elemento.querySelector('#' + this.ID)?.remove();
        const div = criarElementoHtml('div', ['row'], [{nome: 'id', valor: this.ID}]);
        const cliente = this.apiCliente.dados;
        div.innerHTML = `
                <h3 class="h4 mb-3 fw-normal">Cadastro de cliente</h3>
                <div class="mb-3 col-sm-4 col-md-3">
                    <label class="form-label" for="cliente-documento">Documento</label>
                    <input class="form-control" type="text" id="cliente-documento" value="${cliente?.documento ?? ''}" maxlength="15" />
                </div>
                <div class="mb-3  col-sm-8 col-md-7">
                    <label class="form-label" for="cliente-nome">Nome</label>
                    <input class="form-control" type="text" id="cliente-nome" value="${cliente?.nome ?? ''}" max="100" />
                </div>
                <div class="mb-3 col-sm-4 col-md-2">
                    <label class="form-label" for="cliente-sexo">Sexo</label>
                    <select class="form-select" id="cliente-sexo">
                        <option value="M" ${cliente?.sexo === 'M' ? 'selected' : ''}>Masculino</option>
                        <option value="F" ${cliente?.sexo === 'F' ? 'selected' : ''}>Feminino</option>
                    </select>
                </div>
                <div class="mb-3 col-sm-4 col-md-2">
                    <label class="form-label" for="cliente-data_nascimento">Data Nascimento</label>
                    <input class="form-control" type="text" id="cliente-data_nascimento" maxlength="10" value="${cliente?.data_nascimento ?? ''}" />
                </div>
                <div class="mb-3 col-sm-4 col-md-3">
                    <label class="form-label" for="cliente-profissao">Profissão</label>
                    <select class="form-select" id="cliente-profissao">
                        <option value="Cirurgião-Dentista" ${cliente?.profissao === 'Cirurgião-Dentista' ? 'selected' : ''}>Cirurgião-Dentista</option>
                        <option value="Clínica Odontológica" ${cliente?.profissao === 'Clínica Odontológica' ? 'selected' : ''}>Clínica Odontológica</option>
                    </select>
                </div>
                <div class="mb-3 col-sm-3 col-md-2">
                    <label class="form-label" for="cliente-registro">Registro</label>
                    <input class="form-control" type="text" id="cliente-registro" maxlength="10" value="${cliente?.registro ?? ''}" />
                </div>
                <div class="mb-3 col-sm-3 col-md-2">
                    <label class="form-label" for="cliente-registro_uf">Registro UF</label>
                    <input class="form-control" type="text" id="cliente-registro_uf" maxlength="2" value="${cliente?.registro_uf ?? ''}" />
                </div>
                <div class="mb-3 col-sm-3 col-md-2">
                    <label class="form-label" for="cliente-rg">RG</label>
                    <input class="form-control" type="text" id="cliente-rg" maxlength="10" value="${cliente?.rg ?? ''}" />
                </div>
                <div class="mb-3 col-sm-3 col-md-1">
                    <label class="form-label" for="cliente-rg_uf">RG UF</label>
                    <input class="form-control" type="text" id="cliente-rg_uf" maxlength="2" value="${cliente?.rg_uf ?? ''}" />
                </div>
                <div class="mb-3 col-sm-3 col-md-3">
                    <label class="form-label" for="cliente-telefone">Telefone</label>
                    <input class="form-control" type="text" id="cliente-telefone" maxlength="15" value="${cliente?.telefone ?? ''}" />
                </div>
                <div class="mb-3 col-sm-3 col-md-3">
                    <label class="form-label" for="cliente-celular">Celular</label>
                    <input class="form-control" type="text" id="cliente-celular" maxlength="15" value="${cliente?.celular ?? ''}" />
                </div>
                <div class="mb-3 col-sm-6 col-md-6">
                    <label class="form-label" for="cliente-email">E-mail</label>
                    <input class="form-control" type="email" id="cliente-email" maxlength="100" value="${cliente?.email ?? ''}" />
                </div>
            </div>
        `;
        div.querySelector('#cliente-documento')?.addEventListener('change', (e) => {
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
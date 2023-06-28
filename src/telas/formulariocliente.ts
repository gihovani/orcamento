import {ITela} from "../contratos/tela";
import {Cliente} from "../entidades/cliente";
import {criarElementoHtml} from "../util/helper";
import {IApiCliente} from "../contratos/servicos/apicliente";
import {ICliente} from "../contratos/entidades/cliente";
import {INotificacao} from "../contratos/componentes/notificacao";
import {ICarregando} from "../contratos/componentes/carregando";

export class FormularioCliente implements ITela {
    constructor(
        public apiCliente: IApiCliente,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {
    }

    public preencheFormularioDados(form: HTMLFormElement, cliente: ICliente): void {
        (form.querySelector('#documento') as HTMLInputElement).value = cliente.documento;
        (form.querySelector('#nome') as HTMLInputElement).value = cliente.nome;
        (form.querySelector('#sexo') as HTMLInputElement).value = cliente.sexo;
        (form.querySelector('#data_nascimento') as HTMLInputElement).value = cliente.data_nascimento;
        (form.querySelector('#profissao') as HTMLInputElement).value = cliente.profissao;
        (form.querySelector('#email') as HTMLInputElement).value = cliente.email;
        (form.querySelector('#registro') as HTMLInputElement).value = cliente.registro;
        (form.querySelector('#registro_uf') as HTMLInputElement).value = cliente.registro_uf;
        (form.querySelector('#rg') as HTMLInputElement).value = cliente.rg;
        (form.querySelector('#rg_uf') as HTMLInputElement).value = cliente.rg_uf;
        (form.querySelector('#telefone') as HTMLInputElement).value = cliente.telefone;
        (form.querySelector('#celular') as HTMLInputElement).value = cliente.celular;
    }

    public pegaDadosDoFormulario(form: HTMLFormElement): ICliente {
        const documento = (form.querySelector('#documento') as HTMLInputElement)?.value;
        const nome = (form.querySelector('#nome') as HTMLInputElement)?.value;
        const sexo = (form.querySelector('#sexo') as HTMLInputElement)?.value;
        const data_nascimento = (form.querySelector('#data_nascimento') as HTMLInputElement)?.value;
        const profissao = (form.querySelector('#profissao') as HTMLInputElement)?.value;
        const email = (form.querySelector('#email') as HTMLInputElement)?.value;
        const registro = (form.querySelector('#registro') as HTMLInputElement)?.value;
        const registro_uf = (form.querySelector('#registro_uf') as HTMLInputElement)?.value;
        const rg = (form.querySelector('#rg') as HTMLInputElement)?.value;
        const rg_uf = (form.querySelector('#rg_uf') as HTMLInputElement)?.value;
        const telefone = (form.querySelector('#telefone') as HTMLInputElement)?.value;
        const celular = (form.querySelector('#celular') as HTMLInputElement)?.value;
        return new Cliente(documento, nome, sexo, data_nascimento, profissao, email, registro, registro_uf, rg, rg_uf, telefone, celular);
    }

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main', ['row']);
        const cliente = this.apiCliente.dados || new Cliente();
        main.innerHTML = `
            <form class="bg-body-tertiary p-5 rounded mt-3 mb-3 m-auto" autocomplete="off">
                <h1 class="h3 mb-3 fw-normal">Cadastro de cliente</h1>
                <div class="mb-3">
                    <label class="form-label" for="documento">Documento</label>
                    <input class="form-control" type="text" id="documento" value="${cliente.documento ?? ''}" maxlength="15" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="nome">Nome</label>
                    <input class="form-control" type="text" id="nome" value="${cliente?.nome ?? ''}" max="100" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="sexo">Sexo</label>
                    <select class="form-select" id="sexo">
                        <option value="M" ${cliente?.sexo === 'M' ? 'selected' : ''}>Masculino</option>
                        <option value="F" ${cliente?.sexo === 'F' ? 'selected' : ''}>Feminino</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label" for="data_nascimento">Data Nascimento</label>
                    <input class="form-control" type="text" id="data_nascimento" maxlength="10" value="${cliente?.data_nascimento ?? ''}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="profissao">Profissão</label>
                    <select class="form-select" id="profissao">
                        <option value="Cirurgião-Dentista" ${cliente?.profissao === 'Cirurgião-Dentista' ? 'selected' : ''}>Cirurgião-Dentista</option>
                        <option value="Clínica Odontológica" ${cliente?.profissao === 'Clínica Odontológica' ? 'selected' : ''}>Clínica Odontológica</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label" for="registro">Registro</label>
                    <input class="form-control" type="text" id="registro" maxlength="10" value="${cliente?.registro ?? ''}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="registro_uf">Registro UF</label>
                    <input class="form-control" type="text" id="registro_uf" maxlength="2" value="${cliente?.registro_uf ?? ''}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="rg">RG</label>
                    <input class="form-control" type="text" id="rg" maxlength="10" value="${cliente?.rg ?? ''}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="rg_uf">RG UF</label>
                    <input class="form-control" type="text" id="rg_uf" maxlength="2" value="${cliente?.rg_uf ?? ''}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="telefone">Telefone</label>
                    <input class="form-control" type="text" id="telefone" maxlength="15" value="${cliente?.telefone ?? ''}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="celular">Celular</label>
                    <input class="form-control" type="text" id="celular" maxlength="15" value="${cliente?.celular ?? ''}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="email">E-mail</label>
                    <input class="form-control" type="email" id="email" maxlength="100" value="${cliente?.email ?? ''}" />
                </div>
                <button type="submit" class="btn btn-primary">SALVAR</button>
            </form>
        `;
        const form = main.querySelector('form') as HTMLFormElement;
        main.querySelector('#documento')?.addEventListener('change', (e) => {
            const documento = (e.target as HTMLInputElement).value;
            if (documento.length === 11) {
                this.carregando.mostrar();
                this.apiCliente.consultar(documento).then((cliente) => {
                    this.preencheFormularioDados(form, cliente);
                }).finally(() => this.carregando.esconder());
            }
        });
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.carregando.mostrar();
            this.apiCliente.salvar(this.pegaDadosDoFormulario(form)).then(() => {
                this.notificacao.mostrar('Sucesso', 'Os Dados do Cliente Foram Salvos!');
            }).finally(() => this.carregando.esconder());
        });
        return main;
    }
}
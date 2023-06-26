import {Tela} from "../contratos/tela";
import {IClienteCadastro} from "../contratos/clientecadastro";
import {Cliente} from "../entidades/cliente";
import {criarElementoHtml} from "../util/helper";
import {Endereco} from "../entidades/endereco";
import {IApiCliente} from "../servicos/apicliente";
import {IApiCep} from "../servicos/apibuscacep";
import {ICliente} from "../contratos/cliente";
import {IEndereco} from "../contratos/endereco";

export class HTMLCadastroCliente extends Tela {
    constructor(
        public elemento: HTMLElement,
        public clienteCadastro: IClienteCadastro,
        public apiCliente: IApiCliente,
        public apiCep: IApiCep
    ) {
        super();
    }

    public preencheFormularioDadosCliente(form: HTMLFormElement, cliente: ICliente): void {
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

    public preencheFormularioDadosEndereco(form: HTMLFormElement, endereco: IEndereco): void {
        (form.querySelector('#cep') as HTMLInputElement).value = endereco.cep;
        (form.querySelector('#rua') as HTMLInputElement).value = endereco.rua;
        (form.querySelector('#bairro') as HTMLInputElement).value = endereco.bairro;
        (form.querySelector('#cidade') as HTMLInputElement).value = endereco.cidade;
        (form.querySelector('#uf') as HTMLInputElement).value = endereco.uf;
        (form.querySelector('#numero') as HTMLInputElement).value = '';
        (form.querySelector('#complemento') as HTMLInputElement).value = '';
    }

    public pegaDadosDoFormulario(form: HTMLFormElement): void {
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
        this.clienteCadastro.cliente = new Cliente(documento, nome, sexo, data_nascimento, profissao, email, registro, registro_uf, rg, rg_uf, telefone, celular);

        const cep = (form.querySelector('#cep') as HTMLInputElement)?.value;
        const rua = (form.querySelector('#rua') as HTMLInputElement)?.value;
        const bairro = (form.querySelector('#bairro') as HTMLInputElement)?.value;
        const cidade = (form.querySelector('#cidade') as HTMLInputElement)?.value;
        const uf = (form.querySelector('#uf') as HTMLInputElement)?.value;
        const numero = (form.querySelector('#numero') as HTMLInputElement)?.value;
        const complemento = (form.querySelector('#complemento') as HTMLInputElement)?.value;
        this.clienteCadastro.endereco = new Endereco(cep, rua, bairro, cidade, uf, numero, telefone, complemento);
    }

    html(): HTMLElement {
        const div = criarElementoHtml('div', ['row']);
        div.innerHTML = `
            <h1>Cadastro de cliente</h1>
            <form>
                <div class="mb-3">
                    <label class="form-label" for="documento">Documento</label>
                    <input class="form-control" type="text" id="documento" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="nome">Nome</label>
                    <input class="form-control" type="text" id="nome" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="sexo">Sexo</label>
                    <select class="form-select" id="sexo">
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label" for="data_nascimento">Data Nascimento</label>
                    <input class="form-control" type="text" id="data_nascimento" maxlength="10" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="profissao">Profissão</label>
                    <select class="form-select" id="profissao">
                        <option value="Cirurgião-Dentista">Cirurgião-Dentista</option>
                        <option value="Clínica Odontológica">Clínica Odontológica</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label" for="registro">Registro</label>
                    <input class="form-control" type="text" id="registro" maxlength="10" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="registro_uf">Registro UF</label>
                    <input class="form-control" type="text" id="registro_uf" maxlength="2" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="rg">RG</label>
                    <input class="form-control" type="text" id="rg" maxlength="10" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="rg_uf">RG UF</label>
                    <input class="form-control" type="text" id="rg_uf" maxlength="2" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="telefone">Telefone</label>
                    <input class="form-control" type="text" id="telefone" maxlength="10" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="celular">Celular</label>
                    <input class="form-control" type="text" id="celular" maxlength="10" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="email">E-mail</label>
                    <input class="form-control" type="email" id="email" maxlength="100" />
                </div>
                
                
                <div class="mb-3">
                    <label class="form-label" for="cep">CEP</label>
                    <input class="form-control" type="text" id="cep" maxlength="10" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="rua">Rua</label>
                    <input class="form-control" type="text" id="rua" maxlength="100" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="bairro">Bairro</label>
                    <input class="form-control" type="text" id="bairro" maxlength="100" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="cidade">Cidade</label>
                    <input class="form-control" type="text" id="cidade" maxlength="100" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="uf">UF</label>
                    <input class="form-control" type="text" id="uf" maxlength="2" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="numero">Número</label>
                    <input class="form-control" type="text" id="numero" maxlength="20" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="complemento">Complemento</label>
                    <input class="form-control" type="text" id="complemento" maxlength="50" />
                </div>
                <button type="submit" class="btn btn-primary">Cadastrar</button>
            </form>
        `;
        const form = div.querySelector('form') as HTMLFormElement;
        div.querySelector('#documento')?.addEventListener('change', (e) => {
            const documento = (e.target as HTMLInputElement).value;
            if (documento.length === 11) {
                this.apiCliente.consultar(documento).then((cliente) => {
                    this.preencheFormularioDadosCliente(form, cliente);
                });
            }
        });
        div.querySelector('#cep')?.addEventListener('change', (e) => {
            const cep = (e.target as HTMLInputElement).value;
            if (cep.length === 8) {
                this.apiCep.consultar(cep).then((endereco) => {
                    this.preencheFormularioDadosEndereco(form, endereco);
                });
            }
        });
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.clienteCadastro.salvar();
        });
        return div;
    }
}
import {criarElementoHtml} from "../util/helper";
import {Endereco} from "../entidades/endereco";
import {IEndereco} from "../contratos/entidades/endereco";
import {IApiCep} from "../contratos/servicos/apicep";
import {ITela} from "../contratos/tela";
import {INotificacao} from "../contratos/componentes/notificacao";
import {IApiEndereco} from "../contratos/servicos/apiendereco";
import {ICarregando} from "../contratos/componentes/carregando";

export class FormularioEndereco implements ITela {
    constructor(
        public apiEndereco: IApiEndereco,
        public apiCep: IApiCep,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {}

    public preencheFormularioDados(form: HTMLFormElement, endereco: IEndereco): void {
        (form.querySelector('#cep') as HTMLInputElement).value = endereco.cep;
        (form.querySelector('#rua') as HTMLInputElement).value = endereco.rua;
        (form.querySelector('#bairro') as HTMLInputElement).value = endereco.bairro;
        (form.querySelector('#cidade') as HTMLInputElement).value = endereco.cidade;
        (form.querySelector('#uf') as HTMLInputElement).value = endereco.uf;
        (form.querySelector('#numero') as HTMLInputElement).value = '';
        (form.querySelector('#complemento') as HTMLInputElement).value = '';
    }

    public pegaDadosDoFormulario(form: HTMLFormElement): IEndereco {
        const cep = (form.querySelector('#cep') as HTMLInputElement)?.value;
        const rua = (form.querySelector('#rua') as HTMLInputElement)?.value;
        const bairro = (form.querySelector('#bairro') as HTMLInputElement)?.value;
        const cidade = (form.querySelector('#cidade') as HTMLInputElement)?.value;
        const uf = (form.querySelector('#uf') as HTMLInputElement)?.value;
        const numero = (form.querySelector('#numero') as HTMLInputElement)?.value;
        const complemento = (form.querySelector('#complemento') as HTMLInputElement)?.value;
        const telefone = (form.querySelector('#telefone') as HTMLInputElement)?.value;
        return new Endereco(cep, rua, bairro, cidade, uf, numero, telefone, complemento);
    }

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main', ['row']);
        const endereco = this.apiEndereco.dados || new Endereco();
        main.innerHTML = `
            <form class="bg-body-tertiary p-5 rounded mt-3 mb-3 m-auto" autocomplete="off">
                <h1 class="h3 mb-3 fw-normal">Endereço de Entrega</h1>
                <div class="mb-3">
                    <label class="form-label" for="cep">CEP</label>
                    <input class="form-control" type="text" id="cep" maxlength="9" value="${endereco.cep ?? ''}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="rua">Rua</label>
                    <input class="form-control" type="text" id="rua" maxlength="100" value="${endereco.rua ?? ''}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="bairro">Bairro</label>
                    <input class="form-control" type="text" id="bairro" maxlength="100" value="${endereco.bairro ?? ''}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="cidade">Cidade</label>
                    <input class="form-control" type="text" id="cidade" maxlength="100" value="${endereco.cidade ?? ''}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="uf">UF</label>
                    <input class="form-control" type="text" id="uf" maxlength="2" value="${endereco.uf ?? ''}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="numero">Número</label>
                    <input class="form-control" type="text" id="numero" maxlength="20" value="${endereco.numero ?? ''}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="complemento">Complemento</label>
                    <input class="form-control" type="text" id="complemento" maxlength="50" value="${endereco.complemento ?? ''}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="telefone">Telefone</label>
                    <input class="form-control" type="text" id="telefone" maxlength="15" value="${endereco.telefone ?? ''}" />
                </div>
                <button type="submit" class="btn btn-primary">SALVAR</button>
            </form>
        `;
        const form = main.querySelector('form') as HTMLFormElement;
        main.querySelector('#cep')?.addEventListener('change', (e) => {
            const cep = (e.target as HTMLInputElement).value;
            if (cep.length >= 8 && cep.length <= 9) {
                this.carregando.mostrar();
                this.apiCep.consultar(cep).then((endereco) => {
                    this.preencheFormularioDados(form, endereco);
                }).finally(() => this.carregando.esconder());
            }
        });
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.carregando.mostrar();
            this.apiEndereco.salvar(this.pegaDadosDoFormulario(form)).then(() => {
                this.notificacao.mostrar('Sucesso', 'Os Dados do Endereço Foram Salvos!');
            }).finally(() => this.carregando.esconder());
        });
        return main;
    }
}
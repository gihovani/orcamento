import {Tela} from "../contratos/tela";
import {criarElementoHtml} from "../util/helper";
import {Endereco} from "../entidades/endereco";
import {IEndereco} from "../contratos/entidades/endereco";
import {IApiCep} from "../contratos/servicos/apicep";

export class FormularioEndereco extends Tela {
    constructor(public elemento: HTMLElement, public apiCep: IApiCep) {
        super();
    }

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
        const div = criarElementoHtml('div', ['row']);
        div.innerHTML = `
            <h1>Endereço de Entrega</h1>
            <form>
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
                <div class="mb-3">
                    <label class="form-label" for="telefone">Telefone</label>
                    <input class="form-control" type="text" id="telefone" maxlength="10" />
                </div>
                <button type="submit" class="btn btn-primary">SALVAR</button>
            </form>
        `;
        const form = div.querySelector('form') as HTMLFormElement;
        div.querySelector('#cep')?.addEventListener('change', (e) => {
            const cep = (e.target as HTMLInputElement).value;
            if (cep.length === 8) {
                this.apiCep.consultar(cep).then((endereco) => {
                    this.preencheFormularioDados(form, endereco);
                });
            }
        });
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // this.apiCep.salvar();
        });
        return div;
    }
}
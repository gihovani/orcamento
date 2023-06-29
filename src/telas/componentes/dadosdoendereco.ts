import {IDadosDoEndereco} from "../../contratos/componentes/dadosdoendereco";
import {criarElementoHtml} from "../../util/helper";
import {ICarregando} from "../../contratos/componentes/carregando";
import {IApiCep} from "../../contratos/servicos/apicep";
import {IEndereco} from "../../contratos/entidades/endereco";

export class DadosDoEndereco implements IDadosDoEndereco {
    readonly ID: string = 'dados-do-endereco';

    constructor(
        public elemento: HTMLElement,
        public apiCep: IApiCep,
        public carregando: ICarregando
    ) {
    }

    public preencheDados(endereco: IEndereco): void {
        (this.elemento.querySelector('#endereco-cep') as HTMLInputElement).value = endereco.cep;
        (this.elemento.querySelector('#endereco-rua') as HTMLInputElement).value = endereco.rua;
        (this.elemento.querySelector('#endereco-bairro') as HTMLInputElement).value = endereco.bairro;
        (this.elemento.querySelector('#endereco-cidade') as HTMLInputElement).value = endereco.cidade;
        (this.elemento.querySelector('#endereco-uf') as HTMLInputElement).value = endereco.uf;
        (this.elemento.querySelector('#endereco-numero') as HTMLInputElement).value = endereco.numero;
        (this.elemento.querySelector('#endereco-complemento') as HTMLInputElement).value = endereco.complemento;
    }

    public pegaDados(): IEndereco {
        const dados = this.apiCep.dados;
        dados.cep = (this.elemento.querySelector('#endereco-cep') as HTMLInputElement)?.value;
        dados.rua = (this.elemento.querySelector('#endereco-rua') as HTMLInputElement)?.value;
        dados.bairro = (this.elemento.querySelector('#endereco-bairro') as HTMLInputElement)?.value;
        dados.cidade = (this.elemento.querySelector('#endereco-cidade') as HTMLInputElement)?.value;
        dados.uf = (this.elemento.querySelector('#endereco-uf') as HTMLInputElement)?.value;
        dados.numero = (this.elemento.querySelector('#endereco-numero') as HTMLInputElement)?.value;
        dados.complemento = (this.elemento.querySelector('#endereco-complemento') as HTMLInputElement)?.value;
        dados.telefone = (this.elemento.querySelector('#endereco-telefone') as HTMLInputElement)?.value;
        return dados;
    }

    mostrar(): void {
        this.elemento.querySelector('#' + this.ID)?.remove();
        const div = criarElementoHtml('div', ['row'], [{nome: 'id', valor: this.ID}]);
        const endereco = this.apiCep.dados;
        div.innerHTML = `
                <h3 class="h4 mb-3 fw-normal">Endereço de Entrega</h3>
                <div class="col-sm-2 mb-3">
                    <label class="form-label" for="endereco-cep">CEP</label>
                    <input class="form-control" type="text" id="endereco-cep" maxlength="9" value="${endereco?.cep ?? ''}" />
                </div>
                <div class="col-sm-5 mb-3">
                    <label class="form-label" for="endereco-rua">Rua</label>
                    <input class="form-control" type="text" id="endereco-rua" maxlength="100" value="${endereco?.rua ?? ''}" />
                </div>
                <div class="col-sm-2 mb-3">
                    <label class="form-label" for="endereco-numero">Número</label>
                    <input class="form-control" type="text" id="endereco-numero" maxlength="20" value="${endereco?.numero ?? ''}" />
                </div>
                <div class="col-sm-3 mb-3">
                    <label class="form-label" for="endereco-complemento">Complemento</label>
                    <input class="form-control" type="text" id="endereco-complemento" maxlength="50" value="${endereco?.complemento ?? ''}" />
                </div>
                <div class="col-sm-4 mb-3">
                    <label class="form-label" for="endereco-bairro">Bairro</label>
                    <input class="form-control" type="text" id="endereco-bairro" maxlength="100" value="${endereco?.bairro ?? ''}" />
                </div>
                <div class="col-sm-4 mb-3">
                    <label class="form-label" for="endereco-cidade">Cidade</label>
                    <input class="form-control" type="text" id="endereco-cidade" maxlength="100" value="${endereco?.cidade ?? ''}" />
                </div>
                <div class="col-sm-1 mb-3">
                    <label class="form-label" for="endereco-uf">UF</label>
                    <input class="form-control" type="text" id="endereco-uf" maxlength="2" value="${endereco?.uf ?? ''}" />
                </div>
                <div class="col-sm-3 mb-3">
                    <label class="form-label" for="endereco-telefone">Telefone</label>
                    <input class="form-control" type="text" id="endereco-telefone" maxlength="15" value="${endereco?.telefone ?? ''}" />
                </div>
        `;
        div.querySelector('#endereco-cep')?.addEventListener('change', (e) => {
            const cep = (e.target as HTMLInputElement).value;
            if (cep.length >= 8 && cep.length <= 9) {
                this.carregando.mostrar();
                this.apiCep.consultar(cep).then((endereco) => {
                    this.preencheDados(endereco);
                }).finally(() => this.carregando.esconder());
            }
        });
        this.elemento.appendChild(div);
    }
}
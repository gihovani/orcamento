import {validarCEP, validarTelefone, validarUF} from "../util/validacoes";
import {IEndereco} from "../contratos/entidades/endereco";

export class Endereco implements IEndereco {
    private _cep: string;
    private _rua: string;
    private _bairro: string;
    private _cidade: string;
    private _uf: string;
    private _telefone?: string;
    numero?: string;
    complemento?: string;

    constructor(
        cep?: string,
        rua?: string,
        bairro?: string,
        cidade?: string,
        uf?: string,
        numero?: string,
        telefone?: string,
        complemento?: string,
    ) {
        cep && (this.cep = cep);
        rua && (this.rua = rua);
        bairro && (this.bairro = bairro);
        cidade && (this.cidade = cidade);
        uf && (this.uf = uf);
        telefone && (this.telefone = telefone);
        numero && (this.numero = numero);
        complemento && (this.complemento = complemento);
    }

    set cep(cep: string) {
        if (!validarCEP(cep)) {
            throw Error("Endereço Inválido: o cep deve ser um número válido! Ex: 88100-000");
        }
        this._cep = cep;
    }

    set rua(rua: string) {
        if (!rua) {
            throw Error("Endereço Inválido: a rua do endereço é obrigatório!");
        }
        this._rua = rua;
    }

    set bairro(bairro: string) {
        if (!bairro) {
            throw Error("Endereço Inválido: o bairro do endereço é obrigatário!");
        }
        this._bairro = bairro;
    }

    set cidade(cidade: string) {
        if (!cidade) {
            throw Error("Endereço Inválido: a cidade do endereço é obrigatário!");
        }
        this._cidade = cidade;
    }

    set uf(uf: string) {
        if (!uf) {
            throw Error("Endereço Inválido: a uf do endereço é obrigatário!");
        }
        if (!validarUF(uf)) {
            throw Error("Endereço Inválido: a uf do endereço deve ser uma sigla válida! Ex: SP, RJ, MG, etc.");
        }
        this._uf = uf;
    }

    set telefone(telefone: string | null) {
        if (telefone && !validarTelefone(telefone)) {
            throw Error("Endereço Inválido: o telefone deve ser um número válido!");
        }
        this._telefone = telefone;
    }

    get cep(): string {
        return this._cep;
    }

    get rua(): string {
        return this._rua;
    }

    get bairro(): string {
        return this._bairro;
    }

    get cidade(): string {
        return this._cidade;
    }

    get uf(): string {
        return this._uf;
    }

    get telefone(): string {
        return this._telefone;
    }
}

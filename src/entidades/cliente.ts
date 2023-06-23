import {validarCPF, validarDataDeNascimento, validarEmail, validarTelefone, validarUF} from "../util/validacoes";
import {ICliente} from "../contratos/cliente";

export class Cliente implements ICliente {
    private _documento: string;
    private _nome: string;
    private _sexo: string;
    private _data_nascimento: string;
    private _email: string;
    private _registro_uf?: string;
    private _rg_uf?: string;
    private _telefone?: string;
    private _celular?: string;

    profissao: string;
    registro?: string;
    rg?: string;

    constructor(
        documento: string,
        nome: string,
        sexo: string,
        data_nascimento: string,
        profissao: string,
        email: string,
        registro?: string,
        registro_uf?: string,
        rg?: string,
        rg_uf?: string,
        telefone?: string,
        celular?: string
    ) {
        this.documento = documento;
        this.nome = nome;
        this.sexo = sexo;
        this.data_nascimento = data_nascimento;
        this.profissao = profissao;
        this.email = email;
        this.registro = registro;
        this.registro_uf = registro_uf;
        this.rg = rg;
        this.rg_uf = rg_uf;
        this.telefone = telefone;
        this.celular = celular;
    }

    set documento(documento: string) {
        if (!validarCPF(documento)) {
            throw Error("Cliente Inválido: o documento deve ser um número válido!");
        }
        this._documento = documento;
    }

    set nome(nome: string) {
        if (!nome) {
            throw Error("Cliente Inválido: o nome do cliente é obrigatório!");
        }
        this._nome = nome;
    }

    set sexo(sexo: string) {
        if (!sexo) {
            throw Error("Cliente Inválido: o sexo do cliente é obrigatário!");
        }
        if (['M', 'F'].indexOf(sexo) < 0) {
            throw Error("Cliente Inválido: o sexo do cliente é não é válido! Ex: M ou F");
        }
        this._sexo = sexo;
    }

    set data_nascimento(data_nascimento: string) {
        if (!validarDataDeNascimento(data_nascimento)) {
            throw Error("Cliente Inválido: a data de nascimento do cliente deve ser uma data válida! Ex: dd/mm/aaaa");
        }
        this._data_nascimento = data_nascimento;
    }

    set registro_uf(registro_uf: string | null) {
        if (registro_uf && !validarUF(registro_uf)) {
            throw Error("Cliente Inválido: a uf do Registro deve ser uma sigla válida! Ex: SP, RJ, MG, etc.");
        }
        this._registro_uf = registro_uf;
    }

    set rg_uf(rg_uf: string | null) {
        if (rg_uf && !validarUF(rg_uf)) {
            throw Error("Cliente Inválido: a uf do RG deve ser uma sigla válida! Ex: SP, RJ, MG, etc.");
        }
        this._rg_uf = rg_uf;
    }

    set telefone(telefone: string | null) {
        if (telefone && !validarTelefone(telefone)) {
            throw Error("Cliente Inválido: o telefone deve ser um número válido! Ex: (99) 9999-9999");
        }
        this._telefone = telefone;
    }

    set celular(celular: string | null) {
        if (celular && !validarTelefone(celular)) {
            throw Error("Cliente Inválido: o celular deve ser um número válido! Ex: (99) 99999-9999");
        }
        this._celular = celular;
    }

    set email(email: string) {
        if (!validarEmail(email)) {
            throw Error("Cliente Inválido: o email dever ser um endereço válido!");
        }
        this._email = email;
    }

    get documento(): string {
        return this._documento;
    }

    get nome(): string {
        return this._nome;
    }

    get sexo(): string {
        return this._sexo;
    }

    get data_nascimento(): string {
        return this._data_nascimento;
    }

    get registro_uf(): string | null {
        return this._registro_uf;
    }

    get rg_uf(): string | null {
        return this._rg_uf;
    }

    get telefone(): string | null {
        return this._telefone;
    }

    get celular(): string | null {
        return this._celular;
    }

    get email(): string {
        return this._email;
    }
}

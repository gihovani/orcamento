import {IFormaDeEntrega} from "../contratos/entidades/formadeentrega";
import {IEndereco} from "../contratos/entidades/endereco";

export class FormaDeEntrega implements IFormaDeEntrega {
    private _tipo: string;
    private _titulo: string;
    private _prazodeentrega: string;
    private _valor: number;
    observacoes?: string;
    endereco?: IEndereco;

    constructor(
        tipo?: string,
        titulo?: string,
        prazodeentrega?: string,
        valor?: number,
        observacoes?: string,
        endereco?: IEndereco
    ) {
        tipo && (this.tipo = tipo);
        titulo && (this.titulo = titulo);
        prazodeentrega && (this.prazodeentrega = prazodeentrega);
        valor && (this.valor = valor);
        observacoes && (this.observacoes = observacoes);
        endereco && (this.endereco = endereco);
    }

    set tipo(tipo: string) {
        if (!tipo) {
            throw Error('Forma De Entrega Inválida: o tipo é obrigatório!');
        }
        this._tipo = tipo;
    }

    get tipo(): string {
        return this._tipo;
    }

    set titulo(titulo: string) {
        if (!titulo) {
            throw Error('Forma De Entrega Inválida: o título é obrigatório!');
        }
        if (['Frete Normal', 'Frete Expresso', 'No Evento'].indexOf(titulo) < 0) {
            throw Error(`Forma De Entrega Inválida: o título ${titulo} não é válido!`);
        }
        this._titulo = titulo;
    }

    get titulo(): string {
        return this._titulo;
    }

    set prazodeentrega(prazodeentrega: string) {
        if (!prazodeentrega) {
            throw Error('Forma De Entrega Inválida: o Prazo de Entrega é obrigatório!');
        }
        this._prazodeentrega = prazodeentrega;
    }

    get prazodeentrega(): string {
        return this._prazodeentrega;
    }
    set valor(valor: number) {
        if (isNaN(valor)) {
            throw Error('Forma De Entrega Inválida: o Valor de Entrega é obrigatório!');
        }
        this._valor = valor;
    }

    get valor(): number {
        return this._valor || 0;
    }
}
import {IFormaDeEntrega} from "../contratos/entidades/formadeentrega";

export class FormaDeEntrega implements IFormaDeEntrega {
    private _tipo: string;
    private _titulo: string;
    private _prazodeentrega: string;
    valor: number;
    observacoes?: string;

    constructor(
        tipo: string,
        titulo: string,
        prazodeentrega: string,
        valor: number,
        observacoes?: string
    ) {
        this.tipo = tipo;
        this.titulo = titulo;
        this.prazodeentrega = prazodeentrega;
        this.valor = valor;
        this.observacoes = observacoes;
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
        if (['Frete Normal', 'Frete Expresso'].indexOf(titulo) < 0) {
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
}
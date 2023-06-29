import {IRegraPromocionalAcao, IRegraPromocionalCondicao} from "../../contratos/regrapromocional";
import {RegraPromocional} from "../regrapromocional";

export class Regrapromocionalluva extends RegraPromocional {
    constructor(
        public nome: string,
        public prioridade: number,
        public situacao: boolean,
        public data_inicio: Date,
        public data_fim: Date,
        public condicoes: IRegraPromocionalCondicao[],
        public acao: IRegraPromocionalAcao,
        public descricao?: string,
        public imagem_desktop?: string,
        public imagem_mobile?: string
    ) {
        super(nome, prioridade, situacao, data_inicio, data_fim, condicoes, acao, descricao, imagem_desktop, imagem_mobile);
        throw new Error('Regra de promoção não implementada');
    }
}

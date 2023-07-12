import {IRegraPromocional} from "../regrapromocional";

export interface IApiRegraPromocional {
    listar(): Promise<IRegraPromocional[]>;
}
export interface EventBodyDTO{
    type:string;
    destination:string;
    origin?:string;
    amount:number;
}
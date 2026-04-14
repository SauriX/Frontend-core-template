export interface modalData {
    title:string,
    icon:'bi-check-circle-fill'|'bi-x-circle-fill'|'bi-exclamation-triangle-fill',
    parrafos:string[],
    theme:'warning'|'error'|'success',
    canceltext:string,
    oktext:string,
    showCancel:boolean,
    ShowOk:boolean,
}

export class  modalData implements modalData {
    title ="Success";
    icon:'bi-check-circle-fill'|'bi-x-circle-fill'|'bi-exclamation-triangle-fill' = 'bi-check-circle-fill';
    theme: "warning" | "error" | "success" = 'success';
    parrafos= ['Success'];
    canceltext = 'cancel';
    oktext = 'ok';
    showCancel= true;
    ShowOk=true;
    constructor(init?: modalData) {
        Object.assign(this, init);
    }
}
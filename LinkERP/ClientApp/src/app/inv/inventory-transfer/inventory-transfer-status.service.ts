import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class InventoryTransferStatusService {
    public status = "Submit";
    public comment;
    public shippedBy=null;
    public receivedBy=null;
    public PartialStatus =false;
    constructor() {
        
    }

}